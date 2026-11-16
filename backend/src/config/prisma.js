// src/config/prisma.js - Database client singleton dengan gracefully fallback jika DB belum disetup
let prisma = null;

try {
  // Hanya inisialisasi jika @prisma/client sudah di-generate
  const { PrismaClient } = await import('@prisma/client');
  prisma = new PrismaClient();
} catch (err) {
  console.warn('ℹ️ Prisma Client belum digenerate atau Database belum terhubung. Mode standalone aktif.');
  // Dummy fallback agar server tidak crash saat boot
  prisma = {
    foodHistory: {
      findMany: async () => [],
      count: async () => 0,
      create: async () => null,
      findFirst: async () => null,
      delete: async () => null,
    },
    user: {
      findUnique: async () => null,
      create: async () => null,
    },
  };
}

export default prisma;
