// src/services/api.js - Axios instance terpusat
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor: tambahkan token JWT otomatis
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('nutrisnap_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor: handle 401 (expired token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('nutrisnap_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

