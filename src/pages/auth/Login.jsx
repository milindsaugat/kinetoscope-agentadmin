/* ============================================================
   Page: Login.jsx
   Description: Agent login page — Email + Password
   ============================================================ */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Mock login — accept any credentials
    setTimeout(() => {
      localStorage.setItem('kfpl_agent_auth', JSON.stringify({
        token: 'mock_jwt_token',
        agent: { id: 'ag_001', name: 'Rajesh Sharma', agentId: 'KFPL-AG-1042', email: email },
      }));
      setLoading(false);
      navigate('/dashboard');
    }, 800);
  };

  return (
    <div className="kfpl-auth-page">
      <div className="kfpl-auth-card">
        {/* Logo */}
        <div className="kfpl-auth-logo">
          <div className="kfpl-auth-logo-icon">
            <span>K</span>
          </div>
          <div className="kfpl-auth-logo-text">
            <span className="kfpl-auth-logo-title">KFPL</span>
            <span className="kfpl-auth-logo-sub">Agent Portal</span>
          </div>
        </div>

        <div className="kfpl-auth-heading">
          <h1>Welcome Back</h1>
          <p>Sign in to your agent account</p>
        </div>

        <form onSubmit={handleLogin}>
          {error && (
            <div style={{ padding: '10px 14px', background: 'var(--color-danger-bg)', borderRadius: 'var(--radius-md)', color: '#991B1B', fontSize: 13, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 16, height: 16 }}><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              {error}
            </div>
          )}

          <div className="kfpl-form-group">
            <label className="kfpl-form-label">Email Address</label>
            <input
              className="kfpl-form-input"
              type="email"
              placeholder="agent@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="kfpl-form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label className="kfpl-form-label" style={{ margin: 0 }}>Password</label>
              <a href="/forgot-password" style={{ fontSize: 12, color: 'var(--color-gold)', fontWeight: 500 }}>Forgot Password?</a>
            </div>
            <input
              className="kfpl-form-input"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="kfpl-btn kfpl-btn-primary kfpl-btn-lg"
            style={{ width: '100%', marginTop: 8 }}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--color-text-muted)', marginTop: 24 }}>
          Agent accounts are created by Super Admin.<br/>
          Contact your administrator for access.
        </p>
      </div>
    </div>
  );
}

/* ============ END: Login.jsx ============ */
