// src/services/logmeal.service.js - Integrasi Logmeal Image Recognition API
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

const LOGMEAL_BASE_URL = 'https://api.logmeal.com/v2';

/**
 * Mendeteksi makanan dari file gambar menggunakan Logmeal API
 * @param {string} imagePath - Path ke file gambar
 * @returns {Object} - Hasil deteksi makanan
 */
export const detectFoodFromImage = async (imagePath) => {
  try {
    const formData = new FormData();
    formData.append('image', fs.createReadStream(imagePath));

    const response = await axios.post(
      `${LOGMEAL_BASE_URL}/image/segmentation/complete/v1.0`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer ${process.env.LOGMEAL_API_KEY}`,
        },
      }
    );

    const data = response.data;

    // Ambil daftar makanan yang terdeteksi
    const detectedFoods = data.segmentation_results?.map((item) => ({
      name: item.recognition_results?.[0]?.name || 'Unknown',
      confidence: item.recognition_results?.[0]?.prob || 0,
      id: item.recognition_results?.[0]?.id,
    })) || [];

    return {
      success: true,
      imageId: data.imageId,
      detectedFoods,
    };
  } catch (error) {
    console.error('Logmeal API Error:', error.response?.data || error.message);
    throw new Error('Gagal mendeteksi makanan. Coba dengan foto yang lebih jelas.');
  }
};

/**
 * Mendapatkan informasi nutrisi dari Logmeal berdasarkan imageId
 * @param {string} imageId - ID gambar dari hasil deteksi
 */
export const getNutritionFromLogmeal = async (imageId) => {
  try {
    const response = await axios.post(
      `${LOGMEAL_BASE_URL}/nutritional_info`,
      { imageId },
      {
        headers: {
          Authorization: `Bearer ${process.env.LOGMEAL_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      success: true,
      nutrition: response.data,
    };
  } catch (error) {
    console.error('Logmeal Nutrition Error:', error.response?.data || error.message);
    throw new Error('Gagal mengambil data nutrisi.');
  }
};

