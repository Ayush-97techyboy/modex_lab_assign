# 🎫 Modex Lab Assign - Multi-Purpose Ticket Booking Platform

A comprehensive, production-ready ticket booking system supporting **Bus Bookings**, **Movie/Show Bookings**, and **Doctor Appointments** with built-in concurrency control, real-time updates, and admin analytics.

## ✨ Features

### Core Booking System
- **🚌 Bus Bookings** - Book numbered seats (40 seats per bus)
- **🎬 Movie/Show Bookings** - Theater seating (8 rows × 10 columns = 80 seats)
- **🏥 Doctor Appointments** - Time slot booking (8 slots per day)
- **Race Condition Prevention** - Per-show locking mechanism to prevent overbooking
- **Real-Time Updates** - WebSocket broadcasts for live seat/slot availability changes

### Admin Dashboard
- **📊 Live Statistics** - Total shows, bookings, active WebSocket connections
- **📈 Occupancy Tracking** - Real-time occupancy rates by show type
- **👥 Booking Breakdown** - Aggregated booking counts by service type
- **🔄 Live Refresh** - Dashboard auto-refreshes every 3 seconds

### Customer Portal
- **Browse Offerings** - View all available buses, movies, and doctor slots
- **Visual Seat Map** - See available/booked seats at a glance
- **Smart Booking** - Auto-select first available seat/slot
- **Live Event Feed** - Real-time booking confirmation notifications

## 📁 Project Structure

```
modex_lab_assign/
├── server/
│   ├── index.js              # Express server with concurrency-safe API
│   ├── load-test.js          # Load testing script for stress testing
│   └── package.json          # Server dependencies
├── client/
│   ├── src/
│   │   ├── App.jsx           # Main app with customer/admin toggle
│   │   ├── AdminDashboard.jsx # Admin analytics dashboard
│   │   ├── main.jsx          # React entry point
│   │   └── styles.css        # Unified styling
│   ├── index.html            # HTML template
│   ├── vite.config.js        # Vite configuration
│   ├── tsconfig.json         # TypeScript config
│   └── package.json          # Client dependencies
├── package.json              # Root workspace config
└── README.md                 # This file
```

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** and **npm 9+**
- **Two terminal windows** (one for server, one for client)

### Installation & Running

**Step 1: Install dependencies**
```powershell
npm install
npm --prefix server install
npm --prefix client install
```

**Step 2: Start the server (Terminal 1)**
```powershell
cd d:\React\modex_lab_assign\server
node index.js
# Output: Server listening on port 4000
```

**Step 3: Start the client (Terminal 2)**
```powershell
cd d:\React\modex_lab_assign\client
npm run dev
# Output: ➜  Local: http://localhost:5173/
```

**Step 4: Open your browser**
- Navigate to: **http://localhost:5173/**
- Server API: **http://localhost:4000/**

## 🎮 Using the Application

### Customer View
1. Browse available **Buses**, **Movies**, and **Doctor Slots**
2. Click **"Book (auto-select)"** to book the first available seat/slot
3. Watch real-time updates in the **Events panel** as other users book

### Admin View
1. Toggle **"Admin Dashboard"** button (top-right)
2. View live statistics:
   - Total shows and bookings by type
   - Active WebSocket connections
   - Occupancy rates with visual progress bars
3. Dashboard auto-refreshes every 3 seconds

## 🔄 Concurrency Control Architecture

### Problem Solved
In high-concurrency scenarios, multiple users might try to book the same seat simultaneously, causing race conditions and overbooking.

### Solution Implemented
**Per-Show Lock Mechanism** (`server/index.js`):
```javascript
async function withLock(showId, bookingFunction) {
  while (locks.get(showId)) {
    await new Promise((r) => setTimeout(r, 5)); // wait for lock
  }
  locks.set(showId, true);
  try {
    return await bookingFunction(); // exclusive access
  } finally {
    locks.delete(showId);
  }
}
```

**How it works:**
1. When a booking request arrives, it acquires a lock for that specific show
2. While locked, other requests wait in a queue
3. Once the booking completes, the lock is released
4. Next queued request acquires the lock and proceeds

### For Production
Replace in-memory locks with:
- **PostgreSQL Row-Level Locks** for strong consistency
- **Optimistic Locking** with version numbers (lighter weight)
- **Distributed Locks** (Redis, Consul) for multi-server deployments

## 📡 API Endpoints

### Public Endpoints

**Get All Shows**
```
GET /api/shows
Response: [{ id, type, title, seats/slots }, ...]
```

**Book a Ticket**
```
POST /api/book
Body: {
  "showId": "bus-1" | "movie-1" | "doc-1",
  "type": "bus" | "movie" | "doctor",
  "seats": [seatId] | slotTime,
  "user": { "name": "John", "email": "john@example.com" }
}
Response: { "id": "booking-uuid", "status": "confirmed", ... }
```

**Get All Bookings**
```
GET /api/bookings
Response: [{ id, showId, seats/slot, user, status }, ...]
```

**Health Check**
```
GET /api/health
Response: { "ok": true, "timestamp": "2025-12-12T..." }
```

### Admin Endpoints

**Get Statistics**
```
GET /api/admin/stats
Response: {
  "totalShowsCount": 3,
  "totalBookingsCount": 15,
  "activeWsConnections": 2,
  "showsBreakdown": { "bus": 1, "movie": 1, "doctor": 1 },
  "bookingsByType": { "bus": 5, "movie": 7, "doctor": 3 },
  "occupancyByShow": [...]
}
```

## 🧪 Load Testing

Test the system with concurrent booking attempts:

```powershell
cd server
node load-test.js
```

**What it does:**
- Simulates 20 concurrent booking attempts
- Mix of bus, movie, and doctor bookings
- Reports success/failure rates
- Displays final system statistics

**Sample Output:**
```
✅ Booking 1 SUCCESS: uuid-123 (bus)
✅ Booking 2 SUCCESS: uuid-456 (movie)
❌ Booking 3 FAILED: seat already booked

📊 Results:
Success rate: 95.00%
Total bookings: 19/20
```

## 🛠 Technology Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Server** | Express.js | REST API, WebSocket server |
| **Client** | React 18 | UI rendering |
| **Build Tool** | Vite 5 | Fast development & builds |
| **Language** | JavaScript (JSX) | Full-stack development |
| **Real-Time** | WebSocket (ws) | Live updates |
| **Data** | In-Memory Map | Demo storage (replace with DB) |

## 📊 Sample Data

**Bus (bus-1)**
- Type: intercity bus
- Seats: 40 numbered seats
- Example: Book seat 15

**Movie (movie-1)**
- Type: theater showing
- Seats: 80 (8 rows × 10 cols)
- Example: Book seat 5-7 (row 5, col 7)

**Doctor (doc-1)**
- Type: clinic appointment
- Slots: 8 time slots
- Example: Book slot 10:00 AM

## 🔐 Security Considerations

For production deployment, add:
- Authentication/Authorization (JWT tokens)
- Rate limiting (prevent booking spam)
- Input validation (sanitize user data)
- HTTPS/WSS encryption
- Database encryption at rest
- CORS restrictions

## 🚨 Known Limitations (Demo Only)

- ✋ In-memory storage (data lost on server restart)
- ⚠️ No persistent database integration
- 🔓 No authentication system
- 📞 No payment processing
- 📧 No email notifications

## 🎯 Next Steps for Production

1. **Database Integration** → PostgreSQL with transactional locks
2. **Authentication** → JWT-based user system
3. **Payment Gateway** → Stripe/PayPal integration
4. **Email Service** → Confirmation & reminder emails
5. **Caching** → Redis for performance
6. **Monitoring** → Datadog/New Relic for observability
7. **Testing** → Jest for unit/integration tests
8. **Docker** → Containerization for deployment

## 📝 License

Educational project for learning concurrent booking systems.
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
