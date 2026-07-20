/* ============================================================
   Utils: formatters.js (agent-admin)
   Description: Formatting helpers for Currency, Numbers, etc.
   ============================================================ */

export function formatCurrency(n) {
  if (n === undefined || n === null || isNaN(n)) return '₹0';
  return '₹' + Number(n).toLocaleString('en-IN');
}

export function formatNumber(n) {
  if (n === undefined || n === null || isNaN(n)) return '0';
  return Number(n).toLocaleString('en-IN');
}

export function formatClientID(rawId) {
  if (!rawId || rawId === '—') return 'KFPL-CL-1001';
  const str = String(rawId).trim();
  if (str.toUpperCase().startsWith('KFPL-CL-')) return str.toUpperCase();

  const digits = str.match(/\d+/);
  if (digits) {
    let val = parseInt(digits[0], 10);
    if (val < 1000) val += 1000;
    return `KFPL-CL-${val}`;
  }
  return 'KFPL-CL-1001';
}

export function formatAgentID(rawId) {
  if (!rawId || rawId === '—') return 'KFPL-AG-1001';
  const str = String(rawId).trim();
  if (str.toUpperCase().startsWith('KFPL-AG-')) return str.toUpperCase();

  const digits = str.match(/\d+/);
  if (digits) {
    let val = parseInt(digits[0], 10);
    if (val < 1000) val += 1000;
    return `KFPL-AG-${val}`;
  }
  return 'KFPL-AG-1001';
}
