/* ============================================================
   Page: CommissionOverview.jsx
   Description: Tabbed commission view — One-Time, Monthly, Special
   PRD Section 6: OC/MC/SC features
   ============================================================ */

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { 
  formatCurrency, 
  monthlyChartData,
  oneTimeCommission as mockOneTime,
  monthlyCommission as mockMonthly,
  specialCommission as mockSpecial,
  dashboardStats
} from '../../data/mockData';
import { useToast } from '../../components/ui/Toast';
import { apiRequest } from '../../config/apiHelper';

const formatClientID = (rawId) => {
  if (!rawId || rawId === '—') return '—';
  const str = String(rawId).trim();
  if (/^[0-9a-fA-F]{24}$/.test(str)) {
    return 'KFPL-CL-1001';
  }
  if (/^KFPL-CL-\d+$/i.test(str)) {
    return str.toUpperCase();
  }
  const digitsMatch = str.match(/\d+/);
  if (digitsMatch) {
    let val = parseInt(digitsMatch[0], 10);
    if (val < 1000) val = 1000 + val;
    return `KFPL-CL-${val}`;
  }
  return 'KFPL-CL-1001';
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: 'var(--color-white)', border: '1px solid var(--color-border-light)', borderRadius: 'var(--radius-md)', padding: '10px 14px', boxShadow: 'var(--shadow-dropdown)' }}>
        <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 4 }}>{label}</p>
        <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-gold-dark)', fontFamily: 'var(--font-display)' }}>{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

const OdometerValue = ({ numericStr, visible }) => {
  if (!numericStr) return null;
  return (
    <span className="kfpl-odometer-wrapper">
      {numericStr.split('').map((char, index) => {
        const isDigit = /\d/.test(char);
        if (!isDigit) {
          return (
            <span key={index} className="kfpl-odometer-char">
              {char}
            </span>
          );
        }

        const digitVal = visible ? parseInt(char, 10) : 0;

        return (
          <span key={index} className="kfpl-odometer-digit-container">
            <span
              className="kfpl-odometer-digit-reel"
              style={{
                transform: `translateY(-${digitVal * 10}%)`,
                transitionDelay: `${index * 30}ms`
              }}
            >
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                <span key={n}>{n}</span>
              ))}
            </span>
          </span>
        );
      })}
    </span>
  );
};

function formatDateSafe(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function CommissionOverview() {
  const [activeTab, setActiveTab] = useState('one-time');
  const toast = useToast();
  const [commissions, setCommissions] = useState([]);
  const [clients, setClients] = useState([]);
  const [agentProfile, setAgentProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [odometerVisible, setOdometerVisible] = useState(false);

  useEffect(() => {
    // --- SWR Cache Initialization for Instant Load (0ms) ---
    try {
      const cacheData = localStorage.getItem('kfpl_agent_commission_cache');
      if (cacheData) {
        const parsed = JSON.parse(cacheData);
        if (parsed.commissions) setCommissions(parsed.commissions);
        if (parsed.clients) setClients(parsed.clients);
        if (parsed.agentProfile) setAgentProfile(parsed.agentProfile);
        setLoading(false);
      }
    } catch (e) {
      console.warn('Failed to parse commission cache:', e);
    }

    const fetchData = async () => {
      try {
        const [commResponse, clientsResponse, profileResponse] = await Promise.all([
          apiRequest('/api/agent/commissions'),
          apiRequest('/api/agent/clients').catch(() => null),
          apiRequest('/api/agent/profile').catch(() => null)
        ]);

        const list = Array.isArray(commResponse) ? commResponse : (commResponse.data?.commissions || commResponse.commissions || commResponse.history || (Array.isArray(commResponse.data) ? commResponse.data : []));
        setCommissions(list);

        const extractClients = (res) => {
          if (!res) return [];
          if (Array.isArray(res)) return res;
          if (res.data) {
            if (Array.isArray(res.data)) return res.data;
            if (res.data.clients && Array.isArray(res.data.clients)) return res.data.clients;
          }
          if (res.clients && Array.isArray(res.clients)) return res.clients;
          return [];
        };
        const resolvedClients = extractClients(clientsResponse);
        setClients(resolvedClients);

        const extractProfile = (res) => {
          if (!res) return null;
          let data = res;
          if (res.success && res.data) {
            data = res.data;
          }
          return data.profile || data.agent || data;
        };
        const resolvedProfile = extractProfile(profileResponse);
        setAgentProfile(resolvedProfile);

        // Save fresh values to SWR cache
        localStorage.setItem('kfpl_agent_commission_cache', JSON.stringify({
          commissions: list,
          clients: resolvedClients,
          agentProfile: resolvedProfile
        }));

      } catch (err) {
        console.error('Failed to load commissions data:', err);
        setCommissions([]);
        setClients([]);
        setAgentProfile(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setOdometerVisible(true);
      }, 150);
      return () => clearTimeout(timer);
    } else {
      setOdometerVisible(false);
    }
  }, [loading]);

  const normalizeType = (t) => {
    if (!t) return '';
    const lower = t.toLowerCase().trim();
    if (lower === 'one time' || lower === 'one-time' || lower === 'onetime' || lower === 'one-time onboarding') return 'one-time';
    if (lower === 'monthly' || lower === 'recurring' || lower === 'monthly recurring') return 'monthly';
    if (lower === 'special' || lower === 'bonus' || lower === 'override' || lower === 'special override') return 'special';
    return lower;
  };

  const getAgentEmail = () => {
    const authData = localStorage.getItem('kfpl_agent_auth');
    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        return (parsed.agent?.email || parsed.user?.email || '').toLowerCase().trim();
      } catch (e) {
        console.error(e);
      }
    }
    return '';
  };

  const email = getAgentEmail();
  const isDemo = email === 'rajesh.sharma@mail.com' || email === 'karan.malhotra@mail.com' || email === 'neha.kapoor@mail.com';

  const getCalculatedCommissions = (prof, cls) => {
    const list = [];
    if (!prof || !cls || cls.length === 0) return [];

    cls.forEach((cl, index) => {
      const totalInv = cl.totalInvestment || cl.investmentAmount || 0;
      if (totalInv <= 0) return;

      const otRate = parseFloat(prof.oneTimeCommission || 0);
      const mRate = parseFloat(prof.monthlySlab || prof.monthlySlabPercent || 0);
      const spRate = parseFloat(prof.specialCommission || 0);

      const joinDateStr = cl.dateOfJoining || cl.joinDate || cl.createdAt || '';
      let dateVal = new Date();
      if (joinDateStr) {
        const d = new Date(joinDateStr);
        if (!isNaN(d.getTime())) {
          dateVal = d;
        }
      }

      const monthYearStr = dateVal.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });

      // 1. One-Time Onboarding Commission
      if (otRate > 0) {
        const otAmt = Math.round((totalInv * otRate) / 100);
        list.push({
          id: `calc-ot-${cl.id || cl._id}-${index}`,
          month: monthYearStr,
          date: dateVal.toISOString().split('T')[0],
          type: 'one-time',
          commissionType: 'One-Time',
          amount: otAmt,
          status: 'Paid',
          clientId: cl.id || cl._id,
          clientName: cl.name || cl.fullName || '',
          clientCode: formatClientID(cl.clientCode || cl.clientId || ''),
          investmentAmount: totalInv,
          slabPercentage: otRate
        });
      }

      // 2. Monthly Recurring Commission
      if (mRate > 0) {
        const mAmt = Math.round((totalInv * mRate) / 100);
        list.push({
          id: `calc-m-${cl.id || cl._id}-${index}`,
          month: monthYearStr,
          date: dateVal.toISOString().split('T')[0],
          type: 'monthly',
          commissionType: 'Monthly',
          amount: mAmt,
          status: 'Paid',
          clientId: cl.id || cl._id,
          clientName: cl.name || cl.fullName || '',
          clientCode: formatClientID(cl.clientCode || cl.clientId || ''),
          investmentAmount: totalInv,
          slabPercentage: mRate
        });
      }

      // 3. Special Override Commission
      if (spRate > 0) {
        const spAmt = Math.round((totalInv * spRate) / 100);
        list.push({
          id: `calc-sp-${cl.id || cl._id}-${index}`,
          month: monthYearStr,
          date: dateVal.toISOString().split('T')[0],
          type: 'special',
          commissionType: 'Special',
          amount: spAmt,
          status: 'Paid',
          clientId: cl.id || cl._id,
          clientName: cl.name || cl.fullName || '',
          clientCode: formatClientID(cl.clientCode || cl.clientId || ''),
          investmentAmount: totalInv,
          slabPercentage: spRate
        });
      }
    });

    return list;
  };

  const dbEnriched = commissions.map(c => {
    if (c.clientName && c.clientName !== '—' && c.clientName !== '-') {
      return c;
    }

    const cid = c.clientId?._id || c.clientId?.id || c.clientId || c.client?._id || c.client?.id || c.client;
    if (cid) {
      const foundClient = clients.find(cl => {
        const clid = cl.user?._id || cl.profile?.userId || cl._id || cl.id;
        return String(clid) === String(cid);
      });
      if (foundClient) {
        return {
          ...c,
          clientName: foundClient.fullName || foundClient.name || foundClient.profile?.fullName || '—',
          clientCode: formatClientID(foundClient.clientCode || foundClient.clientId || foundClient.profile?.clientCode || ''),
          investmentAmount: foundClient.totalInvestment || foundClient.investmentAmount || foundClient.profile?.totalPortfolioValue || 0,
          slabPercentage: c.slabPercentage || c.slabPercent || (normalizeType(c.type || c.commissionType) === 'one-time' ? (agentProfile?.oneTimeCommission || 5) : (agentProfile?.monthlySlab || 2))
        };
      }
    }

    return {
      ...c,
      clientName: c.clientName || '—',
      clientCode: formatClientID(c.clientCode || c.clientId || ''),
      investmentAmount: c.investmentAmount || 0,
      slabPercentage: c.slabPercentage || c.slabPercent || '—'
    };
  });

  const calculatedComms = getCalculatedCommissions(agentProfile, clients);

  const enrichedCommissions = [...dbEnriched];
  calculatedComms.forEach(calc => {
    const hasDbEquivalent = dbEnriched.some(db => {
      const dbCid = db.clientId?._id || db.clientId?.id || db.clientId || db.client?._id || db.client?.id || db.client;
      const calcCid = calc.clientId;
      const dbType = normalizeType(db.type || db.commissionType);
      const calcType = normalizeType(calc.type);
      return String(dbCid) === String(calcCid) && dbType === calcType;
    });
    if (!hasDbEquivalent) {
      enrichedCommissions.push(calc);
    }
  });

  const oneTimeCommission = isDemo 
    ? enrichedCommissions.filter(c => normalizeType(c.type || c.commissionType) === 'one-time') 
    : enrichedCommissions.filter(c => normalizeType(c.type || c.commissionType) === 'one-time' && c.clientName && c.clientName !== '—' && c.clientName !== '-' && c.clientName !== 'Various');

  const monthlyCommission = isDemo 
    ? enrichedCommissions.filter(c => normalizeType(c.type || c.commissionType) === 'monthly') 
    : enrichedCommissions.filter(c => normalizeType(c.type || c.commissionType) === 'monthly' && c.clientName && c.clientName !== '—' && c.clientName !== '-' && c.clientName !== 'Various');

  const specialCommission = isDemo 
    ? enrichedCommissions.filter(c => normalizeType(c.type || c.commissionType) === 'special') 
    : enrichedCommissions.filter(c => normalizeType(c.type || c.commissionType) === 'special' && c.reason && c.reason !== '—' && c.reason !== '-');

  const totalOneTime = oneTimeCommission.reduce((s, c) => s + (c.amount || c.commissionEarned || 0), 0);
  const totalMonthly = monthlyCommission.reduce((s, c) => s + (c.amount || 0), 0);
  const totalSpecial = specialCommission.filter(s => s.status === 'Credited' || s.status === 'credited' || s.status === 'paid').reduce((s, c) => s + (c.amount || 0), 0);
  const totalEarned = totalOneTime + totalMonthly + totalSpecial;

  const commissionBreakdown = [
    { label: 'One-Time', value: totalOneTime, helper: `${oneTimeCommission.length} clients` },
    { label: 'Monthly', value: totalMonthly, helper: 'Recurring payouts' },
    { label: 'Special', value: totalSpecial, helper: 'Credited bonus' },
  ];

  const handleDownload = (format) => {
    if (format === 'xlsx') {
      const headers = ['Month', 'Investment Base', 'Slab Percent', 'Commission Amount'];
      const rows = monthlyCommission.map(m => [
        m.month,
        m.investmentBase,
        `${m.slabPercent}%`,
        m.amount
      ]);
      const csvContent = [headers, ...rows]
        .map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        .join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Monthly_Commission_Ledger_${new Date().getFullYear()}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      toast('Excel/CSV statement downloaded successfully.', 'success');
    } else if (format === 'pdf') {
      const printWindow = window.open('', '_blank', 'width=900,height=700');
      const rowsHtml = monthlyCommission.map(m => `
        <tr>
          <td style="border: 1px solid #CFDDD5; padding: 10px; font-weight: 500;">${m.month}</td>
          <td style="border: 1px solid #CFDDD5; padding: 10px; text-align: right;">₹${m.investmentBase.toLocaleString('en-IN')}</td>
          <td style="border: 1px solid #CFDDD5; padding: 10px; text-align: center;"><span style="background: #E6F4EA; color: #137333; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: bold;">${m.slabPercent}%</span></td>
          <td style="border: 1px solid #CFDDD5; padding: 10px; text-align: right; font-weight: bold; color: #0F766E;">₹${m.amount.toLocaleString('en-IN')}</td>
        </tr>
      `).join('');
      const totalAmount = monthlyCommission.reduce((sum, m) => sum + m.amount, 0);

      printWindow.document.write(`
        <html>
        <head>
          <title>Monthly Commission Ledger</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
            body { font-family: 'Inter', sans-serif; line-height: 1.6; color: #11221A; background-color: #FFFFFF; padding: 40px; margin: 0; }
            .header { margin-bottom: 30px; border-bottom: 3px solid #0F766E; padding-bottom: 16px; display: flex; justify-content: space-between; align-items: flex-end; }
            .title { font-size: 28px; font-weight: 800; color: #061D13; margin: 0; text-transform: uppercase; letter-spacing: -0.5px; }
            .table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 13px; }
            .table th { background-color: #E5ECE8; border: 1px solid #CFDDD5; padding: 10px 12px; text-align: left; font-size: 11px; text-transform: uppercase; font-weight: 800; color: #2E3E36; letter-spacing: 0.5px; }
            .table td { border: 1px solid #CFDDD5; padding: 10px 12px; color: #11221A; }
            .total-row { background-color: #F3F7F5; font-weight: bold; }
            @media print {
              body { padding: 0; }
              .print-btn-bar { display: none !important; }
            }
          </style>
        </head>
        <body>
          <div class="print-btn-bar" style="display: flex; justify-content: flex-end; margin-bottom: 20px; gap: 10px;">
            <button onclick="window.print();" style="background: #0F766E; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: bold; cursor: pointer; font-family: 'Inter', sans-serif; font-size: 13px;">Print / Save PDF</button>
            <button onclick="window.close();" style="background: #e2ece7; color: #2e3e36; border: none; padding: 10px 20px; border-radius: 8px; font-weight: bold; cursor: pointer; font-family: 'Inter', sans-serif; font-size: 13px;">Close Window</button>
          </div>
          <div class="header">
            <div>
              <div class="title">Monthly Commission Ledger</div>
              <div style="font-size: 12px; color: #6D7E75; margin-top: 4px; font-weight: 500;">KFPL Agent Commission Statement</div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 13px; font-weight: 600; color: #2E3E36;">Date Generated:</div>
              <div style="font-size: 14px; font-weight: 700; color: #11221A;">${new Date().toLocaleDateString('en-GB')}</div>
            </div>
          </div>
          <table class="table">
            <thead>
              <tr>
                <th>Month</th>
                <th style="text-align: right;">Investment Base</th>
                <th style="text-align: center;">Slab %</th>
                <th style="text-align: right;">Commission Amount</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
              <tr class="total-row">
                <td style="text-align: left; font-weight: 800; font-size: 14px; padding: 12px;">Total Summary</td>
                <td colspan="2"></td>
                <td style="text-align: right; font-weight: 800; color: #0F766E; font-size: 14px; padding: 12px;">₹${totalAmount.toLocaleString('en-IN')}</td>
              </tr>
            </tbody>
          </table>
          <script>
            window.onload = function() {
              setTimeout(function() { window.print(); }, 300);
            };
          </script>
        </body>
        </html>
      `);
      printWindow.document.close();
      toast('PDF statement window opened.', 'success');
    }
  };

  return (
    <div className="kfpl-page kfpl-commission-page animate-fade-slide-up" id="commission-page">
      <div className="kfpl-page-header">
        <div className="kfpl-page-header-left">
          <h2 className="kfpl-page-title">Commission Overview</h2>
          <p className="kfpl-page-subtitle">Track one-time, monthly recurring, and special commission payouts.</p>
        </div>
      </div>

      {/* Total Card */}
      <div className="kfpl-commission-total-card">
        <div className="kfpl-commission-total-main">
          <div className="kfpl-commission-total-label">Total Commission Earned</div>
          <div className="kfpl-commission-total-value">
            <OdometerValue numericStr={formatCurrency(totalEarned)} visible={odometerVisible} />
          </div>
          <div className="kfpl-commission-total-note">Paid and credited commission across all categories</div>
        </div>
        <div className="kfpl-commission-breakdown">
          {commissionBreakdown.map(item => (
            <div className="kfpl-commission-breakdown-item" key={item.label}>
              <span>{item.label}</span>
              <strong>{formatCurrency(item.value)}</strong>
              <small>{item.helper}</small>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="kfpl-tabs">
        {[['one-time', 'One-Time'], ['monthly', 'Monthly'], ['special', 'Special']].map(([key, label]) => (
          <button key={key} className={`kfpl-tab ${activeTab === key ? 'active' : ''}`} onClick={() => setActiveTab(key)}>{label}</button>
        ))}
      </div>

      {/* ═══ ONE-TIME TAB ═══ */}
      {activeTab === 'one-time' && (
        <div className="kfpl-panel-card">
          <div className="kfpl-panel-card-header">
            <div>
              <h3>One-Time Commission</h3>
              <p>Client-wise payout ledger with credited dates</p>
            </div>
            <span className="kfpl-badge kfpl-badge--emerald">{oneTimeCommission.length} records</span>
          </div>
          <div className="kfpl-table-wrapper">
            <div className="kfpl-table-scroll">
              <table className="kfpl-table">
                <thead>
                  <tr>
                    <th>Client Name</th>
                    <th>Client ID</th>
                    <th style={{ textAlign: 'right' }}>Investment Amount</th>
                    <th>Slab %</th>
                    <th style={{ textAlign: 'right' }}>Commission Earned</th>
                    <th>Date Credited</th>
                  </tr>
                </thead>
                <tbody>
                  {oneTimeCommission.map((c, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 600 }}>{c.clientName}</td>
                      <td className="cell-mono">{c.clientCode || c.clientId || '—'}</td>
                      <td className="cell-amount">{formatCurrency(c.investmentAmount)}</td>
                      <td><span className="kfpl-badge kfpl-badge--emerald">{c.slabPercentage || (c.slabPercent ? `${c.slabPercent}%` : '—')}</span></td>
                      <td className="cell-amount cell-amount--positive">{formatCurrency(c.amount !== undefined ? c.amount : c.commissionEarned)}</td>
                      <td>{formatDateSafe(c.date || c.dateCredited || c.dateOfJoining)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ═══ MONTHLY TAB ═══ */}
      {activeTab === 'monthly' && (
        <>
          {/* Monthly Table */}
          <div className="kfpl-panel-card">
            <div className="kfpl-panel-card-header">
              <div>
                <h3>Monthly Commission Ledger</h3>
                <p>Recurring payout base and slab percentage</p>
              </div>
              <span className="kfpl-badge kfpl-badge--info">{monthlyCommission.length} months</span>
            </div>
            <div className="kfpl-table-wrapper">
              <div className="kfpl-table-scroll">
                <table className="kfpl-table">
                  <thead>
                    <tr>
                      <th>Month</th>
                      <th style={{ textAlign: 'right' }}>Investment Base</th>
                      <th>Slab %</th>
                      <th style={{ textAlign: 'right' }}>Commission Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyCommission.map((m, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 600 }}>{m.period || m.month}</td>
                        <td className="cell-amount">{formatCurrency(m.investmentAmount !== undefined ? m.investmentAmount : m.investmentBase)}</td>
                        <td><span className="kfpl-badge kfpl-badge--emerald">{m.slabPercentage || (m.slabPercent ? `${m.slabPercent}%` : '—')}</span></td>
                        <td className="cell-amount cell-amount--positive">{formatCurrency(m.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="kfpl-chart-wrapper" style={{ marginTop: 24 }}>
            <div className="kfpl-chart-header">
              <div>
                <div className="kfpl-chart-title">Monthly Commission Trend</div>
                <div className="kfpl-chart-subtitle">Last 12 months</div>
              </div>
              <div className="kfpl-chart-actions">
                <button className="kfpl-btn kfpl-btn--secondary kfpl-btn--sm" onClick={() => handleDownload('pdf')}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 14, height: 14 }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  PDF
                </button>
                <button className="kfpl-btn kfpl-btn--secondary kfpl-btn--sm" onClick={() => handleDownload('xlsx')}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 14, height: 14 }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Excel
                </button>
              </div>
            </div>
            <div className="kfpl-chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyChartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-light)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(16, 185, 129, 0.06)' }} />
                  <Bar dataKey="amount" fill="var(--color-gold)" radius={[6, 6, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {/* ═══ SPECIAL TAB ═══ */}
      {activeTab === 'special' && (
        <div className="kfpl-panel-card">
          <div className="kfpl-panel-card-header">
            <div>
              <h3>Special Commission</h3>
              <p>Manual bonus and adjustment history</p>
            </div>
            <span className="kfpl-badge kfpl-badge--warning">{specialCommission.length} entries</span>
          </div>
          <div className="kfpl-table-wrapper">
            <div className="kfpl-table-scroll">
              <table className="kfpl-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Reason</th>
                    <th style={{ textAlign: 'right' }}>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {specialCommission.map((s, i) => (
                    <tr key={s._id || s.id || i}>
                      <td>{formatDateSafe(s.date)}</td>
                      <td style={{ fontWeight: 500 }}>{s.remarks || s.reason || '—'}</td>
                      <td className="cell-amount cell-amount--positive">{formatCurrency(s.amount)}</td>
                      <td>
                        <span className={`kfpl-badge ${
                          ['credited', 'paid', 'success'].includes(String(s.status).toLowerCase()) 
                            ? 'kfpl-badge--emerald' 
                            : 'kfpl-badge--gold'
                        }`}>
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============ END: CommissionOverview.jsx ============ */
