/* ============================================================
   Page: Settings.jsx
   Description: Settings view for Agent Portal. Includes 2FA configuration
   and Change Password (with OTP verification via real API).
   Email change option has been removed per admin directive.
   ============================================================ */

import { useState, useEffect } from 'react';
import { useToast } from '../../components/ui/Toast';
import { apiRequest } from '../../config/apiHelper';

const settingsIcons = {
  lock: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  shield: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
};

export default function Settings() {
  const toast = useToast();
  const [emailVal, setEmailVal] = useState('');
  const [loading, setLoading] = useState(true);

  // 2FA State
  const [tfaEnabled, setTfaEnabled] = useState(
    localStorage.getItem('kfpl_agent_2fa_enabled') === 'true'
  );

  // Password Change Flow States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordOtp, setPasswordOtp] = useState('');
  const [isPasswordOtpSent, setIsPasswordOtpSent] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch current session / email on mount
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const [meRes, profRes] = await Promise.all([
          apiRequest('/api/agent/auth/me').catch(() => null),
          apiRequest('/api/agent/profile').catch(() => null)
        ]);

        let email = '';
        if (meRes) {
          const user = meRes.agent || meRes.user || meRes.data || meRes;
          email = user.email || meRes.data?.user?.email || '';
        }
        if (!email && profRes) {
          const prof = profRes.data || profRes.profile || profRes;
          email = prof.email || '';
        }
        if (!email) {
          try {
            const stored = JSON.parse(localStorage.getItem('kfpl_agent_auth') || '{}');
            const agentObj = stored.agent || stored.user || stored;
            email = agentObj.email || '';
          } catch { /* ignore */ }
        }
        setEmailVal(email);
      } catch (err) {
        console.error('Failed to load session:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, []);

  const handleTfaToggle = (e) => {
    const checked = e.target.checked;
    setTfaEnabled(checked);
    localStorage.setItem('kfpl_agent_2fa_enabled', checked ? 'true' : 'false');
    toast(`Two-Factor Authentication ${checked ? 'Enabled' : 'Disabled'} successfully.`, 'success');
  };

  const handleSendPasswordOtp = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast('Please fill out all password fields.', 'warning');
      return;
    }
    if (newPassword.length < 8) {
      toast('New password must be at least 8 characters.', 'warning');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast('New Password and Confirm Password do not match.', 'danger');
      return;
    }
    setSubmitting(true);
    try {
      await apiRequest('/api/agent/settings/change-password/send-otp', {
        method: 'POST',
        body: JSON.stringify({ currentPassword }),
      });
      setIsPasswordOtpSent(true);
      toast('Security OTP sent to your registered email!', 'info');
    } catch (err) {
      console.error('Send OTP error:', err);
      toast(err.message || 'Failed to send OTP. Check your current password.', 'danger');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyPasswordOtp = async (e) => {
    e.preventDefault();
    if (!passwordOtp || passwordOtp.length < 4) {
      toast('Please enter a valid OTP code.', 'warning');
      return;
    }
    setSubmitting(true);
    try {
      await apiRequest('/api/agent/settings/change-password/verify-otp', {
        method: 'POST',
        body: JSON.stringify({
          currentPassword,
          newPassword,
          otp: passwordOtp,
        }),
      });
      toast('Password changed successfully!', 'success');
      // Reset flow
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordOtp('');
      setIsPasswordOtpSent(false);
      setShowPasswordSection(false);
    } catch (err) {
      console.error('Verify OTP error:', err);
      toast(err.message || 'Invalid OTP or password change failed.', 'danger');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="kfpl-page" id="settings-page">
      <div className="kfpl-page-header" style={{ marginBottom: '28px' }}>
        <div className="kfpl-page-header-left">
          <h1 className="kfpl-page-title">Security & Portal Settings</h1>
          <p className="kfpl-page-subtitle">
            Manage your agent account authentication, two-factor security, and access credentials.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
        {/* Left Column: 2FA & Registered Email */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* 2FA Card */}
          <div className="kfpl-card" style={{ padding: '24px', background: '#FFFFFF', borderRadius: '16px', border: '1px solid var(--color-border)', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-navy)', paddingBottom: '12px', borderBottom: '2px solid var(--color-primary-green)' }}>
              Two-Factor Authentication
            </h3>
            <div style={{ background: 'var(--color-surface-elevated, #F8FAFC)', padding: '16px', borderRadius: '12px', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-navy)', marginBottom: '2px' }}>Secure Login with 2FA</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', lineHeight: '1.35' }}>
                  Require a verification OTP sent to your email whenever you sign in.
                </div>
              </div>
              <label className="kfpl-switch" style={{ position: 'relative', display: 'inline-block', width: 46, height: 24, flexShrink: 0 }}>
                <input
                  type="checkbox"
                  checked={tfaEnabled}
                  onChange={handleTfaToggle}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span className="kfpl-switch-slider" style={{
                  position: 'absolute',
                  cursor: 'pointer',
                  inset: 0,
                  backgroundColor: tfaEnabled ? 'var(--color-primary-green)' : '#CBD5E1',
                  transition: '.3s',
                  borderRadius: 24
                }}>
                  <span style={{
                    position: 'absolute',
                    height: 18,
                    width: 18,
                    left: tfaEnabled ? 24 : 3,
                    bottom: 3,
                    backgroundColor: 'white',
                    transition: '.3s',
                    borderRadius: '50%'
                  }} />
                </span>
              </label>
            </div>
          </div>

          {/* Registered Email Card */}
          <div className="kfpl-card" style={{ padding: '24px', background: '#FFFFFF', borderRadius: '16px', border: '1px solid var(--color-border)', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-navy)', paddingBottom: '12px', borderBottom: '2px solid var(--color-primary-green)' }}>
              Registered Agent Email
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#F8FAFC', padding: '6px 14px', borderRadius: '8px', border: '1px solid #E2E8F0', maxWidth: 'fit-content' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 14, height: 14, color: 'var(--color-text-muted)', flexShrink: 0 }}>
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                </svg>
                <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-navy)' }}>
                  {loading ? 'Loading...' : (emailVal || 'Contact Admin')}
                </span>
              </div>
              <span className="kfpl-badge kfpl-badge--info" style={{ fontSize: '0.7rem', padding: '3px 8px' }}>READ-ONLY</span>
            </div>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-muted)', lineHeight: '1.4' }}>
              Email address changes are managed by the Super Admin. Contact admin to update.
            </p>
          </div>
        </div>

        {/* Right Column: Change Password */}
        <div className="kfpl-card" style={{ padding: '24px', background: '#FFFFFF', borderRadius: '16px', border: '1px solid var(--color-border)', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-navy)', paddingBottom: '12px', borderBottom: '2px solid var(--color-primary-green)' }}>
            Change Password
          </h3>

          {!isPasswordOtpSent ? (
            <form onSubmit={handleSendPasswordOtp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '600', color: 'var(--color-navy)', marginBottom: '6px' }}>Current Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    className="kfpl-input"
                    style={{ width: '100%', paddingRight: '40px' }}
                    required
                  />
                  <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex', padding: 0 }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="16" height="16">
                      {showCurrentPassword ? (
                        <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></>
                      ) : (
                        <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>
                      )}
                    </svg>
                  </button>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '600', color: 'var(--color-navy)', marginBottom: '6px' }}>New Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="At least 8 characters"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="kfpl-input"
                    style={{ width: '100%', paddingRight: '40px' }}
                    required
                  />
                  <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex', padding: 0 }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="16" height="16">
                      {showNewPassword ? (
                        <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></>
                      ) : (
                        <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>
                      )}
                    </svg>
                  </button>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '600', color: 'var(--color-navy)', marginBottom: '6px' }}>Confirm New Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Repeat new password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="kfpl-input"
                    style={{ width: '100%', paddingRight: '40px' }}
                    required
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex', padding: 0 }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="16" height="16">
                      {showConfirmPassword ? (
                        <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></>
                      ) : (
                        <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>
                      )}
                    </svg>
                  </button>
                </div>
              </div>

              <button type="submit" className="kfpl-btn kfpl-btn--primary" style={{ alignSelf: 'flex-start', marginTop: '8px' }} disabled={submitting}>
                {submitting ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyPasswordOtp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: '1.4' }}>
                A safety verification OTP code was sent to <strong style={{ color: 'var(--color-navy)' }}>{emailVal}</strong>. Enter it below to update your login password.
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '600', color: 'var(--color-navy)', marginBottom: '6px' }}>6-Digit OTP</label>
                <input
                  type="text"
                  maxLength="6"
                  placeholder="Enter OTP"
                  value={passwordOtp}
                  onChange={e => setPasswordOtp(e.target.value.replace(/\D/g, ''))}
                  className="kfpl-input"
                  required
                  style={{ textAlign: 'center', letterSpacing: '6px', fontWeight: '700', fontSize: '1.1rem' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" className="kfpl-btn kfpl-btn--ghost kfpl-btn--sm" onClick={() => { setIsPasswordOtpSent(false); setPasswordOtp(''); }}>
                  Back
                </button>
                <button type="submit" className="kfpl-btn kfpl-btn--primary kfpl-btn--sm" disabled={submitting}>
                  {submitting ? 'Verifying...' : 'Verify & Change Password'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
