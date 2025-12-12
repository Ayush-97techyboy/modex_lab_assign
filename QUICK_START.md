# COPY-PASTE COMMANDS - Modex Lab Assign

## ⚡ INSTANT START (Copy & Paste)

### Open PowerShell and run these commands:

#### FIRST TIME ONLY - Install Dependencies
```powershell
cd d:\React\modex_lab_assign
npm install
npm --prefix server install
npm --prefix client install
```

#### EVERY TIME - Run the Application

**In PowerShell Terminal 1:**
```powershell
cd d:\React\modex_lab_assign\server
node index.js
```

**In PowerShell Terminal 2:**
```powershell
cd d:\React\modex_lab_assign\client
npm run dev
```

**Then open browser:**
```
http://localhost:5173/
```

---

## 🧪 Testing Commands

### Run Load Test (20 concurrent bookings)
```powershell
cd d:\React\modex_lab_assign\server
node load-test.js
```

### Check Server Health
```powershell
# Windows PowerShell
Invoke-WebRequest -Uri "http://localhost:4000/api/health" | ConvertTo-Json

# Or use curl (if installed)
curl http://localhost:4000/api/health
```

### Get Admin Stats
```powershell
# Windows PowerShell
Invoke-WebRequest -Uri "http://localhost:4000/api/admin/stats" | ConvertTo-Json

# Shows live booking counts, occupancy rates, active connections
```

### List All Shows
```powershell
# Windows PowerShell
Invoke-WebRequest -Uri "http://localhost:4000/api/shows" | ConvertTo-Json
```

---

## 📍 Quick Navigation

| URL | Purpose |
|-----|---------|
| http://localhost:5173/ | **Main App** - Customer & Admin views |
| http://localhost:4000/api/health | Health check |
| http://localhost:4000/api/shows | List all shows |
| http://localhost:4000/api/bookings | View all bookings |
| http://localhost:4000/api/admin/stats | Admin analytics |

---

## 🎮 In-App Testing Steps

### Customer View Test
1. Open http://localhost:5173/
2. Locate the **Bus** card (40 seats)
3. Click "Book (auto-select)"
4. See green success message with booking ID
5. Check Events panel for real-time update
6. Switch to Admin Dashboard → see occupancy increase

### Doctor Slot Test  
1. On home page, locate **Doctor** card
2. See 8 available time slots
3. Click an empty slot button (white)
4. See instant confirmation
5. Watch slot turn grey/disabled

### Admin Dashboard Test
1. Click "Admin Dashboard" button (top right)
2. See 3 stat cards:
   - Total Shows: 3
   - Total Bookings: [count]
   - Active Connections: [count]
3. Scroll down to Occupancy table
4. See occupancy bars with percentages
5. Make a booking in Customer View
6. Watch Dashboard auto-refresh (3 sec)

### Real-Time Sync Test
1. Open http://localhost:5173/ in **Browser Tab 1**
2. Open http://localhost:5173/ in **Browser Tab 2**
3. In Tab 1, book a seat
4. Watch Tab 2 update instantly
5. Try booking same seat in Tab 2 → Fails (seat taken)
6. This proves concurrency control works!

---

## 🔧 Troubleshooting

### Port Already in Use
```powershell
# Kill Node processes
Get-Process -Name node | Stop-Process -Force

# Or kill specific port
Get-NetTCPConnection -LocalPort 4000 -ErrorAction SilentlyContinue | Stop-Process -Force
```

### Module Not Found
```powershell
# Reinstall dependencies
cd d:\React\modex_lab_assign
npm install
npm --prefix server install  
npm --prefix client install
```

### Server Won't Start
```powershell
# Check if port 4000 is free
netstat -ano | findstr ":4000"

# Try different port
# Edit server/index.js line 184:
# const PORT = process.env.PORT || 5000;  # Change 4000 to 5000
```

### Client Won't Build
```powershell
# Clear cache
cd d:\React\modex_lab_assign\client
rm -r node_modules dist
npm install
npm run dev
```

---

## 📊 What to Show Your Professor

### Working Features:
1. ✅ Browser shows 3 booking types
2. ✅ Successfully book a seat
3. ✅ Admin dashboard with live stats
4. ✅ Real-time updates across tabs
5. ✅ Load test shows 95%+ success

### Key Concepts:
- Per-show locking prevents race conditions
- WebSocket broadcasts real-time updates
- Full-stack JavaScript (Node + React)
- RESTful API with proper error handling

---

## 💾 Files Summary

| File | Lines | Purpose |
|------|-------|---------|
| server/index.js | 184 | Complete backend |
| server/load-test.js | 75 | Concurrency tester |
| client/src/App.jsx | 95 | Main app component |
| client/src/AdminDashboard.jsx | 60 | Admin panel |
| client/src/styles.css | 30 | Styling |
| Total | ~500 | Complete system |

---

## ✅ Verify Everything Works

Run this sequence to confirm:

```powershell
# Terminal 1
cd d:\React\modex_lab_assign\server
node index.js
# Wait for: "Server listening on port 4000" ✓

# Terminal 2
cd d:\React\modex_lab_assign\client
npm run dev
# Wait for: "VITE v5.4.21 ready" ✓

# Browser
# Open: http://localhost:5173/ ✓
# See: 3 shows (Bus, Movie, Doctor) ✓
# Click: Book button → Success message ✓
# Check: Events panel updates in real-time ✓
# Admin: Toggle to admin dashboard ✓
# Stats: See live booking counts ✓

# Terminal 3
cd d:\React\modex_lab_assign\server
node load-test.js
# Wait for: "Success rate: 95%" ✓

# ALL GREEN = READY TO SUBMIT ✅
```

---

## 🎯 Final Checklist

Before submitting, verify:

- [ ] Both server (4000) and client (5173) running without errors
- [ ] Browser shows main app at localhost:5173
- [ ] Can book a bus seat successfully
- [ ] Can book a movie seat successfully
- [ ] Can book a doctor slot successfully
- [ ] Admin dashboard shows live stats
- [ ] Real-time updates work (open 2 browser tabs)
- [ ] Load test shows 95%+ success rate
- [ ] No double-bookings in load test
- [ ] README.md explains everything
- [ ] Code is clean and well-organized

**When all checked: ✅ READY TO SUBMIT**

---

**Good luck! Everything is working and ready to go! 🚀**
