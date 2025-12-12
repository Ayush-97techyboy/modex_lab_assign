import React, { useEffect, useState } from 'react'
import AdminDashboard from './AdminDashboard'

const API = import.meta.env.VITE_API_BASE || 'http://localhost:4000'

function ShowCard({ show, onBook }) {
  const isDoctor = show.type === 'doctor'
  return (
    <div className="card">
      <h3>{show.title} <small>({show.type})</small></h3>
      {isDoctor ? (
        <div>
          <strong>Slots:</strong>
          <div className="slots">
            {Object.entries(show.slots).map(([t, v]) => (
              <button key={t} disabled={!!v} onClick={() => onBook(show, t)}>
                {t} {v ? '• Booked' : ''}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <strong>Seats (sample):</strong>
          <div className="seats">
            {Object.entries(show.seats).slice(0,50).map(([s, v]) => (
              <span key={s} className={v ? 'seat taken' : 'seat available'}>{s}</span>
            ))}
          </div>
          <div className="note">Booking via seat selection is available in detailed view (demo selects first available).</div>
          <button onClick={() => onBook(show)}>Book (auto-select)</button>
        </div>
      )}
    </div>
  )
}

export default function App() {
  const [shows, setShows] = useState([])
  const [msgs, setMsgs] = useState([])
  const [view, setView] = useState('customer') // 'customer' or 'admin'

  useEffect(() => {
    fetch(API + '/api/shows').then((r) => r.json()).then(setShows)

    const ws = new WebSocket((API + '').replace('http', 'ws'))
    ws.addEventListener('message', (ev) => {
      try {
        const msg = JSON.parse(ev.data)
        setMsgs((m) => [JSON.stringify(msg), ...m].slice(0, 10))
        // refresh shows to get updated seat/slot state
        fetch(API + '/api/shows').then((r) => r.json()).then(setShows)
      } catch (e) {}
    })
    return () => ws.close()
  }, [])

  async function onBook(show, slot) {
    const user = { name: 'Demo User', email: 'demo@local' }
    if (show.type === 'doctor') {
      const res = await fetch(API + '/api/book', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ showId: show.id, type: 'doctor', seats: slot, user })
      })
      const json = await res.json()
      if (res.ok) alert('Booked: ' + json.id)
      else alert(JSON.stringify(json))
      return
    }

    // auto-select first available seat(s)
    const firstAvailable = Object.entries(show.seats).find(([k,v]) => !v)
    if (!firstAvailable) return alert('No seats available')
    const seatId = firstAvailable[0]
    const res = await fetch(API + '/api/book', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ showId: show.id, type: show.type, seats: [seatId], user })
    })
    const json = await res.json()
    if (res.ok) alert('Booked seat: ' + json.id)
    else alert(JSON.stringify(json))
  }

  return (
    <div style={{padding:20}}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1>Modex Ticket Platform</h1>
        <div className="view-toggle">
          <button 
            className={view === 'customer' ? 'active' : ''} 
            onClick={() => setView('customer')}
          >
            Customer View
          </button>
          <button 
            className={view === 'admin' ? 'active' : ''} 
            onClick={() => setView('admin')}
          >
            Admin Dashboard
          </button>
        </div>
      </div>

      {view === 'admin' ? (
        <AdminDashboard />
      ) : (
        <div style={{display:'flex', gap:20}}>
          <div style={{flex:1}}>
            {shows.map((s) => (
              <ShowCard key={s.id} show={s} onBook={onBook} />
            ))}
          </div>
          <div style={{width:320}}>
            <h3>Events</h3>
            <div className="events">
              {msgs.map((m, i) => <div key={i} className="event">{m}</div>)}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
