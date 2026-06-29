/* ============================================================
   Page: ForgotPassword.jsx
   Description: Email-based OTP password reset flow
   ============================================================ */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1=email, 2=otp, 3=newPassword
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 800);
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(3);
    }, 800);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/login');
    }, 800);
  };

  return (
    <div className="kfpl-auth-page">
      <div className="kfpl-auth-card">
        <div className="kfpl-auth-logo">
          <div className="kfpl-auth-logo-icon"><span>K</span></div>
          <div className="kfpl-auth-logo-text">
            <span className="kfpl-auth-logo-title">KFPL</span>
            <span className="kfpl-auth-logo-sub">Agent Portal</span>
          </div>
        </div>

        <div className="kfpl-auth-heading">
          <h1>Reset Password</h1>
          <p>{step === 1 ? 'Enter your email to receive a 6-digit OTP' : step === 2 ? 'Enter the OTP sent to your email' : 'Set your new password'}</p>
        </div>

        {step === 1 && (
          <form onSubmit={handleSendOTP}>
            <div className="kfpl-form-group">
              <label className="kfpl-form-label">Email Address</label>
              <input className="kfpl-form-input" type="email" placeholder="agent@example.com" value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
            </div>
            <button type="submit" className="kfpl-btn kfpl-btn-primary kfpl-btn-lg" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOTP}>
            <div className="kfpl-form-group">
              <label className="kfpl-form-label">6-Digit OTP</label>
              <input className="kfpl-form-input" type="text" placeholder="Enter OTP" value={otp} onChange={e => setOtp(e.target.value)} maxLength={6} required autoFocus style={{ textAlign: 'center', letterSpacing: '0.5em', fontSize: 20, fontFamily: 'var(--font-mono)' }} />
              <span className="kfpl-form-help">OTP expires in 10 minutes.</span>
            </div>
            <button type="submit" className="kfpl-btn kfpl-btn-primary kfpl-btn-lg" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <div className="kfpl-form-group">
              <label className="kfpl-form-label">New Password</label>
              <input className="kfpl-form-input" type="password" placeholder="Enter new password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
            </div>
            <div className="kfpl-form-group">
              <label className="kfpl-form-label">Confirm Password</label>
              <input className="kfpl-form-input" type="password" placeholder="Confirm new password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
            </div>
            <button type="submit" className="kfpl-btn kfpl-btn-primary kfpl-btn-lg" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <a href="/login" style={{ fontSize: 13, color: 'var(--color-gold)', fontWeight: 500 }}>← Back to Sign In</a>
        </div>
      </div>
    </div>
  );
}

/* ============ END: ForgotPassword.jsx ============ */
