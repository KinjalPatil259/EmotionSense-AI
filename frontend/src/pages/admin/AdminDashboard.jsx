import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import UserManager from '../../components/admin/UserManager';
import MessageManager from '../../components/admin/MessageManager';
import EmotionManager from '../../components/admin/EmotionManager';
import { useLocation } from 'react-router-dom';
import { API_BASE_URL, ADMIN_TOKEN } from '../../config';

const AdminDashboard = ({ admin, onLogout }) => {
  const [stats, setStats] = useState({ totalUsers: 0, totalEmotions: 0, totalMessages: 0 });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
        headers: { 'Authorization': ADMIN_TOKEN }
      });
      const data = await response.json();
      if (response.ok) {
        setStats(data.stats);
        setRecentActivity(data.recentActivity);
      }
    } catch (err) {
      console.error('Error fetching admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    const path = location.pathname;
    if (path === '/admin/users') return <UserManager />;
    if (path === '/admin/messages') return <MessageManager />;
    if (path === '/admin/emotions') return <EmotionManager />;
    
    // Default: Dashboard Stats View
    return (
      <>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: 'var(--secondary-light)'}}>
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <div className="stat-value">{stats.totalUsers}</div>
            <div className="stat-label">Total Users</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: 'var(--secondary-light)'}}>
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                <line x1="9" y1="9" x2="9.01" y2="9"></line>
                <line x1="15" y1="9" x2="15.01" y2="9"></line>
              </svg>
            </div>
            <div className="stat-value">{stats.totalEmotions}</div>
            <div className="stat-label">Emotion Scans</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: 'var(--secondary-light)'}}>
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <div className="stat-value">{stats.totalMessages}</div>
            <div className="stat-label">Messages Built</div>
          </div>
        </div>

        <div className="card">
          <h3 className="card-title">Recent System Activity</h3>
          <div className="history-table-container">
            <table className="history-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Detected Emotion</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity, idx) => (
                    <tr key={idx}>
                      <td>{activity.user}</td>
                      <td className="emot-col">{activity.emotion}</td>
                      <td className="time-col">{new Date(activity.time).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="empty-table-state">No recent activity found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="app-layout">
      <AdminSidebar onLogout={onLogout} />
      <main className="main-content">
        <header className="page-header">
          <h1>Welcome, Admin {admin?.name}</h1>
          <p>System status and management overview</p>
        </header>

        {loading ? (
          <div className="trend-placeholder">Loading system statistics...</div>
        ) : (
          renderContent()
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
