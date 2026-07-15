/* ============================================================
   Component: Badge.jsx
   Description: Status badge with color variants (Crash-Safe)
   ============================================================ */

export default function Badge({ status, children }) {
  const statusClass = status && typeof status === 'string' 
    ? `kfpl-badge--${status.toLowerCase()}` 
    : '';
  return (
    <span className={`kfpl-badge ${statusClass}`}>
      {children || String(status || '')}
    </span>
  );
}
