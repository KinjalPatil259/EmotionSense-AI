/**
 * App — Root component with routing.
 * Manages authentication state and route protection.
 */

import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Detect from './pages/Detect'
import History from './pages/History'
import Home from './pages/Home'

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard'

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('emotion_user')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        localStorage.removeItem('emotion_user')
      }
    }
    return null
  })

  const [admin, setAdmin] = useState(() => {
    const savedAdmin = localStorage.getItem('emotion_admin')
    if (savedAdmin) {
      try {
        return JSON.parse(savedAdmin)
      } catch {
        localStorage.removeItem('emotion_admin')
      }
    }
    return null
  })

  // useEffect for handling any side effects on mount if needed
  useEffect(() => {
    // Already initialized in useState lazy initializer
  }, [])

  // Save user to localStorage when it changes
  const handleLogin = (userData) => {
    setUser(userData)
    localStorage.setItem('emotion_user', JSON.stringify(userData))
    // If the user is an admin, also set admin state so admin routes work
    if (userData.role === 'admin') {
      setAdmin(userData)
      localStorage.setItem('emotion_admin', JSON.stringify(userData))
      localStorage.setItem('admin_token', 'admin-jwt-token-simulated')
    }
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('emotion_user')
    // Also clear admin state
    setAdmin(null)
    localStorage.removeItem('emotion_admin')
    localStorage.removeItem('admin_token')
  }



  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={
            user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />
          }
        />
        <Route
          path="/register"
          element={
            user ? <Navigate to="/dashboard" /> : <Register onLogin={handleLogin} />
          }
        />

        {/* User Protected routes */}
        <Route
          path="/dashboard"
          element={
            user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/" />
          }
        />
        <Route
          path="/detect"
          element={
            user ? <Detect user={user} onLogout={handleLogout} /> : <Navigate to="/" />
          }
        />
        <Route
          path="/history"
          element={
            user ? <History user={user} onLogout={handleLogout} /> : <Navigate to="/" />
          }
        />

        {/* Admin routes — requires admin login via regular /login */}
        <Route
          path="/admin"
          element={<Navigate to={admin ? "/admin/dashboard" : "/"} />}
        />
        <Route
          path="/admin/login"
          element={<Navigate to="/" />}
        />
        <Route
          path="/admin/dashboard"
          element={
            admin ? <AdminDashboard admin={admin} onLogout={handleLogout} /> : <Navigate to="/" />
          }
        />
        <Route
          path="/admin/users"
          element={
            admin ? <AdminDashboard admin={admin} onLogout={handleLogout} /> : <Navigate to="/" />
          }
        />
        <Route
          path="/admin/messages"
          element={
            admin ? <AdminDashboard admin={admin} onLogout={handleLogout} /> : <Navigate to="/" />
          }
        />
        <Route
          path="/admin/emotions"
          element={
            admin ? <AdminDashboard admin={admin} onLogout={handleLogout} /> : <Navigate to="/" />
          }
        />

        {/* Default redirect */}
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} />} />
      </Routes>
    </Router>
  )
}

export default App
