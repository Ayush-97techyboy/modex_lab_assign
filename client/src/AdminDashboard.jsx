import React, { useEffect, useState } from 'react'

const API = import.meta.env.VITE_API_BASE || 'http://localhost:4000'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const res = await fetch(API + '/api/admin/stats')
        const data = await res.json()
        setStats(data)
        setError(null)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
    const interval = setInterval(fetchStats, 3000) // refresh every 3 seconds
    return () => clearInterval(interval)
  }, [])

  if (loading) return <div className="admin-panel">Loading admin dashboard...</div>
  if (error) return <div className="admin-panel error">Error: {error}</div>

  return (
    <div className="admin-panel">
      <h2>Admin Dashboard</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <h4>Total Shows</h4>
          <div className="stat-value">{stats.totalShowsCount}</div>
          <div className="stat-detail">
            Bus: {stats.showsBreakdown.bus} | Movie: {stats.showsBreakdown.movie} | Doctor: {stats.showsBreakdown.doctor}
          </div>
        </div>

        <div className="stat-card">
          <h4>Total Bookings</h4>
          <div className="stat-value">{stats.totalBookingsCount}</div>
          <div className="stat-detail">
            Bus: {stats.bookingsByType.bus} | Movie: {stats.bookingsByType.movie} | Doctor: {stats.bookingsByType.doctor}
          </div>
        </div>

        <div className="stat-card">
          <h4>Active Connections</h4>
          <div className="stat-value">{stats.activeWsConnections}</div>
          <div className="stat-detail">WebSocket clients</div>
        </div>
      </div>

      <div className="occupancy-section">
        <h3>Occupancy by Show</h3>
        <table className="occupancy-table">
          <thead>
            <tr>
              <th>Show</th>
              <th>Type</th>
              <th>Total</th>
              <th>Booked</th>
              <th>Available</th>
              <th>Rate</th>
            </tr>
          </thead>
          <tbody>
            {stats.occupancyByShow.map((item) => (
              <tr key={item.showId}>
                <td>{item.title}</td>
                <td><span className={`badge badge-${item.type}`}>{item.type}</span></td>
                <td>{item.total}</td>
                <td>{item.booked}</td>
                <td>{item.available}</td>
                <td>
                  <div className="occupancy-bar">
                    <div className="occupancy-fill" style={{ width: item.occupancyRate }}></div>
                    <span>{item.occupancyRate}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
