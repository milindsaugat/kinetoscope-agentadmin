/* ============================================================
   Data: mockData.js (agent-admin)
   Description: Cleaned configuration constants & formatters re-exports
   ============================================================ */

export { formatCurrency, formatNumber } from '../utils/formatters';

export const agentProfile = {};
export const dashboardStats = {
  commissionPaid: 0,
  commissionPending: 0,
  rewardsEarned: 0,
  totalClients: 0,
  thisMonthCommission: 0,
  activeInvestments: 0,
};

export const clientsList = [];
export const oneTimeCommission = [];
export const monthlyCommission = [];
export const monthlyChartData = [];
export const specialCommission = [];
export const rewardsList = [];
export const rewardsHistory = [];
export const activityFeed = [];
export const withdrawalHistory = [];
export const serviceRequests = [];
export const growOffers = [];

export const oneTimeSlabs = [
  { min: 0, max: 500000, percent: 2.0 },
  { min: 500001, max: 1500000, percent: 2.5 },
  { min: 1500001, max: 3000000, percent: 3.0 },
  { min: 3000001, max: 5000000, percent: 3.5 },
  { min: 500001, max: Infinity, percent: 4.0 },
];

export const monthlySlabs = [
  { min: 0, max: 1000000, percent: 0.5 },
  { min: 1000001, max: 3000000, percent: 0.75 },
  { min: 3000001, max: Infinity, percent: 1.0 },
];

export const calculatorSlabs = [
  { min: 0, max: 500000, oneTimePercent: 2.0, monthlyPercent: 0.5 },
  { min: 500001, max: 1500000, oneTimePercent: 2.5, monthlyPercent: 0.5 },
  { min: 1500001, max: 3000000, oneTimePercent: 3.0, monthlyPercent: 0.75 },
  { min: 3000001, max: 5000000, oneTimePercent: 3.5, monthlyPercent: 0.75 },
  { min: 5000001, max: Infinity, oneTimePercent: 4.0, monthlyPercent: 1.0 },
];
