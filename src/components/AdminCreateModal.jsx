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
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0 }}>Provision New Administrator</h3>
          <button onClick={onClose} style={closeBtnStyle}>✕</button>
        </div>

        {error && <div style={{ ...statusStyle, backgroundColor: '#fee2e2', color: '#b91c1c' }}>{error}</div>}
        {success && <div style={{ ...statusStyle, backgroundColor: '#dcfce7', color: '#15803d' }}>{success}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '12px' }}>
            <label style={labelStyle}>Admin Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. secondary_admin"
              required
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Temporary/Permanent Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter secure password"
              required
              style={inputStyle}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button type="button" onClick={onClose} style={cancelBtnStyle}>Cancel</button>
            <button type="submit" disabled={loading} style={submitBtnStyle}>
              {loading ? 'Creating...' : 'Create Admin'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const overlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
const modalStyle = { backgroundColor: '#fff', padding: '24px', borderRadius: '8px', width: '400px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' };
const labelStyle = { display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '4px', color: '#374151' };
const inputStyle = { width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px', boxSizing: 'border-box' };
const statusStyle = { padding: '8px', borderRadius: '4px', marginBottom: '12px', fontSize: '13px' };
const closeBtnStyle = { background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer', color: '#6b7280' };
const cancelBtnStyle = { padding: '8px 14px', border: '1px solid #d1d5db', background: '#fff', borderRadius: '4px', cursor: 'pointer' };
const submitBtnStyle = { padding: '8px 14px', border: 'none', background: '#4f46e5', color: '#fff', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' };