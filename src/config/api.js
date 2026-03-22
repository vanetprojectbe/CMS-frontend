// src/config/api.js

const API_BASE = "https://cms-backend-lmof.onrender.com";

export const API = {
  // Auth
  login:    `${API_BASE}/api/auth/login`,
  register: `${API_BASE}/api/auth/register`,

  // Accidents (backend uses "accidents" not "incidents")
  incidents:  `${API_BASE}/api/accidents`,   // ← map "incidents" → "/api/accidents"
  accidents:  `${API_BASE}/api/accidents`,   // ← keep both so nothing breaks

  // Alerts
  alerts:   `${API_BASE}/api/alerts`,

  // RSU
  rsu:      `${API_BASE}/api/rsu`,

  // Admin
  users:    `${API_BASE}/api/admin/users`,

  // Health
  test:     `${API_BASE}/api/test`
};
