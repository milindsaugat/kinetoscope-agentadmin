/* ============================================================
   Page: Settings.jsx
   Description: Settings view for Agent Portal. Includes 2FA configuration,
   Change Email (with OTP verification), and Change Password (with OTP verification).
   ============================================================ */

import { useState } from 'react';
import { agentProfile } from '../../data/mockData';
import { useToast } from '../../components/ui/Toast';

const settingsIcons = {
  lock: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  shield: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
};

export default function Settings() {
  const toast = useToast();
  const [emailVal, setEmailVal] = useState(agentProfile.email);

  // 2FA State
  const [tfaEnabled, setTfaEnabled] = useState(
    localStorage.getItem('kfpl_agent_2fa_enabled') === 'true'
  );

  // Email Change Flow States
  const [newEmailInput, setNewEmailInput] = useState('');
  const [emailOtp, setEmailOtp] = useState('');
  const [emailMockOtp, setEmailMockOtp] = useState('');
  const [isEmailOtpSent, setIsEmailOtpSent] = useState(false);
  const [showEmailSection, setShowEmailSection] = useState(false);

  // Password Change Flow States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordOtp, setPasswordOtp] = useState('');
  const [passwordMockOtp, setPasswordMockOtp] = useState('');
  const [isPasswordOtpSent, setIsPasswordOtpSent] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleTfaToggle = (e) => {
    const checked = e.target.checked;
    setTfaEnabled(checked);
    localStorage.setItem('kfpl_agent_2fa_enabled', checked ? 'true' : 'false');
    toast(`Two-Factor Authentication ${checked ? 'Enabled' : 'Disabled'} successfully.`, 'success');
  };

  const handleSendEmailOtp = (e) => {
    e.preventDefault();
    if (!newEmailInput) {
      toast('Please enter the new email address.', 'warning');
      return;
    }
    if (newEmailInput.toLowerCase() === emailVal.toLowerCase()) {
      toast('New email address must be different from current email.', 'warning');
      return;
    }
    const code = String(Math.floor(100000 + Math.random() * 900000));
    setEmailMockOtp(code);
    setIsEmailOtpSent(true);
    alert(`[Mock OTP Code] A verification OTP has been sent to your new email: ${code}`);
    toast('OTP sent successfully!', 'info');
  };

  const handleVerifyEmailOtp = (e) => {
    e.preventDefault();
    if (emailOtp === emailMockOtp || emailOtp === '123456') {
      setEmailVal(newEmailInput);
      agentProfile.email = newEmailInput; // update local mock reference too
      toast('Email updated successfully!', 'success');
      // Reset flow
      setNewEmailInput('');
      setEmailOtp('');
      setEmailMockOtp('');
      setIsEmailOtpSent(false);
      setShowEmailSection(false);
    } else {
      toast('Invalid verification code.', 'danger');
    }
  };

  const handleSendPasswordOtp = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast('Please fill out all password fields.', 'warning');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast('New Password and Confirm Password do not match.', 'danger');
      return;
    }
    const code = String(Math.floor(100000 + Math.random() * 900000));
    setPasswordMockOtp(code);
    setIsPasswordOtpSent(true);
    alert(`[Mock OTP Code] A security OTP has been sent to your email: ${code}`);
    toast('Security OTP sent successfully!', 'info');
  };

  const handleVerifyPasswordOtp = (e) => {
    e.preventDefault();
    if (passwordOtp === passwordMockOtp || passwordOtp === '123456') {
      toast('Password changed successfully!', 'success');
      // Reset flow
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordOtp('');
      setPasswordMockOtp('');
      setIsPasswordOtpSent(false);
      setShowPasswordSection(false);
    } else {
      toast('Invalid verification code.', 'danger');
    }
  };

  return (
    <div className="kfpl-page" id="settings-page">
      <div className="kfpl-page-header">
        <div className="kfpl-page-header-left">
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Security Settings</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: 0 }}>
            Manage Two-Factor Authentication (2FA), login email, and passwords.
          </p>
        </div>
      </div>

      {/* ── Two Factor Authentication Toggle Card ─────────────────────── */}
      <div className="kfpl-card" style={{ padding: 28, background: 'var(--color-white)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border-light)', marginBottom: 24, boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--color-gold-glow)', color: 'var(--color-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {settingsIcons.shield}
            </div>
            <div>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-navy)' }}>Two-Factor Authentication (2FA)</h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted)', lineHeight: 1.5, maxWidth: 620 }}>
                Adds an extra layer of protection to your agent account. When enabled, a mock OTP code is sent to your email to verify your identity upon login.
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: tfaEnabled ? 'var(--color-gold-dark)' : 'var(--color-text-muted)' }}>
              {tfaEnabled ? 'Enabled' : 'Disabled'}
            </span>
            <label className="kfpl-switch" style={{ position: 'relative', display: 'inline-block', width: 46, height: 24 }}>
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
                backgroundColor: tfaEnabled ? 'var(--color-gold)' : '#CBD5E1',
                transition: '.3s',
                borderRadius: 24,
                boxShadow: tfaEnabled ? '0 2px 8px rgba(16, 185, 129, 0.4)' : 'none'
              }}>
                <span style={{
                  position: 'absolute',
                  content: '""',
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
      </div>

      {/* ── Security Configuration Columns ─────────────────────── */}
      <div className="kfpl-card kfpl-profile-card kfpl-profile-security-card">
        <div className="kfpl-card-header" style={{ borderBottom: '1px solid var(--color-border-light)', paddingBottom: 16 }}>
          <h3><span className="kfpl-profile-card-icon">{settingsIcons.lock}</span>Credential Management</h3>
        </div>
        <div className="kfpl-card-body" style={{ paddingTop: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
            
            {/* Change Email Form Block */}
            <div style={{ background: '#FAFDFB', padding: 28, borderRadius: 'var(--radius-lg)', border: '1px solid #E2EDE7', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-navy)' }}>Change Email Address</h4>
                {!isEmailOtpSent && (
                  <button className="kfpl-btn kfpl-btn--ghost kfpl-btn--sm" onClick={() => setShowEmailSection(!showEmailSection)}>
                    {showEmailSection ? 'Cancel' : 'Modify'}
                  </button>
                )}
              </div>

              {showEmailSection && (
                <div>
                  {!isEmailOtpSent ? (
                    <form onSubmit={handleSendEmailOtp} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      <div className="kfpl-form-group">
                        <label className="kfpl-form-label">Current Email Address</label>
                        <input
                          className="kfpl-form-input"
                          type="email"
                          value={emailVal}
                          disabled
                          readOnly
                          style={{ background: 'var(--color-surface-alt)', color: 'var(--color-text-muted)', cursor: 'not-allowed' }}
                        />
                      </div>
                      <div className="kfpl-form-group">
                        <label className="kfpl-form-label">New Email Address</label>
                        <input
                          className="kfpl-form-input"
                          type="email"
                          placeholder="Enter new email address"
                          value={newEmailInput}
                          onChange={e => setNewEmailInput(e.target.value)}
                          required
                        />
                      </div>
                      <button type="submit" className="kfpl-btn kfpl-btn--primary kfpl-btn--sm" style={{ alignSelf: 'flex-start' }}>
                        Send Verification OTP
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyEmailOtp} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      <div style={{ fontSize: 13, color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
                        An OTP verification code was sent to <strong style={{ color: 'var(--color-navy)' }}>{newEmailInput}</strong>. Enter it below to complete the change.
                      </div>
                      <div className="kfpl-form-group">
                        <label className="kfpl-form-label">6-Digit Verification OTP</label>
                        <input
                          className="kfpl-form-input"
                          type="text"
                          maxLength="6"
                          placeholder="Enter OTP"
                          value={emailOtp}
                          onChange={e => setEmailOtp(e.target.value.replace(/\D/g, ''))}
                          required
                          style={{ textAlign: 'center', letterSpacing: 6, fontWeight: 700, fontSize: '1.1rem' }}
                        />
                      </div>
                      <div style={{ display: 'flex', gap: 10 }}>
                        <button type="button" className="kfpl-btn kfpl-btn--ghost kfpl-btn--sm" onClick={() => { setIsEmailOtpSent(false); setEmailOtp(''); setEmailMockOtp(''); }}>
                          Back
                        </button>
                        <button type="submit" className="kfpl-btn kfpl-btn--primary kfpl-btn--sm">
                          Verify & Update
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
              {!showEmailSection && (
                <div style={{ fontSize: 13, color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                  Email address modifications require OTP authentication sent to both address endpoints.
                </div>
              )}
            </div>

            {/* Change Password Form Block */}
            <div style={{ background: '#FAFDFB', padding: 28, borderRadius: 'var(--radius-lg)', border: '1px solid #E2EDE7', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-navy)' }}>Update Password</h4>
                {!isPasswordOtpSent && (
                  <button className="kfpl-btn kfpl-btn--ghost kfpl-btn--sm" onClick={() => setShowPasswordSection(!showPasswordSection)}>
                    {showPasswordSection ? 'Cancel' : 'Modify'}
                  </button>
                )}
              </div>

              {showPasswordSection && (
                <div>
                  {!isPasswordOtpSent ? (
                    <form onSubmit={handleSendPasswordOtp} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      <div className="kfpl-form-group">
                        <label className="kfpl-form-label">Current Password</label>
                        <div className="kfpl-login-password-wrap">
                          <input
                            className="kfpl-form-input"
                            type={showCurrentPassword ? 'text' : 'password'}
                            placeholder="Enter current password"
                            value={currentPassword}
                            onChange={e => setCurrentPassword(e.target.value)}
                            required
                          />
                          <button type="button" className="kfpl-login-password-toggle" onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                              {showCurrentPassword ? (
                                <>
                                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                                  <line x1="1" y1="1" x2="23" y2="23"/>
                                </>
                              ) : (
                                <>
                                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                  <circle cx="12" cy="12" r="3"/>
                                </>
                              )}
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="kfpl-form-group">
                        <label className="kfpl-form-label">New Password</label>
                        <div className="kfpl-login-password-wrap">
                          <input
                            className="kfpl-form-input"
                            type={showNewPassword ? 'text' : 'password'}
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            required
                          />
                          <button type="button" className="kfpl-login-password-toggle" onClick={() => setShowNewPassword(!showNewPassword)}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                              {showNewPassword ? (
                                <>
                                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                                  <line x1="1" y1="1" x2="23" y2="23"/>
                                </>
                              ) : (
                                <>
                                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                  <circle cx="12" cy="12" r="3"/>
                                </>
                              )}
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="kfpl-form-group">
                        <label className="kfpl-form-label">Confirm New Password</label>
                        <div className="kfpl-login-password-wrap">
                          <input
                            className="kfpl-form-input"
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            required
                          />
                          <button type="button" className="kfpl-login-password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                              {showConfirmPassword ? (
                                <>
                                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                                  <line x1="1" y1="1" x2="23" y2="23"/>
                                </>
                              ) : (
                                <>
                                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                  <circle cx="12" cy="12" r="3"/>
                                </>
                              )}
                            </svg>
                          </button>
                        </div>
                      </div>
                      <button type="submit" className="kfpl-btn kfpl-btn--primary kfpl-btn--sm" style={{ alignSelf: 'flex-start' }}>
                        Send Security OTP
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyPasswordOtp} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      <div style={{ fontSize: 13, color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
                        A safety OTP verification code was sent to <strong style={{ color: 'var(--color-navy)' }}>{emailVal}</strong>. Enter it below to update your login password.
                      </div>
                      <div className="kfpl-form-group">
                        <label className="kfpl-form-label">6-Digit Safety OTP</label>
                        <input
                          className="kfpl-form-input"
                          type="text"
                          maxLength="6"
                          placeholder="Enter OTP"
                          value={passwordOtp}
                          onChange={e => setPasswordOtp(e.target.value.replace(/\D/g, ''))}
                          required
                          style={{ textAlign: 'center', letterSpacing: 6, fontWeight: 700, fontSize: '1.1rem' }}
                        />
                      </div>
                      <div style={{ display: 'flex', gap: 10 }}>
                        <button type="button" className="kfpl-btn kfpl-btn--ghost kfpl-btn--sm" onClick={() => { setIsPasswordOtpSent(false); setPasswordOtp(''); setPasswordMockOtp(''); }}>
                          Back
                        </button>
                        <button type="submit" className="kfpl-btn kfpl-btn--primary kfpl-btn--sm">
                          Verify & Change Password
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
              {!showPasswordSection && (
                <div style={{ fontSize: 13, color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                  Password changes require multi-factor safety check verification sent to your email.
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
