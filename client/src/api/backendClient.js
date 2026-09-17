const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api/v1';

export const backendClient = {
  async get(endpoint, token = null, customHeaders = {}) {
    const headers = { 'Content-Type': 'application/json', ...customHeaders };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, { headers });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn(`[backendClient] GET ${endpoint} error, fallback active:`, err.message);
      return null;
    }
  },

  async post(endpoint, body = {}, token = null, customHeaders = {}) {
    const headers = { 'Content-Type': 'application/json', ...customHeaders };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn(`[backendClient] POST ${endpoint} error, fallback active:`, err.message);
      return null;
    }
  },

  async patch(endpoint, body = {}, token = null, customHeaders = {}) {
    const headers = { 'Content-Type': 'application/json', ...customHeaders };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn(`[backendClient] PATCH ${endpoint} error, fallback active:`, err.message);
      return null;
    }
  },
};

