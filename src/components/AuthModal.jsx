import React, { useState } from 'react';
import { loginUser, registerUser } from '../api/authService';

export default function AuthModal({ onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload = { username, password };
      const response = isRegister ? await registerUser(payload) : await loginUser(payload);

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({
        username: response.data.username,
        role: response.data.role,
      }));

      onLoginSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={{ textAlign: 'center', margin: '0 0 8px' }}>
          {isRegister ? 'Staff Registration' : 'IntelliStock Login'}
        </h2>
        <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '14px', margin: '0 0 20px' }}>
          {isRegister ? 'Create an account to manage stock transactions' : 'Enter your credentials to continue'}
        </p>

        {error && <div style={errorStyle}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '12px' }}>
            <label style={labelStyle}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              style={inputStyle}
            />
          </div>

          <button type="submit" disabled={loading} style={primaryBtn}>
            {loading ? 'Authenticating...' : isRegister ? 'Register as Staff' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px' }}>
          {isRegister ? (
            <span>Already have an account? <button type="button" onClick={() => { setIsRegister(false); setError(null); }} style={linkBtn}>Log In</button></span>
          ) : (
            <span>New staff member? <button type="button" onClick={() => { setIsRegister(true); setError(null); }} style={linkBtn}>Register here</button></span>
          )}
        </div>
      </div>
    </div>
  );
}

const containerStyle = { minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const cardStyle = { width: '380px', padding: '32px', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', backgroundColor: '#fff' };
const labelStyle = { display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '4px', color: '#374151' };
const inputStyle = { width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '4px', boxSizing: 'border-box' };
const primaryBtn = { width: '100%', padding: '10px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' };
const linkBtn = { background: 'none', border: 'none', color: '#2563eb', fontWeight: 'bold', cursor: 'pointer', padding: 0 };
const errorStyle = { backgroundColor: '#fee2e2', color: '#b91c1c', padding: '10px', borderRadius: '4px', marginBottom: '12px', fontSize: '13px' };