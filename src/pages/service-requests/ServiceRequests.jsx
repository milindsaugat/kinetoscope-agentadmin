/* ============================================================
   Page: ServiceRequests.jsx
   Description: Service requests list, new form, detail view
   PRD Section 10: SR-01 through SR-04
   ============================================================ */

import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { serviceRequests } from '../../data/mockData';
import { useToast } from '../../components/ui/Toast';

const statusColors = {
  'Open': 'kfpl-badge--warning',
  'In Progress': 'kfpl-badge--emerald',
  'Resolved': 'kfpl-badge--success',
  'Closed': 'kfpl-badge--muted',
};

const categories = ['Profile Update', 'Nominee Update', 'Commission Query', 'Client Query', 'Reward Issue', 'Withdrawal Issue', 'Other'];

export default function ServiceRequests() {
  const toast = useToast();
  const location = useLocation();
  const requestDraft = location.state || {};
  const [activeView, setActiveView] = useState(requestDraft.activeView || 'list');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [newRequest, setNewRequest] = useState({
    category: requestDraft.category || '',
    subject: requestDraft.subject || '',
    description: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast('Service request submitted successfully! ID: SR-005', 'success');
    setNewRequest({ category: '', subject: '', description: '' });
    setActiveView('list');
  };

  return (
    <div className="kfpl-page" id="service-requests-page">
      {/* Tabs */}
      <div className="kfpl-tabs">
        <button className={`kfpl-tab ${activeView === 'list' ? 'active' : ''}`} onClick={() => { setActiveView('list'); setSelectedRequest(null); }}>My Requests</button>
        <button className={`kfpl-tab ${activeView === 'new' ? 'active' : ''}`} onClick={() => { setActiveView('new'); setSelectedRequest(null); }}>New Request</button>
      </div>

      {/* ═══ REQUEST LIST ═══ */}
      {activeView === 'list' && !selectedRequest && (
        <div className="kfpl-table-wrapper">
          <table className="kfpl-table">
            <thead>
              <tr><th>Request ID</th><th>Category</th><th>Subject</th><th>Date</th><th>Status</th></tr>
            </thead>
            <tbody>
              {serviceRequests.map(sr => (
                <tr key={sr.id} onClick={() => setSelectedRequest(sr)} style={{ cursor: 'pointer' }}>
                  <td className="cell-mono">{sr.id}</td>
                  <td><span className="kfpl-badge kfpl-badge--info">{sr.category}</span></td>
                  <td style={{ fontWeight: 600 }}>{sr.subject}</td>
                  <td>{new Date(sr.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                  <td><span className={`kfpl-badge ${statusColors[sr.status]}`}>{sr.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ═══ REQUEST DETAIL ═══ */}
      {activeView === 'list' && selectedRequest && (
        <div className="kfpl-card">
          <div className="kfpl-card-header">
            <div>
              <h3>{selectedRequest.subject}</h3>
              <span className="kfpl-mono" style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>{selectedRequest.id}</span>
            </div>
            <button className="kfpl-btn kfpl-btn-ghost kfpl-btn-sm" onClick={() => setSelectedRequest(null)}>
              ← Back to List
            </button>
          </div>
          <div className="kfpl-card-body">
            <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
              <span className={`kfpl-badge ${statusColors[selectedRequest.status]}`}>{selectedRequest.status}</span>
              <span className="kfpl-badge kfpl-badge--info">{selectedRequest.category}</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                {new Date(selectedRequest.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
              </span>
            </div>

            <h4 style={{ fontSize: 14, marginBottom: 8 }}>Description</h4>
            <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: 24 }}>
              {selectedRequest.description}
            </p>

            {/* Status Timeline */}
            <h4 style={{ fontSize: 14, marginBottom: 16 }}>Status Timeline</h4>
            <div className="kfpl-sr-status-timeline">
              <div className="kfpl-sr-timeline-item completed">
                <div className="kfpl-sr-timeline-date">{new Date(selectedRequest.date).toLocaleDateString('en-IN')}</div>
                <div className="kfpl-sr-timeline-title">Request Submitted</div>
                <div className="kfpl-sr-timeline-desc">Your request has been received.</div>
              </div>
              {selectedRequest.status !== 'Open' && (
                <div className={`kfpl-sr-timeline-item ${selectedRequest.status === 'In Progress' ? 'active' : 'completed'}`}>
                  <div className="kfpl-sr-timeline-date">—</div>
                  <div className="kfpl-sr-timeline-title">In Progress</div>
                  <div className="kfpl-sr-timeline-desc">Our team is working on your request.</div>
                </div>
              )}
              {(selectedRequest.status === 'Resolved' || selectedRequest.status === 'Closed') && (
                <div className="kfpl-sr-timeline-item completed">
                  <div className="kfpl-sr-timeline-date">—</div>
                  <div className="kfpl-sr-timeline-title">{selectedRequest.status}</div>
                  <div className="kfpl-sr-timeline-desc">{selectedRequest.adminResponse}</div>
                </div>
              )}
            </div>

            {selectedRequest.adminResponse && (
              <div style={{ marginTop: 24, padding: 16, background: 'var(--color-gold-light)', borderRadius: 'var(--radius-lg)' }}>
                <h4 style={{ fontSize: 13, color: 'var(--color-gold-dark)', marginBottom: 8 }}>Admin Response</h4>
                <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>{selectedRequest.adminResponse}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══ NEW REQUEST FORM ═══ */}
      {activeView === 'new' && (
        <div className="kfpl-card" style={{ maxWidth: 640 }}>
          <div className="kfpl-card-header">
            <h3>Raise New Service Request</h3>
          </div>
          <div className="kfpl-card-body">
            <form onSubmit={handleSubmit}>
              <div className="kfpl-form-group">
                <label className="kfpl-form-label">Category <span className="required">*</span></label>
                <select className="kfpl-form-select" value={newRequest.category} onChange={e => setNewRequest({ ...newRequest, category: e.target.value })} required>
                  <option value="">Select a category...</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="kfpl-form-group">
                <label className="kfpl-form-label">Subject <span className="required">*</span></label>
                <input className="kfpl-form-input" placeholder="Brief summary of your request" value={newRequest.subject} onChange={e => setNewRequest({ ...newRequest, subject: e.target.value })} required />
              </div>
              <div className="kfpl-form-group">
                <label className="kfpl-form-label">Description <span className="required">*</span></label>
                <textarea className="kfpl-form-textarea" placeholder="Describe your request in detail..." value={newRequest.description} onChange={e => setNewRequest({ ...newRequest, description: e.target.value })} required />
              </div>
              <div className="kfpl-form-group">
                <label className="kfpl-form-label">Attachment (Optional)</label>
                <div className="kfpl-file-upload">
                  <div className="kfpl-file-upload-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: 32, height: 32 }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  </div>
                  <div className="kfpl-file-upload-text">
                    <strong>Click to upload</strong> or drag and drop
                  </div>
                </div>
              </div>
              <button type="submit" className="kfpl-btn kfpl-btn-primary kfpl-btn-lg" style={{ width: '100%' }}>
                Submit Request
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============ END: ServiceRequests.jsx ============ */
