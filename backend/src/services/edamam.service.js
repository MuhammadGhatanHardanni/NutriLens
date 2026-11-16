// src/services/edamam.service.js - Integrasi Edamam Nutrition Database API
import axios from 'axios';

const EDAMAM_BASE_URL = 'https://api.edamam.com/api/nutrition-data';
const FOOD_SEARCH_URL = 'https://api.edamam.com/api/food-database/v2/parser';

/**
 * Mencari informasi gizi berdasarkan nama makanan
 * @param {string} foodName - Nama makanan yang ingin dicari
 * @returns {Object} - Data gizi makanan
 */
export const searchFoodNutrition = async (foodName) => {
  try {
    const response = await axios.get(FOOD_SEARCH_URL, {
      params: {
        app_id: process.env.EDAMAM_APP_ID,
        app_key: process.env.EDAMAM_APP_KEY,
        ingr: foodName,
        'nutrition-type': 'cooking',
      },
    });

    const hints = response.data.hints;
    if (!hints || hints.length === 0) {
      return { success: false, message: 'Makanan tidak ditemukan di database.' };
    }

    // Ambil hasil pertama yang paling relevan
    const food = hints[0].food;
    const nutrients = food.nutrients;

    return {
      success: true,
      data: {
        foodId: food.foodId,
        label: food.label,
        category: food.category,
        image: food.image || null,
        nutrients: {
          calories: Math.round(nutrients.ENERC_KCAL || 0),     // kcal per 100g
          protein: Math.round((nutrients.PROCNT || 0) * 10) / 10, // gram
          fat: Math.round((nutrients.FAT || 0) * 10) / 10,        // gram
          carbs: Math.round((nutrients.CHOCDF || 0) * 10) / 10,   // gram
          fiber: Math.round((nutrients.FIBTG || 0) * 10) / 10,    // gram
        },
        servingSize: '100g',
      },
    };
  } catch (error) {
    console.error('Edamam API Error:', error.response?.data || error.message);
    throw new Error('Gagal mengambil data gizi dari database.');
  }
};

