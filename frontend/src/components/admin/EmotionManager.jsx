import React, { useState, useEffect } from 'react';
import { API_BASE_URL, ADMIN_TOKEN } from '../../config';

const EmotionManager = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchLogs();
  }, [filter]);

  const fetchLogs = async () => {
    try {
      const url = filter 
        ? `${API_BASE_URL}/admin/emotions?type=${filter}` 
        : `${API_BASE_URL}/admin/emotions`;
      const response = await fetch(url, {
        headers: { 'Authorization': ADMIN_TOKEN }
      });
      const data = await response.json();
      if (response.ok) setLogs(data);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 className="card-title" style={{ margin: 0 }}>Global Emotion Logs</h3>
        <select 
          className="form-group input" 
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ width: '200px', background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid var(--border)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}
        >
          <option value="">All Emotions</option>
          {['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral'].map(e => (
            <option key={e} value={e}>{e}</option>
          ))}
        </select>
      </div>

      <div className="history-table-container">
        <table className="history-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Emotion</th>
              <th>Confidence</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td>{log.userName}</td>
                <td className="emot-col">{log.emotion}</td>
                <td>{Number(log.confidence).toFixed(2)}%</td>
                <td className="time-col">{new Date(log.timestamp).toLocaleString()}</td>
              </tr>
            ))}
            {logs.length === 0 && !loading && (
              <tr>
                <td colSpan="4" className="empty-table-state">No emotion records found for this filter.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmotionManager;
