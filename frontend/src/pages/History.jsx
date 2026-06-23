/**
 * History Page
 * Dedicated page for viewing full emotion scan history.
 */

import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Sidebar from '../components/Sidebar'
import HistoryTable from '../components/HistoryTable'

import { API_BASE_URL } from '../config'

function History({ user, onLogout }) {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()

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
        {/* <div className="mobile-header">
          <button
            className="mobile-toggle"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>
        </div> */}

        <div className="page-header">
          <h1>Emotion History</h1>
          <p>Review all your past facial emotion scans and insights.</p>
        </div>

        <div className="card">
          <div className="card-title">All Detections</div>
          {loading ? (
            <div className="loading-overlay">
              <div className="spinner" />
              <span>Loading history...</span>
            </div>
          ) : (
            <HistoryTable history={history} />
          )}
        </div>
      </main>
    </div>
  )
}

export default History
