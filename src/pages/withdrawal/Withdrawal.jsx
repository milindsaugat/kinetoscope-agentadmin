import { useState, useEffect } from 'react';
import { dashboardStats, withdrawalHistory, agentProfile, formatCurrency } from '../../data/mockData';
import { useToast } from '../../components/ui/Toast';
import { apiRequest } from '../../config/apiHelper';

export default function Withdrawal() {
  const toastHelper = useToast();
  const addToast = typeof toastHelper === 'function' ? toastHelper : (toastHelper?.addToast || (() => {}));

  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [pendingBalance, setPendingBalance] = useState(dashboardStats.commissionPending);
  const [history, setHistory] = useState(withdrawalHistory);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [bankInfo, setBankInfo] = useState({
    bankName: agentProfile.bankName || 'N/A',
    bankAccount: agentProfile.bankAccount || 'N/A',
    ifsc: agentProfile.ifsc || 'N/A'
  });

  const fetchWithdrawalData = async () => {
    try {
      setLoading(true);

      const authData = localStorage.getItem('kfpl_agent_auth');
      let isDemo = false;
      if (authData) {
        try {
          const parsed = JSON.parse(authData);
          const email = (parsed.agent?.email || parsed.user?.email || '').toLowerCase().trim();
          isDemo = email === 'rajesh.sharma@mail.com' || email === 'karan.malhotra@mail.com' || email === 'neha.kapoor@mail.com';
        } catch (e) {
          console.error(e);
        }
      }

      // 1. Fetch Profile for Bank Info
      const profile = await apiRequest('/api/agent/profile').catch(() => null);
      if (profile) {
        const p = profile.data || profile;
        if (p.bankName || p.bankAccount) {
          setBankInfo({
            bankName: p.bankName || 'N/A',
            bankAccount: p.bankAccount || 'N/A',
            ifsc: p.ifsc || 'N/A'
          });
        }
      }

      // 2. Fetch Dashboard for pending balance
      const dash = await apiRequest('/api/agent/dashboard').catch(() => null);
      if (dash && isDemo) {
        if (dash.commissionPending !== undefined) {
          setPendingBalance(dash.commissionPending);
        } else if (dash.data?.commissionPending !== undefined) {
          setPendingBalance(dash.data.commissionPending);
        }
        
        if (dash.withdrawals && Array.isArray(dash.withdrawals)) {
          setHistory(dash.withdrawals);
        } else if (dash.data?.withdrawals && Array.isArray(dash.data.withdrawals)) {
          setHistory(dash.data.withdrawals);
        }
      } else {
        setPendingBalance(0);
        setHistory([]);
      }

      // 3. Fetch specific withdrawals list if endpoint exists
      const specificData = await apiRequest('/api/agent/withdrawals').catch(() => null);
      if (specificData && isDemo) {
        let list = [];
        if (Array.isArray(specificData)) {
          list = specificData;
        } else if (specificData.withdrawals && Array.isArray(specificData.withdrawals)) {
          list = specificData.withdrawals;
        } else if (specificData.data && Array.isArray(specificData.data)) {
          list = specificData.data;
        } else if (specificData.data?.withdrawals && Array.isArray(specificData.data.withdrawals)) {
          list = specificData.data.withdrawals;
        }
        if (list.length > 0) {
          setHistory(list);
        }
      }
    } catch (err) {
      console.error('Failed to load withdrawal data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawalData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numAmount = parseFloat(amount.replace(/,/g, ''));
    if (isNaN(numAmount) || numAmount <= 0) {
      addToast('Please enter a valid amount.', 'warning', 'Invalid Amount');
      return;
    }
    if (numAmount > pendingBalance) {
      addToast('Amount exceeds your available balance.', 'danger', 'Insufficient Balance');
      return;
    }

    try {
      setSubmitting(true);
      
      // Try posting to /api/agent/withdrawals, fallback to /api/agent/withdrawal
      let posted = false;
      try {
        await apiRequest('/api/agent/withdrawals', {
          method: 'POST',
          body: { amount: numAmount, note }
        });
        posted = true;
      } catch (err) {
        try {
          await apiRequest('/api/agent/withdrawal', {
            method: 'POST',
            body: { amount: numAmount, note }
          });
          posted = true;
        } catch (innerErr) {
          // If both fail, let the outer try/catch raise error
          throw err;
        }
      }

      if (posted) {
        addToast(`Withdrawal request for ${formatCurrency(numAmount)} submitted!`, 'success', 'Success');
        setAmount('');
        setNote('');
        await fetchWithdrawalData();
      }
    } catch (err) {
      console.error('Failed to submit withdrawal request:', err);
      addToast(err.message || 'Failed to submit withdrawal request', 'danger', 'Error');
    } finally {
      setSubmitting(false);
    }
  };

  const totalWithdrawn = history
    .filter(w => (w.status || '').toUpperCase() === 'APPROVED')
    .reduce((sum, w) => sum + (Number(w.amount) || 0), 0);

  const getStatusBadgeClass = (statusStr) => {
    const s = (statusStr || 'PENDING').toUpperCase();
    if (s === 'APPROVED' || s === 'SUCCESS' || s === 'PAID') {
      return 'kfpl-badge--success';
    } else if (s === 'REJECTED' || s === 'FAILED' || s === 'CANCELLED') {
      return 'kfpl-badge--danger';
    }
    return 'kfpl-badge--warning';
  };

  return (
    <div className="kfpl-page animate-fade-slide-up" style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', borderBottom: '1px solid var(--color-border)', paddingBottom: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-navy)', margin: 0, letterSpacing: '-0.5px' }}>
            Withdrawals
          </h1>
          <p style={{ margin: '4px 0 0 0', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
            Request commission payouts, update payout configurations, and monitor transaction ledger history.
          </p>
        </div>
      </div>

      {/* ── Dashboard Stats Overview Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }}>
        {/* Card 1: Available Balance */}
        <div style={{ background: '#fff', border: '1px solid var(--color-border)', borderRadius: '10px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.01)' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1v22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block', letterSpacing: '0.5px' }}>Available Balance</span>
            <strong style={{ fontSize: '1.5rem', color: 'var(--color-navy)', fontWeight: 800 }}>{formatCurrency(pendingBalance)}</strong>
          </div>
        </div>

        {/* Card 2: Total Payouts Withdrawn */}
        <div style={{ background: '#fff', border: '1px solid var(--color-border)', borderRadius: '10px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.01)' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(212, 175, 55, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-gold-dark)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="12" y1="10" x2="12" y2="10"/></svg>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block', letterSpacing: '0.5px' }}>Total Withdrawn</span>
            <strong style={{ fontSize: '1.5rem', color: 'var(--color-navy)', fontWeight: 800 }}>{formatCurrency(totalWithdrawn)}</strong>
          </div>
        </div>

        {/* Card 3: Payout Bank Account details */}
        <div style={{ background: '#fff', border: '1px solid var(--color-border)', borderRadius: '10px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.01)' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(107, 114, 128, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          <div style={{ minWidth: 0 }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block', letterSpacing: '0.5px' }}>Payout Account</span>
            <strong style={{ fontSize: '0.9rem', color: 'var(--color-navy)', fontWeight: 800, display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {bankInfo.bankName}
            </strong>
            <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', display: 'block' }}>A/c: {bankInfo.bankAccount}</span>
          </div>
        </div>
      </div>

      {/* Grid: 2-column layout */}
      <div className="kfpl-grid-2col" style={{ display: 'grid', gridTemplateColumns: '1.1fr 1.5fr', gap: '28px', alignItems: 'start' }}>
        
        {/* Left Column: Form Card */}
        <div className="kfpl-card" style={{ padding: '28px', borderRadius: '12px', border: '1px solid var(--color-border)', background: '#fff', boxShadow: '0 4px 24px rgba(0,0,0,0.03)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-navy)', borderBottom: '2px solid var(--color-gold)', paddingBottom: '12px', margin: '0 0 24px 0' }}>
            Request Payout
          </h3>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="kfpl-form-group">
              <label className="kfpl-form-label" style={{ fontWeight: 600, color: 'var(--color-navy)', fontSize: '0.85rem' }}>Amount to Withdraw (₹) <span className="required" style={{ color: '#ef4444' }}>*</span></label>
              <input
                className="kfpl-form-input"
                type="text"
                placeholder="Enter amount (e.g. 10000)"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                required
                disabled={submitting}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none', fontSize: '0.9rem' }}
              />
              <span className="kfpl-form-help" style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px', display: 'block' }}>
                Maximum Limit: <strong>{formatCurrency(pendingBalance)}</strong>
              </span>
            </div>

            <div className="kfpl-form-group">
              <label className="kfpl-form-label" style={{ fontWeight: 600, color: 'var(--color-navy)', fontSize: '0.85rem' }}>Destination Account Details</label>
              <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '12px 16px' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-navy)' }}>{bankInfo.bankName}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginTop: '4px' }}>Account: {bankInfo.bankAccount}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>IFSC: {bankInfo.ifsc}</div>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '6px', display: 'block' }}>
                If you wish to change bank details, please raise a ticket via Support Tickets.
              </span>
            </div>

            <div className="kfpl-form-group">
              <label className="kfpl-form-label" style={{ fontWeight: 600, color: 'var(--color-navy)', fontSize: '0.85rem' }}>Request Memo / Note (Optional)</label>
              <textarea
                className="kfpl-form-textarea"
                placeholder="Optional notes or reference instructions..."
                value={note}
                onChange={e => setNote(e.target.value)}
                disabled={submitting}
                rows="4"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none', resize: 'vertical', fontSize: '0.9rem' }}
              />
            </div>

            <button 
              type="submit" 
              className="kfpl-btn kfpl-btn-primary" 
              style={{ 
                width: '100%', 
                padding: '12px', 
                borderRadius: '8px', 
                fontWeight: 700, 
                background: 'var(--color-navy)', 
                color: '#fff', 
                border: 'none', 
                cursor: 'pointer',
                fontSize: '0.95rem',
                boxShadow: '0 4px 12px rgba(10, 25, 47, 0.15)',
                transition: 'all 0.2s'
              }}
              disabled={submitting || !amount}
            >
              {submitting ? 'Submitting Request...' : 'Request Payout Payout'}
            </button>
          </form>
        </div>

        {/* Right Column: Request Ledger History */}
        <div className="kfpl-panel-card" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.02)', margin: 0 }}>
          <div className="kfpl-panel-card-header">
            <div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-navy)' }}>Payout Ledger</h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Chronological record of withdrawal history</p>
            </div>
            <span className="kfpl-badge kfpl-badge--emerald" style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: '4px' }}>
              {history.length} Transactions
            </span>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: 'var(--color-text-muted)' }}>
              Loading payouts list...
            </div>
          ) : (
            <div className="kfpl-table-wrapper" style={{ overflowX: 'auto' }}>
              <table className="kfpl-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--color-border)' }}>
                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: 700, fontSize: '0.8rem', color: 'var(--color-navy)', textTransform: 'uppercase' }}>Date</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: 700, fontSize: '0.8rem', color: 'var(--color-navy)', textTransform: 'uppercase' }}>Amount</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: 700, fontSize: '0.8rem', color: 'var(--color-navy)', textTransform: 'uppercase' }}>Note</th>
                    <th style={{ padding: '16px', textAlign: 'right', fontWeight: 700, fontSize: '0.8rem', color: 'var(--color-navy)', textTransform: 'uppercase' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {history.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                        No payout history found.
                      </td>
                    </tr>
                  ) : (
                    history.map((w, idx) => {
                      const statusClass = getStatusBadgeClass(w.status);
                      const displayDate = w.date || w.createdAt;
                      return (
                        <tr 
                          key={w._id || w.id || idx} 
                          style={{ borderBottom: '1px solid var(--color-border)', transition: 'background 0.2s' }}
                          className="kfpl-table-row-hover"
                        >
                          <td style={{ padding: '16px', color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
                            {displayDate ? new Date(displayDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                          </td>
                          <td style={{ padding: '16px', fontWeight: 700, color: 'var(--color-navy)', fontSize: '0.9rem' }}>
                            {formatCurrency(w.amount)}
                          </td>
                          <td style={{ padding: '16px', color: 'var(--color-text-secondary)', fontSize: '0.8rem', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {w.note || w.remarks || w.adminNote || '—'}
                          </td>
                          <td style={{ padding: '16px', textAlign: 'right' }}>
                            <span className={`kfpl-badge ${statusClass}`} style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
                              {w.status || 'Pending'}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
