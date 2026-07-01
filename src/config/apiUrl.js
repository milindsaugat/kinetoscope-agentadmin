/* ============================================================
   Config: apiUrl.js
   Description: Dynamic API URL helper for Dev (relative proxy)
                and Production (absolute IP/Domain)
   ============================================================ */

export const getApiUrl = (path) => {
  const isLocal =
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname.startsWith('192.168.');

  const baseUrl = isLocal ? '' : 'http://192.168.1.22:5000';
  return `${baseUrl}${path}`;
};
