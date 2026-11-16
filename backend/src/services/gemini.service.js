// src/services/gemini.service.js - Deteksi Makanan & Estimasi Gizi menggunakan Google Gemini API
import { GoogleGenAI, Type } from '@google/genai';
import fs from 'fs';

let aiInstance = null;

const getAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return null;
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
};

const fileToGenerativePart = (path, mimeType) => {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString('base64'),
      mimeType,
    },
  };
};

/**
 * Daftar model Gemini aktif yang dicoba berurutan:
 * Utamakan model stabil yang responsif, lalu fallback ke varian flash lainnya.
 */
const CANDIDATE_MODELS = [
  'gemini-3.6-flash',
  'gemini-3.5-flash',
  'gemini-flash-latest',
  'gemini-3.8-flash',
  'gemini-3.7-flash',
  'gemini-3.1-flash-lite',
];

export const analyzeFoodWithGemini = async (imagePath, mimeType = 'image/jpeg') => {
  const ai = getAIClient();

  if (!ai) {
    console.warn('⚠️ GEMINI_API_KEY belum diisi. Menggunakan Demo Mock Data.');
    return {
      success: true,
      isMock: true,
      data: {
        foodName: 'Ketoprak Jakarta',
        confidence: 0.95,
        otherDetectedItems: ['Tahu Goreng', 'Bihun', 'Tauge', 'Kerupuk Bawang', 'Bumbu Kacang'],
        servingSize: '1 porsi (300g)',
        nutrients: {
          calories: 460,
          protein: 16.0,
          fat: 20.5,
          carbs: 55.0,
          fiber: 4.8,
        },
        description: 'Ketoprak khas Jakarta berisi tahu, ketupat/lontong, bihun, tauge, disiram saus kacang gurih dan kerupuk.',
      },
    };
  }

  const imagePart = fileToGenerativePart(imagePath, mimeType);
  const prompt = `Analisis foto makanan ini secara akurat. Kenali nama masakannya (utamakan nama masakan Indonesia jika makanan Indonesia), estimasi takaran porsinya, dan perkirakan nilai gizinya (kalori dalam kcal, protein, lemak, karbohidrat, serat dalam gram).`;

  const schemaConfig = {
    responseMimeType: 'application/json',
    responseSchema: {
      type: Type.OBJECT,
      properties: {
        foodName: {
          type: Type.STRING,
          description: 'Nama hidangan makanan utama yang terdeteksi',
        },
        confidence: {
          type: Type.NUMBER,
          description: 'Skor keyakinan dari 0.0 sampai 1.0',
        },
        otherDetectedItems: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: 'Komponen lauk atau makanan pendamping lain yang terlihat',
        },
        servingSize: {
          type: Type.STRING,
          description: 'Estimasi takaran porsi, misalnya: 1 porsi (250g)',
        },
        nutrients: {
          type: Type.OBJECT,
          properties: {
            calories: { type: Type.NUMBER, description: 'Kalori total dalam kcal' },
            protein: { type: Type.NUMBER, description: 'Protein dalam gram' },
            fat: { type: Type.NUMBER, description: 'Lemak dalam gram' },
            carbs: { type: Type.NUMBER, description: 'Karbohidrat dalam gram' },
            fiber: { type: Type.NUMBER, description: 'Serat dalam gram' },
          },
          required: ['calories', 'protein', 'fat', 'carbs'],
        },
        description: {
          type: Type.STRING,
          description: 'Deskripsi singkat mengenai hidangan',
        },
      },
      required: ['foodName', 'confidence', 'servingSize', 'nutrients'],
    },
  };

  let lastError = null;

  // Coba model satu per satu sesuai anjuran API
  for (const modelName of CANDIDATE_MODELS) {
    try {
      console.log(`📡 Mencoba analisis dengan model: ${modelName}...`);
      const response = await ai.models.generateContent({
        model: modelName,
        contents: [prompt, imagePart],
        config: schemaConfig,
      });

      const parsedData = JSON.parse(response.text);
      console.log(`✅ Berhasil dianalisis dengan model: ${modelName}!`);

      return {
        success: true,
        isMock: false,
        modelUsed: modelName,
        data: parsedData,
      };
    } catch (err) {
      console.warn(`⚠️ Model ${modelName} gagal: ${err.message}`);
      lastError = err;
      // Jika error 404 (model not found), loop akan lanjut mencoba model berikutnya otomatis!
    }
  }

  console.warn('⚠️ Seluruh model Gemini online gagal diakses:', lastError?.message, '- Mengaktifkan fallback demo data.');
  return {
    success: true,
    isMock: true,
    fallbackReason: lastError?.message,
    data: {
      foodName: 'Ketoprak Jakarta',
      confidence: 0.95,
      otherDetectedItems: ['Tahu Goreng', 'Bihun', 'Tauge', 'Kerupuk Bawang', 'Bumbu Kacang'],
      servingSize: '1 porsi (300g)',
      nutrients: {
        calories: 460,
        protein: 16.0,
        fat: 20.5,
        carbs: 55.0,
        fiber: 4.8,
      },
      description: 'Ketoprak khas Jakarta berisi tahu, ketupat/lontong, bihun, tauge, disiram saus kacang gurih dan kerupuk.',
    },
  };
};
