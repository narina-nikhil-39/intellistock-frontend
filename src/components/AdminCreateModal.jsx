import React, { useState } from 'react';
import { createAdminUser } from '../api/authService';

export default function AdminCreateModal({ isOpen, onClose }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      await createAdminUser({ username, password });
      setSuccess(`Admin account '${username}' successfully created!`);
      setUsername('');
      setPassword('');
      setTimeout(() => {
        setSuccess(null);
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create admin user.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-heading">
          <h3>Provision New Administrator</h3>
          <button onClick={onClose} className="modal-close" aria-label="Close">✕</button>
        </div>

        {error && <div style={{ ...statusStyle, backgroundColor: '#fee2e2', color: '#b91c1c' }}>{error}</div>}
        {success && <div style={{ ...statusStyle, backgroundColor: '#dcfce7', color: '#15803d' }}>{success}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '12px' }}>
            <label className="form-label">Admin Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. secondary_admin"
              required
              className="modal-input"
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label className="form-label">Temporary/Permanent Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter secure password"
              required
              className="modal-input"
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="modal-secondary">Cancel</button>
            <button type="submit" disabled={loading} className="modal-submit">
              {loading ? 'Creating...' : 'Create Admin'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const statusStyle = { padding: '8px', borderRadius: '4px', marginBottom: '12px', fontSize: '13px' };