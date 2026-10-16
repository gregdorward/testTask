/**
 * Real backend client. Used when VITE_API_URL is set (e.g. the monorepo
 * `backend` service). Mirrors the { data } shape the app already expects and
 * attaches the saved JWT as a Bearer token.
 */
import axios from 'axios';

const base = String(import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

const client = axios.create({ baseURL: `${base}/api` });

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('waracle_token');
  if (token) {
    config.headers = config.headers || {};
    (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;
