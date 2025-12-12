const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:4000';

async function simulateBookingLoad() {
  console.log('Starting booking load simulation...');
  console.log(`Target API: ${API_URL}`);

  const showIds = ['bus-1', 'movie-1', 'doc-1'];
  const users = [
    { name: 'Alice', email: 'alice@example.com' },
    { name: 'Bob', email: 'bob@example.com' },
    { name: 'Charlie', email: 'charlie@example.com' },
    { name: 'Diana', email: 'diana@example.com' },
  ];

  // Fetch shows to understand structure
  try {
    const showsRes = await axios.get(`${API_URL}/api/shows`);
    const shows = showsRes.data;
    console.log(`Loaded ${shows.length} shows\n`);

    let successCount = 0;
    let failureCount = 0;
    const startTime = Date.now();

    // Simulate 20 concurrent booking attempts with some time spacing
    const bookingPromises = [];
    for (let i = 0; i < 20; i++) {
      const showId = showIds[i % showIds.length];
      const show = shows.find(s => s.id === showId);
      const user = users[i % users.length];

      let bookingPayload;
      if (show.type === 'doctor') {
        const slots = Object.keys(show.slots).filter(t => !show.slots[t]);
        if (slots.length === 0) {
          console.log(`⚠️  No available doctor slots for booking ${i + 1}`);
          continue;
        }
        bookingPayload = {
          showId,
          type: 'doctor',
          seats: slots[0],
          user
        };
      } else {
        const availableSeats = Object.keys(show.seats).filter(s => !show.seats[s]);
        if (availableSeats.length === 0) {
          console.log(`⚠️  No available seats for ${show.type} booking ${i + 1}`);
          continue;
        }
        bookingPayload = {
          showId,
          type: show.type,
          seats: [availableSeats[0]],
          user
        };
      }

      const bookingPromise = axios
        .post(`${API_URL}/api/book`, bookingPayload)
        .then((res) => {
          successCount++;
          const booking = res.data;
          console.log(`✅ Booking ${i + 1} SUCCESS: ${booking.id} (${show.type})`);
        })
        .catch((err) => {
          failureCount++;
          const errMsg = err.response?.data?.error || err.message;
          console.log(`❌ Booking ${i + 1} FAILED: ${errMsg}`);
        });

      bookingPromises.push(bookingPromise);

      // Add slight delay to avoid overwhelming the server
      if ((i + 1) % 5 === 0) {
        await new Promise(r => setTimeout(r, 100));
      }
    }

    await Promise.all(bookingPromises);
    const endTime = Date.now();

    console.log('\n📊 Load Test Results:');
    console.log(`Total time: ${endTime - startTime}ms`);
    console.log(`Successful bookings: ${successCount}`);
    console.log(`Failed bookings: ${failureCount}`);
    console.log(`Success rate: ${((successCount / (successCount + failureCount)) * 100).toFixed(2)}%`);

    // Fetch final stats
    const statsRes = await axios.get(`${API_URL}/api/admin/stats`);
    const stats = statsRes.data;
    console.log('\n📈 Final Admin Stats:');
    console.log(`Total bookings: ${stats.totalBookingsCount}`);
    console.log(`Bookings by type - Bus: ${stats.bookingsByType.bus}, Movie: ${stats.bookingsByType.movie}, Doctor: ${stats.bookingsByType.doctor}`);
  } catch (err) {
    console.error('Error during load test:', err.message);
    process.exit(1);
  }
}

// Run the simulation
simulateBookingLoad().then(() => {
  console.log('\nLoad test completed!');
  process.exit(0);
}).catch((err) => {
  console.error('Unhandled error:', err);
  process.exit(1);
});
