/* ============================================================
   Page: MyClients.jsx
   Description: Client list table with search, filter, sort
   Matches Super Admin's InvestorList.jsx exactly in layout and structure
   ============================================================ */

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { clientsList, formatCurrency } from '../../data/mockData';
import DataTable from '../../components/ui/DataTable';
import Badge from '../../components/ui/Badge';

export default function MyClients() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('all');
  const [tierFilter, setTierFilter] = useState('all');

  // Filter clients based on statusFilter and tierFilter
  const filteredClients = useMemo(() => {
    return clientsList.filter(c => {
      if (statusFilter !== 'all') {
        if (c.status.toLowerCase() !== statusFilter.toLowerCase()) return false;
      }
      if (tierFilter !== 'all') {
        let tier = 'silver';
        if (c.totalInvestment >= 5000000) tier = 'diamond';
        else if (c.totalInvestment >= 3000000) tier = 'platinum';
        else if (c.totalInvestment >= 1500000) tier = 'gold';
        
        if (tier !== tierFilter) return false;
      }
      return true;
    });
  }, [statusFilter, tierFilter]);

  const columns = [
    { 
      header: 'Client ID', 
      accessor: 'clientId',
      render: (row) => <span>{row.clientId}</span>
    },
    { 
      header: 'Join Date', 
      accessor: 'dateOfJoining',
      render: (row) => {
        const date = new Date(row.dateOfJoining);
        const day = String(date.getDate()).padStart(2, '0');
        const mon = String(date.getMonth() + 1).padStart(2, '0');
        return <span>{`${day}/${mon}/${date.getFullYear()}`}</span>;
      }
    },
    {
      header: 'Contract End',
      render: (row) => {
        const d = new Date(row.dateOfJoining);
        const months = parseInt(row.contractPeriod) || 24;
        d.setMonth(d.getMonth() + months);
        const day = String(d.getDate()).padStart(2, '0');
        const mon = String(d.getMonth() + 1).padStart(2, '0');
        return <span>{`${day}/${mon}/${d.getFullYear()}`}</span>;
      }
    },
    {
      header: 'Client Name',
      accessor: 'name',
      render: (row) => <span style={{ fontWeight: 600 }}>{row.name}</span>
    },
    { header: 'Email Address', accessor: 'email' },
    {
      header: 'Total Investment',
      accessor: 'totalInvestment',
      render: (row) => <span className="font-semibold">{formatCurrency(row.totalInvestment)}</span>
    },
    {
      header: 'Monthly ROI % Allocated',
      accessor: 'roiPercent',
      render: (row) => `${row.roiPercent}%`
    },
    {
      header: 'Perks',
      accessor: 'totalInvestment',
      render: (row) => {
        let tier = 'silver';
        if (row.totalInvestment >= 5000000) tier = 'diamond';
        else if (row.totalInvestment >= 3000000) tier = 'platinum';
        else if (row.totalInvestment >= 1500000) tier = 'gold';
        return <Badge status={tier}>{tier.toUpperCase()}</Badge>;
      }
    },
    {
      header: 'Commission Earned',
      accessor: 'commissionPaid',
      render: (row) => <span className="font-semibold" style={{ color: 'var(--color-success)' }}>{formatCurrency(row.commissionPaid)}</span>
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => <Badge status={row.status === 'Active' ? 'active' : 'inactive'}>{row.status}</Badge>
    }
  ];

  return (
    <div className="kfpl-page" id="my-clients-page">
      
      {/* ── Page Header matching Super Admin style ── */}
      <div className="kfpl-page-header">
        <div className="kfpl-page-header-left">
          <h2 className="kfpl-page-title">My Clients</h2>
          <p className="kfpl-page-subtitle">Overview of your registered clients, active contracts, and commission slab stats.</p>
        </div>
        <div className="kfpl-page-header-actions">
          {/* Status filter dropdown */}
          <select
            className="kfpl-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: '130px', padding: '8px 12px', fontSize: '0.875rem', borderRadius: '8px', border: '1px solid var(--color-border)', marginRight: '8px' }}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          {/* Tier filter dropdown */}
          <select
            className="kfpl-select"
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            style={{ width: '140px', padding: '8px 12px', fontSize: '0.875rem', borderRadius: '8px', border: '1px solid var(--color-border)', marginRight: '8px' }}
          >
            <option value="all">All Tiers</option>
            <option value="silver">Silver</option>
            <option value="gold">Gold</option>
            <option value="platinum">Platinum</option>
            <option value="diamond">Diamond</option>
          </select>

          <button className="kfpl-btn kfpl-btn--ghost kfpl-btn--sm">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="16" height="16">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Export CSV
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredClients}
        onRowClick={(row) => {
          console.log('MyClients: Row click received. Navigating to:', `/clients/${row.clientId}`);
          navigate(`/clients/${row.clientId}`);
        }}
        searchPlaceholder="Search clients by name, email, ID..."
      />
    </div>
  );
}
