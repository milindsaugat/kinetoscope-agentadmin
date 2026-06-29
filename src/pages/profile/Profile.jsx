/* ============================================================
   Page: Profile.jsx
   Description: Agent profile view with request-based profile and nominee
   updates, plus direct bank account management.
   ============================================================ */

import { useState } from 'react';
import { agentProfile, dashboardStats, formatCurrency } from '../../data/mockData';
import { useToast } from '../../components/ui/Toast';

const profileIcons = {
  user: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  shield: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  bank: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="22" x2="21" y2="22"/><line x1="6" y1="18" x2="6" y2="11"/><line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/><line x1="18" y1="18" x2="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg>,
  nominee: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 11c1.66 0 3-1.57 3-3.5S17.66 4 16 4s-3 1.57-3 3.5S14.34 11 16 11z"/><path d="M8 11c1.66 0 3-1.57 3-3.5S9.66 4 8 4 5 5.57 5 7.5 6.34 11 8 11z"/><path d="M2 20c.55-3.1 3.01-5 6-5 1.25 0 2.38.32 3.31.9"/><path d="M22 20c-.55-3.1-3.01-5-6-5-1.25 0-2.38.32-3.31.9"/></svg>,
  lock: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
};

export default function Profile() {
  const toast = useToast();
  const [isBankEditing, setIsBankEditing] = useState(false);
  const [bankData, setBankData] = useState({
    bankName: agentProfile.bankName,
    bankAccount: agentProfile.bankAccount,
    ifsc: agentProfile.ifsc,
  });
  const [showPasswordSection, setShowPasswordSection] = useState(false);

  const handleSaveBank = () => {
    setIsBankEditing(false);
    toast('Bank account details updated successfully.', 'success');
  };

  return (
    <div className="kfpl-page" id="profile-page">
      <div className="kfpl-page-header">
        <div className="kfpl-page-header-left">
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>My Profile</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: 0 }}>
            Profile aur nominee changes request approval ke through update honge.
          </p>
        </div>
      </div>

      <div className="kfpl-profile-hero">
        <div className="kfpl-profile-avatar-lg">
          {agentProfile.name.charAt(0)}
        </div>
        <div className="kfpl-profile-hero-info">
          <div className="kfpl-profile-eyebrow">Agent account</div>
          <h2>{agentProfile.name}</h2>
          <div className="kfpl-profile-hero-id">{agentProfile.agentId}</div>
          <div className="kfpl-profile-hero-status">
            <span className="kfpl-badge kfpl-badge--success">{agentProfile.status}</span>
          </div>
        </div>
        <div className="kfpl-profile-hero-stats">
          <div className="kfpl-profile-stat">
            <span className="kfpl-profile-stat-label">Total Earned</span>
            <span className="kfpl-profile-stat-value">{formatCurrency(dashboardStats.commissionPaid)}</span>
          </div>
          <div className="kfpl-profile-stat">
            <span className="kfpl-profile-stat-label">Pending Payout</span>
            <span className="kfpl-profile-stat-value">{formatCurrency(dashboardStats.commissionPending)}</span>
          </div>
        </div>
      </div>

      <div className="kfpl-profile-grid" style={{ marginTop: 24 }}>
        <div className="kfpl-card kfpl-profile-card kfpl-profile-card--wide">
          <div className="kfpl-card-header">
            <h3><span className="kfpl-profile-card-icon">{profileIcons.user}</span>Personal Information</h3>
          </div>
          <div className="kfpl-card-body">
            <div className="kfpl-profile-detail-row">
              <span className="kfpl-profile-detail-label">Full Name</span>
              <span className="kfpl-profile-detail-value">{agentProfile.name}</span>
            </div>
            <div className="kfpl-profile-detail-row">
              <span className="kfpl-profile-detail-label">Email</span>
              <span className="kfpl-profile-detail-value">{agentProfile.email}</span>
            </div>
            <div className="kfpl-profile-detail-row">
              <span className="kfpl-profile-detail-label">Phone</span>
              <span className="kfpl-profile-detail-value">{agentProfile.phone}</span>
            </div>
            <div className="kfpl-profile-detail-row">
              <span className="kfpl-profile-detail-label">Address</span>
              <span className="kfpl-profile-detail-value">{agentProfile.address}</span>
            </div>
          </div>
        </div>

        <div className="kfpl-card kfpl-profile-card">
          <div className="kfpl-card-header">
            <h3><span className="kfpl-profile-card-icon">{profileIcons.shield}</span>Account Details</h3>
          </div>
          <div className="kfpl-card-body">
            <div className="kfpl-profile-detail-row">
              <span className="kfpl-profile-detail-label">Agent ID</span>
              <span className="kfpl-profile-detail-value kfpl-mono">{agentProfile.agentId}</span>
            </div>
            <div className="kfpl-profile-detail-row">
              <span className="kfpl-profile-detail-label">Account Status</span>
              <span className="kfpl-badge kfpl-badge--success">{agentProfile.status}</span>
            </div>
            <div className="kfpl-profile-detail-row">
              <span className="kfpl-profile-detail-label">Member Since</span>
              <span className="kfpl-profile-detail-value">{new Date(agentProfile.joiningDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>
        </div>

        <div className="kfpl-card kfpl-profile-card">
          <div className="kfpl-card-header">
            <h3><span className="kfpl-profile-card-icon">{profileIcons.bank}</span>Bank Details</h3>
            {!isBankEditing ? (
              <button className="kfpl-btn kfpl-btn--primary kfpl-btn--sm" onClick={() => setIsBankEditing(true)}>
                Add / Update
              </button>
            ) : (
              <div className="kfpl-profile-action-group">
                <button className="kfpl-btn kfpl-btn--ghost kfpl-btn--sm" onClick={() => setIsBankEditing(false)}>Cancel</button>
                <button className="kfpl-btn kfpl-btn--primary kfpl-btn--sm" onClick={handleSaveBank}>Save</button>
              </div>
            )}
          </div>
          <div className="kfpl-card-body">
            <div className="kfpl-profile-detail-row">
              <span className="kfpl-profile-detail-label">Bank Name</span>
              {isBankEditing ? (
                <input className="kfpl-form-input" value={bankData.bankName} onChange={e => setBankData({ ...bankData, bankName: e.target.value })} />
              ) : (
                <span className="kfpl-profile-detail-value">{bankData.bankName}</span>
              )}
            </div>
            <div className="kfpl-profile-detail-row">
              <span className="kfpl-profile-detail-label">Account Number</span>
              {isBankEditing ? (
                <input className="kfpl-form-input" value={bankData.bankAccount} onChange={e => setBankData({ ...bankData, bankAccount: e.target.value })} />
              ) : (
                <span className="kfpl-profile-detail-value kfpl-mono">{bankData.bankAccount}</span>
              )}
            </div>
            <div className="kfpl-profile-detail-row">
              <span className="kfpl-profile-detail-label">IFSC Code</span>
              {isBankEditing ? (
                <input className="kfpl-form-input" value={bankData.ifsc} onChange={e => setBankData({ ...bankData, ifsc: e.target.value })} />
              ) : (
                <span className="kfpl-profile-detail-value kfpl-mono">{bankData.ifsc}</span>
              )}
            </div>
          </div>
        </div>

        <div className="kfpl-card kfpl-profile-card">
          <div className="kfpl-card-header">
            <h3><span className="kfpl-profile-card-icon">{profileIcons.nominee}</span>Nominee Details</h3>
          </div>
          <div className="kfpl-card-body">
            <div className="kfpl-profile-detail-row">
              <span className="kfpl-profile-detail-label">Name</span>
              <span className="kfpl-profile-detail-value">{agentProfile.nominee.name}</span>
            </div>
            <div className="kfpl-profile-detail-row">
              <span className="kfpl-profile-detail-label">Relation</span>
              <span className="kfpl-profile-detail-value">{agentProfile.nominee.relation}</span>
            </div>
            <div className="kfpl-profile-detail-row">
              <span className="kfpl-profile-detail-label">Contact</span>
              <span className="kfpl-profile-detail-value">{agentProfile.nominee.contact}</span>
            </div>
            <div className="kfpl-profile-detail-row">
              <span className="kfpl-profile-detail-label">Email</span>
              <span className="kfpl-profile-detail-value">{agentProfile.nominee.email || 'Not provided'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="kfpl-card kfpl-profile-card kfpl-profile-security-card" style={{ marginTop: 24 }}>
        <div className="kfpl-card-header">
          <h3><span className="kfpl-profile-card-icon">{profileIcons.lock}</span>Security</h3>
          <button className="kfpl-btn kfpl-btn--ghost kfpl-btn--sm" onClick={() => setShowPasswordSection(!showPasswordSection)}>
            {showPasswordSection ? 'Close' : 'Change Password'}
          </button>
        </div>
        {showPasswordSection && (
          <div className="kfpl-card-body">
            <div className="kfpl-form-row" style={{ maxWidth: 600 }}>
              <div className="kfpl-form-group">
                <label className="kfpl-form-label">Current Password</label>
                <input className="kfpl-form-input" type="password" placeholder="Enter current password" />
              </div>
              <div className="kfpl-form-group">
                <label className="kfpl-form-label">New Password</label>
                <input className="kfpl-form-input" type="password" placeholder="Enter new password" />
              </div>
            </div>
            <div className="kfpl-form-group" style={{ maxWidth: 290 }}>
              <label className="kfpl-form-label">Confirm New Password</label>
              <input className="kfpl-form-input" type="password" placeholder="Confirm new password" />
            </div>
            <button className="kfpl-btn kfpl-btn--primary" onClick={() => { setShowPasswordSection(false); toast('Password changed successfully!', 'success'); }}>
              Update Password
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============ END: Profile.jsx ============ */
