// src/controllers/history.controller.js - Riwayat deteksi makanan user (SQLite)
import { query, getOne, execute } from '../config/db.js';

/**
 * GET /api/history - Ambil semua riwayat user yang login
 */
export const getHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const histories = await query(
      'SELECT * FROM food_histories WHERE userId = ? ORDER BY detectedAt DESC LIMIT ? OFFSET ?',
      [req.user.id, Number(limit), offset]
    );

    const totalCount = await getOne(
      'SELECT COUNT(*) as count FROM food_histories WHERE userId = ?',
      [req.user.id]
    );

    const total = totalCount?.count || 0;

    return res.json({
      success: true,
      data: histories,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/history/summary - Ringkasan kalori harian
 */
export const getDailySummary = async (req, res) => {
  try {
    // Ambil data hari ini berdasarkan tanggal lokal
    const todayStr = new Date().toISOString().split('T')[0];

    const todayHistory = await query(
      `SELECT * FROM food_histories 
       WHERE userId = ? AND date(detectedAt) = date('now')
       ORDER BY detectedAt DESC`,
      [req.user.id]
    );

    const summary = todayHistory.reduce(
      (acc, item) => ({
        totalCalories: acc.totalCalories + (item.calories || 0),
        totalProtein: acc.totalProtein + (item.protein || 0),
        totalFat: acc.totalFat + (item.fat || 0),
        totalCarbs: acc.totalCarbs + (item.carbs || 0),
        count: acc.count + 1,
      }),
      { totalCalories: 0, totalProtein: 0, totalFat: 0, totalCarbs: 0, count: 0 }
    );

    return res.json({
      success: true,
      data: {
        date: todayStr,
        ...summary,
        items: todayHistory,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * DELETE /api/history/:id - Hapus satu riwayat
 */
export const deleteHistory = async (req, res) => {
  try {
    const { id } = req.params;

    const history = await getOne(
      'SELECT id FROM food_histories WHERE id = ? AND userId = ?',
      [Number(id), req.user.id]
    );

    if (!history) {
      return res.status(404).json({ success: false, message: 'Riwayat tidak ditemukan.' });
    }

    await execute('DELETE FROM food_histories WHERE id = ?', [Number(id)]);
    return res.json({ success: true, message: 'Riwayat berhasil dihapus.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
