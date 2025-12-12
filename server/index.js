const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const http = require('http');
const WebSocket = require('ws');
const { pool, initDB, seedData } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Simple per-show lock to avoid race conditions
const locks = new Map();
async function withLock(id, fn) {
  while (locks.get(id)) {
    await new Promise((r) => setTimeout(r, 5));
  }
  locks.set(id, true);
  try {
    return await fn();
  } finally {
    locks.delete(id);
  }
}

// Initialize database and seed data
async function initializeApp() {
  try {
    await initDB();
    await seedData();
    console.log('Database initialized and seeded');
  } catch (err) {
    console.error('Database initialization failed:', err);
    process.exit(1);
  }
}

initializeApp();

// Simple WebSocket hub with connection tracking
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
let wsConnections = 0;

wss.on('connection', (ws) => {
  wsConnections++;
  console.log(`WebSocket client connected. Total: ${wsConnections}`);
  
  ws.on('close', () => {
    wsConnections--;
    console.log(`WebSocket client disconnected. Total: ${wsConnections}`);
  });
  
  ws.on('error', (err) => {
    console.error('WebSocket error:', err.message);
  });
});

function broadcast(event, payload) {
  const msg = JSON.stringify({ event, payload, timestamp: new Date().toISOString() });
  wss.clients.forEach((c) => {
    if (c.readyState === WebSocket.OPEN) c.send(msg);
  });
}

app.get('/api/shows', async (req, res) => {
  try {
    const showsResult = await pool.query('SELECT * FROM shows ORDER BY start_time');
    const shows = showsResult.rows;

    const showsWithAvailability = await Promise.all(shows.map(async (show) => {
      if (show.type === 'doctor') {
        const slotsResult = await pool.query('SELECT slot_time, status FROM slots WHERE show_id = $1', [show.id]);
        const slots = {};
        slotsResult.rows.forEach(row => {
          slots[row.slot_time] = row.status === 'booked' ? 'booked' : null;
        });
        return {
          id: show.id,
          type: show.type,
          title: show.title,
          start_time: show.start_time,
          slots
        };
      } else {
        const seatsResult = await pool.query('SELECT seat_id, status FROM seats WHERE show_id = $1', [show.id]);
        const seats = {};
        seatsResult.rows.forEach(row => {
          seats[row.seat_id] = row.status === 'booked' ? 'booked' : null;
        });
        return {
          id: show.id,
          type: show.type,
          title: show.title,
          start_time: show.start_time,
          seats
        };
      }
    }));

    res.json(showsWithAvailability);
  } catch (err) {
    console.error('Error fetching shows:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Booking endpoint: body { showId, type, seats: [seatIds] | slot }
app.post('/api/book', async (req, res) => {
  const { showId, seats, type, user } = req.body;
  if (!showId || !type || !user) return res.status(400).json({ error: 'missing parameters' });

  const show = shows.get(showId);
  if (!show) return res.status(404).json({ error: 'show not found' });

  // Use per-show lock to avoid race conditions
  try {
    const result = await withLock(showId, async () => {
      if (type === 'doctor') {
        const slot = seats; // single slot string
        if (!show.slots.hasOwnProperty(slot)) return { ok: false, error: 'invalid slot' };
        if (show.slots[slot]) return { ok: false, error: 'slot already booked' };
        const id = uuidv4();
        show.slots[slot] = id;
        const booking = { id, showId, type, slot, user, status: 'confirmed' };
        bookings.set(id, booking);
        return { ok: true, booking };
      }

      // seats is array
      if (!Array.isArray(seats) || seats.length === 0) return { ok: false, error: 'no seats selected' };
      const unavailable = seats.filter((s) => show.seats[s]);
      if (unavailable.length) return { ok: false, error: 'some seats already booked', unavailable };
      // mark seats
      const id = uuidv4();
      seats.forEach((s) => (show.seats[s] = id));
      const booking = { id, showId, type, seats, user, status: 'confirmed' };
      bookings.set(id, booking);
      return { ok: true, booking };
    });

    if (!result.ok) return res.status(409).json(result);
    // broadcast update
    broadcast('booking_created', result.booking);
    return res.json(result.booking);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'internal error' });
  }
});

app.get('/api/bookings', async (req, res) => {
  try {
    const bookingsResult = await pool.query('SELECT * FROM bookings ORDER BY created_at DESC');
    const bookings = bookingsResult.rows.map(row => ({
      id: row.id,
      showId: row.show_id,
      type: row.type,
      user: {
        name: row.user_name,
        email: row.user_email
      },
      seats: row.seats,
      slot: row.slot_time,
      status: row.status,
      created_at: row.created_at,
      expires_at: row.expires_at
    }));
    res.json(bookings);
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin analytics endpoint
app.get('/api/admin/stats', (req, res) => {
  const stats = {
    totalShowsCount: shows.size,
    totalBookingsCount: bookings.size,
    activeWsConnections: wsConnections,
    showsBreakdown: {
      bus: Array.from(shows.values()).filter(s => s.type === 'bus').length,
      movie: Array.from(shows.values()).filter(s => s.type === 'movie').length,
      doctor: Array.from(shows.values()).filter(s => s.type === 'doctor').length,
    },
    bookingsByType: {
      bus: Array.from(bookings.values()).filter(b => b.type === 'bus').length,
      movie: Array.from(bookings.values()).filter(b => b.type === 'movie').length,
      doctor: Array.from(bookings.values()).filter(b => b.type === 'doctor').length,
    },
    occupancyByShow: Array.from(shows.values()).map((s) => {
      let booked = 0;
      let total = 0;
      if (s.type === 'doctor') {
        total = Object.keys(s.slots).length;
        booked = Object.values(s.slots).filter(v => v !== null).length;
      } else {
        total = Object.keys(s.seats).length;
        booked = Object.values(s.seats).filter(v => v !== null).length;
      }
      return {
        showId: s.id,
        title: s.title,
        type: s.type,
        total,
        booked,
        available: total - booked,
        occupancyRate: ((booked / total) * 100).toFixed(2) + '%'
      };
    })
  };
  res.json(stats);
});

// Admin endpoints for show management
app.post('/api/admin/shows', async (req, res) => {
  const { type, title, start_time, total_seats } = req.body;

  if (!type || !title || !start_time) {
    return res.status(400).json({ error: 'Missing required fields: type, title, start_time' });
  }

  if (!['bus', 'movie', 'doctor'].includes(type)) {
    return res.status(400).json({ error: 'Invalid type. Must be bus, movie, or doctor' });
  }

  if ((type === 'bus' || type === 'movie') && (!total_seats || total_seats <= 0)) {
    return res.status(400).json({ error: 'total_seats is required and must be positive for bus and movie types' });
  }

  try {
    const id = uuidv4();
    await pool.query(
      'INSERT INTO shows (id, type, title, start_time, total_seats) VALUES ($1, $2, $3, $4, $5)',
      [id, type, title, start_time, total_seats || null]
    );

    // Create seats/slots
    if (type === 'bus') {
      for (let i = 1; i <= total_seats; i++) {
        await pool.query(
          'INSERT INTO seats (show_id, seat_id) VALUES ($1, $2)',
          [id, i.toString()]
        );
      }
    } else if (type === 'movie') {
      for (let r = 1; r <= 8; r++) {
        for (let c = 1; c <= 10; c++) {
          await pool.query(
            'INSERT INTO seats (show_id, seat_id) VALUES ($1, $2)',
            [id, `${r}-${c}`]
          );
        }
      }
    } else if (type === 'doctor') {
      const slots = ['09:00','09:30','10:00','10:30','11:00','11:30','14:00','14:30'];
      for (const slot of slots) {
        await pool.query(
          'INSERT INTO slots (show_id, slot_time) VALUES ($1, $2)',
          [id, slot]
        );
      }
    }

    const newShow = {
      id,
      type,
      title,
      start_time,
      total_seats: total_seats || null
    };

    broadcast('show_created', newShow);
    res.status(201).json(newShow);
  } catch (err) {
    console.error('Error creating show:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/admin/shows', async (req, res) => {
  try {
    const showsResult = await pool.query('SELECT * FROM shows ORDER BY created_at DESC');
    res.json(showsResult.rows);
  } catch (err) {
    console.error('Error fetching admin shows:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/admin/shows/:id', async (req, res) => {
  const { id } = req.params;
  const { title, start_time } = req.body;

  if (!title || !start_time) {
    return res.status(400).json({ error: 'title and start_time are required' });
  }

  try {
    const result = await pool.query(
      'UPDATE shows SET title = $1, start_time = $2 WHERE id = $3 RETURNING *',
      [title, start_time, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Show not found' });
    }

    broadcast('show_updated', result.rows[0]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating show:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/admin/shows/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Check if show has bookings
    const bookingsCount = await pool.query('SELECT COUNT(*) FROM bookings WHERE show_id = $1', [id]);
    if (parseInt(bookingsCount.rows[0].count) > 0) {
      return res.status(400).json({ error: 'Cannot delete show with existing bookings' });
    }

    // Delete seats/slots first
    await pool.query('DELETE FROM seats WHERE show_id = $1', [id]);
    await pool.query('DELETE FROM slots WHERE show_id = $1', [id]);

    // Delete show
    const result = await pool.query('DELETE FROM shows WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Show not found' });
    }

    broadcast('show_deleted', { id });
    res.json({ message: 'Show deleted successfully' });
  } catch (err) {
    console.error('Error deleting show:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Basic health
app.get('/api/health', (req, res) => res.json({ ok: true, timestamp: new Date().toISOString() }));

// Start server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log('Server listening on port', PORT);
});
