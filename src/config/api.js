const API_BASE = "https://cms-backend-lmof.onrender.com";

export const API = {
  accidents: `${API_BASE}/api/accidents`,
  rsu:       `${API_BASE}/api/rsu`,
  login:     `${API_BASE}/api/auth/login`,
  test:      `${API_BASE}/api/test`
};

// Call this on app load to wake the backend and confirm it's up
export async function checkBackend(retries = 3, delayMs = 3000) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(API.test, { signal: AbortSignal.timeout(8000) });
      if (res.ok) return true;
    } catch {
      if (i < retries - 1) await new Promise(r => setTimeout(r, delayMs));
    }
  }
  return false;
}



// add this helper

export async function apiFetch(url, options = {}) {
  const token = localStorage.getItem("token");

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });

  if (res.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  return res;
}
