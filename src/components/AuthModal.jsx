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
    <div className="auth-container">
      <div className="auth-card">
        <h2>
          {isRegister ? 'Staff Registration' : 'IntelliStock Login'}
        </h2>
        <p className="auth-subtitle">
          {isRegister ? 'Create an account to manage stock transactions' : 'Enter your credentials to continue'}
        </p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '12px' }}>
            <label className="form-label">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
              className="form-input"
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label className="form-label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="form-input"
            />
          </div>

          <button type="submit" disabled={loading} className="primary-button">
            {loading ? 'Authenticating...' : isRegister ? 'Register as Staff' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px' }}>
          {isRegister ? (
            <span className="auth-footer">Already have an account? <button type="button" onClick={() => { setIsRegister(false); setError(null); }} className="link-button">Log In</button></span>
          ) : (
            <span className="auth-footer">New staff member? <button type="button" onClick={() => { setIsRegister(true); setError(null); }} className="link-button">Register here</button></span>
          )}
        </div>
      </div>
    </div>
  );
}
