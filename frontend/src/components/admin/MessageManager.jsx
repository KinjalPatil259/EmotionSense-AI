import React, { useState, useEffect } from 'react';
import { API_BASE_URL, ADMIN_TOKEN } from '../../config';

const MessageManager = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMsg, setEditingMsg] = useState(null);
  const [formData, setFormData] = useState({ emotion: 'Happy', message: '' });

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/messages`, {
        headers: { 'Authorization': ADMIN_TOKEN }
      });
      const data = await response.json();
      if (response.ok) setMessages(data);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingMsg 
      ? `${API_BASE_URL}/admin/message/${editingMsg.id}` 
      : `${API_BASE_URL}/admin/message`;
    const method = editingMsg ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': ADMIN_TOKEN
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        fetchMessages();
        closeModal();
      }
    } catch (err) {
      console.error('Error saving message:', err);
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await fetch(`${API_BASE_URL}/admin/message/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': ADMIN_TOKEN }
      });
      fetchMessages();
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const openModal = (msg = null) => {
    if (msg) {
      setEditingMsg(msg);
      setFormData({ emotion: msg.emotion, message: msg.message });
    } else {
      setEditingMsg(null);
      setFormData({ emotion: 'Happy', message: '' });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingMsg(null);
  };

  if (loading) return <div>Loading messages...</div>;

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 className="card-title" style={{ margin: 0 }}>Motivational Messages</h3>
        <button className="btn btn-secondary" onClick={() => openModal()}>+ Add New</button>
      </div>

      <div className="history-table-container">
        <table className="history-table">
          <thead>
            <tr>
              <th>Emotion</th>
              <th>Message Content</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((msg) => (
              <tr key={msg.id}>
                <td><strong>{msg.emotion}</strong></td>
                <td>{msg.message}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => openModal(msg)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => deleteMessage(msg.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="auth-card" style={{ maxWidth: '500px' }}>
            <h3>{editingMsg ? 'Edit Message' : 'Add New Message'}</h3>
            <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
              <div className="form-group">
                <label>Emotion Type</label>
                <select 
                  className="form-group input" 
                  value={formData.emotion}
                  onChange={(e) => setFormData({...formData, emotion: e.target.value})}
                  style={{ width: '100%', background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid var(--border)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}
                >
                  {['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral'].map(e => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Motivational Message</label>
                <textarea 
                  className="form-group input"
                  rows="4"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  required
                  style={{ width: '100%', background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid var(--border)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}
                ></textarea>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="submit" className="btn btn-primary">{editingMsg ? 'Update' : 'Create'}</button>
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageManager;
