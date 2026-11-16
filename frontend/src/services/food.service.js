// src/services/food.service.js - API calls untuk deteksi makanan
import api from './api.js';

export const detectFood = async (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  const response = await api.post('/food/detect', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const searchFood = async (name) => {
  const response = await api.get(`/food/search?name=${encodeURIComponent(name)}`);
  return response.data;
};

