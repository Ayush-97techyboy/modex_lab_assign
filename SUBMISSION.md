# 🎫 Modex Lab Assignment - Submission Document

**Project**: Multi-Purpose Ticket Booking System  
**Submitted**: December 12, 2025  
**Status**: ✅ COMPLETE & RUNNING  

---

## ✅ Project Completion Checklist

- [x] **Backend Server** - Express.js with concurrency-safe booking API
- [x] **Frontend Client** - Vite + React with real-time updates
- [x] **Bus Booking System** - 40 seats per bus
- [x] **Movie Booking System** - 8×10 theater seats
- [x] **Doctor Appointment System** - 8 time slots per doctor
- [x] **Race Condition Prevention** - Per-show locking mechanism
- [x] **Real-Time Updates** - WebSocket broadcast system
- [x] **Admin Dashboard** - Live statistics & occupancy tracking
- [x] **Customer Portal** - Browse and book interface
- [x] **Load Testing** - Concurrent booking stress test
- [x] **Full Documentation** - API specs, architecture, usage guide

---

## 🚀 How to Run

### Terminal 1 - Start Server
```powershell
cd d:\React\modex_lab_assign\server
node index.js
# Expected: "Server listening on port 4000"
```

### Terminal 2 - Start Client
```powershell
cd d:\React\modex_lab_assign\client
npm run dev
# Expected: "Local: http://localhost:5173/"
```

### Access the Application
- **Client UI**: http://localhost:5173/
- **Server API**: http://localhost:4000/
- **API Health**: http://localhost:4000/api/health

---

## 🎮 Application Features

### Customer View
1. **Browse Shows** - See all available buses, movies, and doctor slots
2. **Visual Seats** - See color-coded available (green) and booked (red) seats
3. **Quick Booking** - Click "Book" to instantly reserve first available seat
4. **Live Updates** - Watch events panel for real-time booking confirmations

### Admin Dashboard
1. **View Metrics** - Total shows, bookings, active connections
2. **Occupancy Rates** - Visual progress bars showing seat/slot availability
3. **Booking Breakdown** - Aggregate counts by service type
4. **Auto-Refresh** - Dashboard updates every 3 seconds

---

## 🔄 Concurrency Control

### Problem
Multiple users booking the same seat simultaneously causes race conditions and overbooking.

### Solution
**Per-Show Lock Mechanism**:
- Each show gets a unique lock
- Booking requests queue for the lock
- Only one request processes at a time per show
- Lock released after booking completes

### Code Location
[`server/index.js`](server/index.js#L20-L29) - `withLock()` function

### Testing
Run load test with 20 concurrent bookings:
```powershell
cd server
node load-test.js
```

**Expected Result**: ~95% success rate, no double-bookings

---

## 📡 API Summary

### Endpoints
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/shows` | List all shows/slots |
| POST | `/api/book` | Create booking |
| GET | `/api/bookings` | List all bookings |
| GET | `/api/admin/stats` | Admin statistics |
| GET | `/api/health` | Health check |

### WebSocket
- **URL**: `ws://localhost:4000`
- **Messages**: Real-time booking events
- **Auto-broadcast**: Every booking triggers live update

---

## 📁 File Structure

```
server/
├── index.js              (184 lines) - Full backend implementation
└── load-test.js          (75 lines) - Stress testing script

client/
├── src/
│   ├── App.jsx           (95 lines) - Main component with view toggle
│   ├── AdminDashboard.jsx (60 lines) - Admin analytics panel
│   ├── main.jsx          (12 lines) - React entry
│   └── styles.css        (30 lines) - All styling
├── index.html            - Entry HTML
├── vite.config.js        - Vite configuration
├── tsconfig.json         - TypeScript config (JSX support)
└── package.json          - Dependencies

Root/
├── package.json          - Workspace config
├── README.md             - Full documentation
└── SUBMISSION.md         - This file
```

---

## 🧪 Testing Instructions

### 1. Manual Testing - Customer Flow
```powershell
# Terminal 1: Start server
cd server ; node index.js

# Terminal 2: Start client  
cd client ; npm run dev

# Browser:
# 1. Open http://localhost:5173
# 2. Click "Book" on bus/movie to reserve a seat
# 3. Watch event feed for confirmation
# 4. Toggle to Admin Dashboard to see occupancy update
```

### 2. Concurrent Booking Test
```powershell
# Terminal 3 (while server/client running):
cd server
node load-test.js

# Expected: 95%+ success rate, 0 double-bookings
```

### 3. Live Update Test
```powershell
# Terminal 1 & 2 running
# Open browser 1: http://localhost:5173
# Open browser 2: http://localhost:5173 (same or different machine)
# Book in browser 1, watch browser 2 update instantly
```

---

## 🏗 Architecture Highlights

### Server Architecture
```
Express Server (Port 4000)
├── HTTP Routes (REST API)
│   ├── GET /api/shows
│   ├── POST /api/book (with per-show lock)
│   ├── GET /api/admin/stats
│   └── GET /api/health
├── WebSocket Server
│   └── broadcast() - Real-time updates to all clients
└── In-Memory Data Stores
    ├── shows Map - All shows with seats/slots
    └── bookings Map - All confirmed bookings
```

### Client Architecture
```
React App (Port 5173)
├── App Component
│   ├── Customer View
│   │   ├── ShowCard (repeatable for each show)
│   │   └── Event Feed (real-time updates)
│   └── Admin View
│       └── AdminDashboard
│           ├── Stats Grid
│           └── Occupancy Table
└── WebSocket Connection
    └── Auto-refresh on booking events
```

### Data Flow
```
User Action → REST API Request → Per-Show Lock → 
DB Update → WebSocket Broadcast → All Clients Refresh
```

---

## 🔧 Technologies Used

| Tech | Version | Purpose |
|------|---------|---------|
| Node.js | v22.20.0 | Runtime |
| Express | 4.18.2 | Backend framework |
| React | 18.2.0 | Frontend library |
| Vite | 5.4.21 | Build tool |
| WebSocket | 8.13.0 | Real-time comm |
| UUID | 9.0.0 | Unique IDs |
| CORS | 2.8.5 | Cross-origin |

---

## 📝 Sample Data

### Bus (bus-1)
- 40 numbered seats
- Auto-generates seats 1-40

### Movie (movie-1)
- 8 rows × 10 columns = 80 seats
- Seat format: "row-column" (e.g., "5-7")

### Doctor (doc-1)
- 8 daily slots
- Times: 09:00, 09:30, 10:00, 10:30, 11:00, 11:30, 14:00, 14:30

---

## ⚠️ Important Notes

### Production Readiness
This is a **teaching/demo project**. For production:
- Replace in-memory storage with PostgreSQL/MongoDB
- Add authentication (JWT)
- Implement rate limiting
- Add payment processing
- Enable HTTPS/WSS
- Deploy with Docker

### Testing Notes
- Load test simulates 20 concurrent bookings
- All data is in-memory (cleared on restart)
- No persistence across restarts
- No authentication required for demo

---

## 🎓 Learning Outcomes

### Concepts Demonstrated
1. **Concurrency Control** - Per-resource locking for race conditions
2. **Real-Time Communication** - WebSocket for instant updates
3. **Full-Stack JavaScript** - Same language frontend & backend
4. **API Design** - RESTful endpoints with proper status codes
5. **State Management** - Managing distributed system state
6. **Component Architecture** - React components with data flow

### Design Patterns Used
- **Lock-Based Concurrency** - Pessimistic concurrency control
- **Event Broadcasting** - WebSocket pub/sub pattern
- **Component Composition** - Reusable React components
- **Separation of Concerns** - Frontend/Backend split

---

## ✨ Summary

**Status**: ✅ Project Complete and Functional

This implementation demonstrates a real-world ticket booking system with:
- ✅ High-concurrency safety (no race conditions)
- ✅ Real-time updates (WebSocket)
- ✅ Multiple booking types (Bus/Movie/Doctor)
- ✅ Admin analytics dashboard
- ✅ Production-ready architecture patterns
- ✅ Full documentation and testing

**Ready for Submission**: YES

---

## 📞 Quick Reference

| Task | Command |
|------|---------|
| Install all deps | `npm install && npm --prefix server install && npm --prefix client install` |
| Start server | `cd server ; node index.js` |
| Start client | `cd client ; npm run dev` |
| Run load test | `cd server ; node load-test.js` |
| Open app | `http://localhost:5173` |
| Check API | `http://localhost:4000/api/health` |
| Admin stats | `http://localhost:4000/api/admin/stats` |

---

**Project created with attention to concurrency, real-time updates, and production best practices.**

**Good luck with your submission! 🚀**
