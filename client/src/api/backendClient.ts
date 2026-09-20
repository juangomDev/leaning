import { apiClient } from './apiClient';

/**
 * Adaptador de compatibilidad para backendClient que delega en Axios
 * manteniendo soporte para withCredentials: true y manejo unificado
 */
export const backendClient = {
  async get<T = any>(
    endpoint: string,
    token: string | null = null,
    customHeaders: Record<string, string> = {}
  ): Promise<T | null> {
    const headers: Record<string, string> = { ...customHeaders };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const res = await apiClient.get<T>(endpoint, { headers });
      return res.data;
    } catch (err: any) {
      console.warn(`[backendClient] GET ${endpoint} error, fallback active:`, err?.message);
      return null;
    }
  },

  async post<T = any>(
    endpoint: string,
    body: any = {},
    token: string | null = null,
    customHeaders: Record<string, string> = {}
  ): Promise<T | null> {
    const headers: Record<string, string> = { ...customHeaders };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const res = await apiClient.post<T>(endpoint, body, { headers });
      return res.data;
    } catch (err: any) {
      console.warn(`[backendClient] POST ${endpoint} error, fallback active:`, err?.message);
      return null;
    }
  },

  async patch<T = any>(
    endpoint: string,
    body: any = {},
    token: string | null = null,
    customHeaders: Record<string, string> = {}
  ): Promise<T | null> {
    const headers: Record<string, string> = { ...customHeaders };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const res = await apiClient.patch<T>(endpoint, body, { headers });
      return res.data;
    } catch (err: any) {
      console.warn(`[backendClient] PATCH ${endpoint} error, fallback active:`, err?.message);
      return null;
    }
  },
};

export { apiClient } from './apiClient';
