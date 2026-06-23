/**
 * Dashboard Page
 * Shows emotion history, stats, charts, and quick actions.
 */

import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Sidebar from '../components/Sidebar'
import HistoryTable from '../components/HistoryTable'
import EmotionCharts from '../components/EmotionCharts'
import { Link } from 'react-router-dom'

import { API_BASE_URL } from '../config'

function Dashboard({ user, onLogout }) {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()

  // Fetch emotion history from the API
  const fetchHistory = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/history/${user.id}`)
      setHistory(res.data.history)
    } catch (err) {
      console.error('Failed to fetch history:', err)
    } finally {
      setLoading(false)
    }
  }, [user.id])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  // Compute stats from history
  const totalScans = history.length
  const mostCommon = totalScans > 0
    ? Object.entries(
      history.reduce((acc, h) => { acc[h.emotion] = (acc[h.emotion] || 0) + 1; return acc }, {})
    ).sort((a, b) => b[1] - a[1])[0]?.[0] || '—'
    : '—'
  const avgConfidence = totalScans > 0
    ? (history.reduce((sum, h) => sum + h.confidence, 0) / totalScans).toFixed(1)
    : '0'

  const handleLogout = () => {
    onLogout()
    navigate('/')
  }

  return (
    <div className="app-layout">
      <Sidebar
        user={user}
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="main-content">
        <div className="page-header">
          <h1>Dashboard</h1>
          <p>Welcome back, {user.name}. Here's your emotion journey.</p>
        </div>

        {/* Stats cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </div>
            <div className="stat-value">{totalScans}</div>
            <div className="stat-label">Total Scans</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
            <div className="stat-value">{mostCommon}</div>
            <div className="stat-label">Most Common Emotion</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>  
            </div>
            <div className="stat-value">{avgConfidence}%</div>
            <div className="stat-label">Average Confidence</div>
          </div>

          <div className="stat-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/detect')}>
            <div className="stat-icon"> 
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg></div>
            <div className="stat-value" style={{ fontSize: '1.1rem' }}>New Scan</div>
            <div className="stat-label">Detect your emotion</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div className="card-title">Quick Actions</div>
          <div className="quick-actions-list" style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            <Link to="/detect" className="action-btn primary">
              <span className="icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </span>
              Start New Emotion Scan
            </Link>
            <Link to="/history" className="action-btn primary">
              <span className="icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              </span>
              View Emotion History
            </Link>
            <Link to="/profile" className="action-btn primary">
              <span className="icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
              Edit Profile
            </Link>
          </div>
        </div>

        {/* Emotion Charts */}
        {!loading && <EmotionCharts history={history} />}

        {/* Recent Detections */}
        <div className="card" style={{ marginTop: '2rem' }}>
          <div className="card-title">Recent Detections</div>
          {loading ? (
            <div className="loading-overlay">
              <div className="spinner" />
              <span>Loading history...</span>
            </div>
          ) : (
            <div className="recent-detections-table">
              {history.length > 0 ? (
                <HistoryTable history={history.slice(0, 5)} />
              ) : (
                <div className="empty-table-state">
                  <p>No detections yet — <Link to="/detect">start a scan</Link> to see your history.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Dashboard
