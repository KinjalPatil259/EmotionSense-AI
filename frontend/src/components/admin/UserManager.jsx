import React, { useState, useEffect } from 'react';
import { API_BASE_URL, ADMIN_TOKEN } from '../../config';

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'user' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users`, {
        headers: { 'Authorization': ADMIN_TOKEN }
      });
      const data = await response.json();
      if (response.ok) setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user and all their history?')) return;
    try {
      const response = await fetch(`${API_BASE_URL}/admin/user/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': ADMIN_TOKEN }
      });
      if (response.ok) fetchUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await fetch(`${API_BASE_URL}/admin/user`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': ADMIN_TOKEN 
        },
        body: JSON.stringify(newUser)
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess('User added successfully!');
        setNewUser({ name: '', email: '', password: '', role: 'user' });
        setTimeout(() => setShowModal(false), 1500);
        fetchUsers();
      } else {
        setError(data.error || 'Failed to add user');
      }
    } catch (err) {
      setError('Connection error');
    }
  };

  const updateRole = async (id, newRole) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/user/${id}/role`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': ADMIN_TOKEN 
        },
        body: JSON.stringify({ role: newRole })
      });
      if (response.ok) {
        fetchUsers();
      }
    } catch (err) {
      console.error('Error updating role:', err);
    }
  };

  if (loading) return <div>Loading users...</div>;

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 className="card-title" style={{ margin: 0 }}>User Management</h3>
        <button className="btn btn-secondary" onClick={() => setShowModal(true)}>
          + Add New
        </button>
      </div>

      <div className="history-table-container">
        <table className="history-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <select 
                    className={`role-select ${user.role === 'admin' ? 'role-admin' : ''}`}
                    value={user.role}
                    onChange={(e) => updateRole(user.id, e.target.value)}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td>
                  <button 
                    className="btn btn-danger btn-sm" 
                    onClick={() => deleteUser(user.id)}
                    disabled={user.role === 'admin' && users.filter(u => u.role === 'admin').length <= 1}
                    title={user.role === 'admin' ? "Cannot delete the last admin" : "Delete User"}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="auth-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Create User Account</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <form onSubmit={handleAddUser}>
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input 
                  type="password" 
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  required 
                  minLength="6"
                />
              </div>
              <div className="form-group">
                <label>Assigned Role</label>
                <select 
                  className="role-select" 
                  style={{ width: '100%', padding: '0.75rem' }}
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                >
                  <option value="user">Standard User</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                Create User Account
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManager;
