// src/config/db.js - Database PostgreSQL Connection Pool
import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

const { Pool } = pg;

// Ambil connection string dari environment
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/nutrisnap_db';

const pool = new Pool({
  connectionString,
});

// Inisialisasi tabel PostgreSQL otomatis saat terhubung
export const initDatabase = async () => {
  try {
    const client = await pool.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      await client.query(`
        CREATE TABLE IF NOT EXISTS food_histories (
          id SERIAL PRIMARY KEY,
          "userId" INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          "foodName" VARCHAR(255) NOT NULL,
          "imageUrl" TEXT,
          calories REAL DEFAULT 0,
          protein REAL DEFAULT 0,
          fat REAL DEFAULT 0,
          carbs REAL DEFAULT 0,
          fiber REAL DEFAULT 0,
          "servingSize" VARCHAR(100) DEFAULT '1 porsi',
          "detectedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('🐘 Terhubung ke database PostgreSQL & tabel siap digunakan!');
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('⚠️ Gagal terhubung ke database PostgreSQL:', err.message);
    console.warn('👉 Pastikan service PostgreSQL sudah berjalan dan kredensial di .env sudah benar.');
  }
};

initDatabase();

// Helper untuk format SQL query agar kompatibel dengan PostgreSQL
const formatSqlForPg = (sql) => {
  let paramIndex = 1;
  // Ganti placeholder ? dengan $1, $2, dst.
  let formatted = sql.replace(/\?/g, () => `$${paramIndex++}`);
  // Ganti fungsi tanggal SQLite dengan PostgreSQL
  formatted = formatted.replace(/date\(\s*['"]now['"]\s*\)/gi, 'CURRENT_DATE');
  formatted = formatted.replace(/date\(([a-zA-Z0-9_"]+)\)/gi, 'DATE($1)');

  // Pastikan kolom camelCase di-quote agar PostgreSQL mempertahankan nama kolom
  const camelCols = ['userId', 'foodName', 'imageUrl', 'servingSize', 'detectedAt', 'createdAt'];
  for (const col of camelCols) {
    const regex = new RegExp(`(?<!")\\b${col}\\b(?!")`, 'g');
    formatted = formatted.replace(regex, `"${col}"`);
  }

  return formatted;
};

// Helper query dengan Promise untuk PostgreSQL
export const query = async (sql, params = []) => {
  const formattedSql = formatSqlForPg(sql);
  const res = await pool.query(formattedSql, params);
  return res.rows;
};

export const getOne = async (sql, params = []) => {
  const formattedSql = formatSqlForPg(sql);
  const res = await pool.query(formattedSql, params);
  return res.rows[0] || null;
};

export const execute = async (sql, params = []) => {
  let formattedSql = formatSqlForPg(sql);
  // Jika INSERT dan belum ada RETURNING id, tambahkan RETURNING id
  if (/^\s*INSERT\s+INTO/i.test(formattedSql) && !/RETURNING/i.test(formattedSql)) {
    formattedSql += ' RETURNING id';
  }
  const res = await pool.query(formattedSql, params);
  return {
    id: res.rows?.[0]?.id || null,
    changes: res.rowCount,
  };
};

export default pool;
