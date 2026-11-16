// src/services/history.service.js - API calls untuk riwayat
import api from './api.js';

export const getHistory = async (page = 1) => {
  const response = await api.get(`/history?page=${page}`);
  return response.data;
};

export const getDailySummary = async () => {
  const response = await api.get('/history/summary');
  return response.data;
};

export const deleteHistory = async (id) => {
  const response = await api.delete(`/history/${id}`);
  return response.data;
};

