// src/controllers/food.controller.js - Controller untuk deteksi makanan via Gemini
import { analyzeFoodWithGemini } from '../services/gemini.service.js';
import { execute } from '../config/db.js';

/**
 * POST /api/food/detect
 * Upload gambar -> deteksi makanan & estimasi nutrisi via Gemini API
 */
export const detectFood = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'File gambar wajib diunggah.' });
    }

    const imagePath = req.file.path;
    const imageUrl = `/uploads/${req.file.filename}`;
    const mimeType = req.file.mimetype;

    // Analisis menggunakan Gemini
    const analysisResult = await analyzeFoodWithGemini(imagePath, mimeType);
    const geminiData = analysisResult.data;

    // Simpan ke database riwayat jika user sudah login
    let savedHistoryId = null;
    if (req.user) {
      try {
        const result = await execute(
          `INSERT INTO food_histories 
            (userId, foodName, imageUrl, calories, protein, fat, carbs, fiber, servingSize) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            req.user.id,
            geminiData.foodName,
            imageUrl,
            geminiData.nutrients.calories || 0,
            geminiData.nutrients.protein || 0,
            geminiData.nutrients.fat || 0,
            geminiData.nutrients.carbs || 0,
            geminiData.nutrients.fiber || 0,
            geminiData.servingSize || '1 porsi',
          ]
        );
        savedHistoryId = result.id;
      } catch (dbErr) {
        console.warn('Gagal menyimpan riwayat ke DB:', dbErr.message);
      }
    }

    return res.json({
      success: true,
      isMock: analysisResult.isMock || false,
      modelUsed: analysisResult.modelUsed || null,
      data: {
        imageUrl,
        isMock: analysisResult.isMock || false,
        modelUsed: analysisResult.modelUsed || null,
        detectedFoods: [
          {
            name: geminiData.foodName,
            confidence: geminiData.confidence,
          },
          ...(geminiData.otherDetectedItems || []).map((item) => ({
            name: item,
            confidence: 0.85,
          })),
        ],
        nutrition: {
          label: geminiData.foodName,
          servingSize: geminiData.servingSize,
          description: geminiData.description,
          nutrients: geminiData.nutrients,
        },
        historyId: savedHistoryId,
      },
    });
  } catch (error) {
    console.error('detectFood error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/food/search?name=ayam
 */
export const searchFood = async (req, res) => {
  return res.json({
    success: true,
    message: 'Gunakan endpoint deteksi gambar untuk estimasi nutrisi instan dengan AI.',
  });
};
