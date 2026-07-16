/* ============================================================
   Data: mockData.js
   Description: Comprehensive mock data for Agent Portal
   All API shapes match PRD Section 20 contracts
   ============================================================ */

// ── Formatters ───────────────────────
export const formatCurrency = (n) => {
  if (n === undefined || n === null || isNaN(n)) return '₹0';
  return '₹' + Number(n).toLocaleString('en-IN');
};
export const formatNumber = (n) => {
  if (n === undefined || n === null || isNaN(n)) return '0';
  return Number(n).toLocaleString('en-IN');
};

// ── Agent Profile ───────────────────────
if (typeof window !== 'undefined') {
  if (!localStorage.getItem('kfpl_agents')) {
    localStorage.setItem('kfpl_agents', JSON.stringify([
      {
        id: 'ag_001',
        agentId: 'KFPL-AG-1042',
        name: 'Rajesh Sharma',
        email: 'rajesh.sharma@mail.com',
        phone: '+91 98765 43210',
        address: '42, MG Road, Indore, MP 452001',
        joiningDate: '2024-03-15',
        status: 'Active',
        slabTier: 'Silver',
        bankName: 'HDFC Bank',
        bankAccount: '****6789',
        ifsc: 'HDFC0001234',
        onboardingComplete: true,
        nominee: {
          name: 'Priya Sharma',
          relation: 'Spouse',
          contact: '+91 87654 32100',
          email: 'priya.sharma@mail.com',
        },
        stats: {
          commissionPaid: 0,
          commissionPending: 0,
        }
      },
      {
        id: 'ag_002',
        agentId: 'KFPL-AG-1043',
        name: 'Karan Malhotra',
        email: 'karan.malhotra@mail.com',
        phone: '+91 91111 88888',
        address: '78, Link Road, Andheri West, Mumbai 400053',
        joiningDate: '2024-06-01',
        status: 'Active',
        slabTier: 'Gold',
        bankName: 'ICICI Bank',
        bankAccount: '****4321',
        ifsc: 'ICIC0000123',
        onboardingComplete: true,
        nominee: {
          name: 'Riya Malhotra',
          relation: 'Spouse',
          contact: '+91 91111 77777',
          email: 'riya.malhotra@mail.com',
        },
        stats: {
          commissionPaid: 0,
          commissionPending: 0,
        }
      },
      {
        id: 'ag_003',
        agentId: 'KFPL-AG-1044',
        name: 'Neha Kapoor',
        email: 'neha.kapoor@mail.com',
        phone: '+91 98888 77777',
        address: '12, Ring Road, Lajpat Nagar, Delhi 110024',
        joiningDate: '2024-09-10',
        status: 'Active',
        slabTier: 'Diamond',
        bankName: 'State Bank of India',
        bankAccount: '****5678',
        ifsc: 'SBIN0000456',
        onboardingComplete: true,
        nominee: {
          name: 'Sunil Kapoor',
          relation: 'Father',
          contact: '+91 98888 66666',
          email: 'sunil.kapoor@mail.com',
        },
        stats: {
          commissionPaid: 0,
          commissionPending: 0,
        }
      }
    ]));
  }
}

export const agentProfile = {
  id: 'ag_001',
  agentId: 'KFPL-AG-1042',
  name: 'Rajesh Sharma',
  email: 'rajesh.sharma@mail.com',
  phone: '+91 98765 43210',
  address: '42, MG Road, Indore, MP 452001',
  joiningDate: '2024-03-15',
  status: 'Active',
  slabTier: 'Silver',
  bankName: 'HDFC Bank',
  bankAccount: '****6789',
  ifsc: 'HDFC0001234',
  onboardingComplete: true,
  nominee: {
    name: 'Priya Sharma',
    relation: 'Spouse',
    contact: '+91 87654 32100',
    email: 'priya.sharma@mail.com',
  },
};

// ── Dashboard Stats ───────────────────────
export const dashboardStats = {
  commissionPaid: 0,
  commissionPending: 0,
  rewardsEarned: 0,
  totalClients: 0,
  thisMonthCommission: 0,
  activeInvestments: 0,
};

// ── Clients List ───────────────────────
export const clientsList = [];

// ── One-Time Commission ───────────────────────
export const oneTimeSlabs = [
  { min: 0, max: 500000, percent: 2.0 },
  { min: 500001, max: 1500000, percent: 2.5 },
  { min: 1500001, max: 3000000, percent: 3.0 },
  { min: 3000001, max: 5000000, percent: 3.5 },
  { min: 5000001, max: Infinity, percent: 4.0 },
];

export const oneTimeCommission = [];

// ── Monthly Commission ───────────────────────
export const monthlySlabs = [
  { min: 0, max: 1000000, percent: 0.5 },
  { min: 1000001, max: 3000000, percent: 0.75 },
  { min: 3000001, max: Infinity, percent: 1.0 },
];

export const monthlyCommission = [];

// Chart data
export const monthlyChartData = [];

// ── Special Commission ───────────────────────
export const specialCommission = [];

// ── Rewards ───────────────────────
export const rewardsList = [
  { id: 'rw_01', title: 'Silver Milestone', description: 'Bring 5 clients to KFPL', icon: 'star', targetLabel: '5 Clients', targetValue: 5, currentValue: 0, status: 'locked' },
  { id: 'rw_02', title: 'Gold Milestone', description: 'Bring 10 clients to unlock a bonus reward', icon: 'trophy', targetLabel: '10 Clients', targetValue: 10, currentValue: 0, status: 'locked' },
  { id: 'rw_03', title: 'Cash Bonus ₹10K', description: 'Generate ₹50L total client investment', icon: 'gift', targetLabel: '₹50,00,000 Investment', targetValue: 5000000, currentValue: 0, status: 'locked' },
  { id: 'rw_04', title: 'Platinum Star', description: 'Bring 20 clients to KFPL', icon: 'crown', targetLabel: '20 Clients', targetValue: 20, currentValue: 0, status: 'locked' },
  { id: 'rw_05', title: 'Luxury Trip', description: 'Generate ₹2Cr total investment to win a luxury trip', icon: 'plane', targetLabel: '₹2,00,00,000 Investment', targetValue: 20000000, currentValue: 0, status: 'locked' },
  { id: 'rw_06', title: 'Diamond League', description: 'Bring 50 clients to enter the Diamond League', icon: 'diamond', targetLabel: '50 Clients', targetValue: 50, currentValue: 0, status: 'locked' },
];

export const rewardsHistory = [];

// ── Activity Feed ───────────────────────
export const activityFeed = [];

// ── Withdrawal ───────────────────────
export const withdrawalHistory = [];

// ── Service Requests ───────────────────────
export const serviceRequests = [];

// ── Offers / Plans (Grow with KFPL) ───────────────────────
export const growOffers = [
  { id: 'of_01', title: 'Film Production Bundle', description: "Exclusive investment opportunity in KFPL's upcoming blockbuster. Higher ROI, shorter lock-in period.", minInvestment: 1000000, expectedROI: '14-16%', period: '18 months', isNew: true },
  { id: 'of_02', title: 'Music Label Investment', description: "Invest in KFPL's music label expansion. Steady streaming revenue with monthly distributions.", minInvestment: 500000, expectedROI: '11-13%', period: '12 months', isNew: true },
  { id: 'of_03', title: 'OTT Content Fund', description: "Back KFPL's OTT original series portfolio. Multiple revenue streams from licensing contracts.", minInvestment: 750000, expectedROI: '12-14%', period: '24 months', isNew: false },
  { id: 'of_04', title: 'Distribution Network', description: "Participate in KFPL's distribution arm. Global content distribution rights with premium returns.", minInvestment: 2000000, expectedROI: '15-18%', period: '36 months', isNew: false },
];

// ── Calculator Slabs ───────────────────────
export const calculatorSlabs = [
  { min: 0, max: 500000, oneTimePercent: 2.0, monthlyPercent: 0.5 },
  { min: 500001, max: 1500000, oneTimePercent: 2.5, monthlyPercent: 0.5 },
  { min: 1500001, max: 3000000, oneTimePercent: 3.0, monthlyPercent: 0.75 },
  { min: 3000001, max: 5000000, oneTimePercent: 3.5, monthlyPercent: 0.75 },
  { min: 5000001, max: Infinity, oneTimePercent: 4.0, monthlyPercent: 1.0 },
];

/* ============ END: mockData.js ============ */
