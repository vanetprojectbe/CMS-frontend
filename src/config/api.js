// src/config/api.js

const API_BASE = "https://cms-backend-lmof.onrender.com";

export const API = {
  // Auth
  login:    `${API_BASE}/api/auth/login`,
  register: `${API_BASE}/api/auth/register`,

  // accident (backend uses "accident" not "incidents")
  incidents:  `${API_BASE}/api/accident`,   // ← map "incidents" → "/api/accident"
  accident:  `${API_BASE}/api/accident`,   // ← keep both so nothing breaks

  // Alerts
  alerts:   `${API_BASE}/api/alerts`,

  // RSU
  rsu:      `${API_BASE}/api/rsu`,

  // Admin
  users:    `${API_BASE}/api/admin/users`,

  // Health
  test:     `${API_BASE}/api/test`
};
