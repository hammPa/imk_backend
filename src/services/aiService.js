// src/services/aiService.js
import { GoogleGenAI } from "@google/genai";

import dotenv from 'dotenv'

dotenv.config({ path: '/.env' })

const API_KEYS = [
  process.env.GEMINI_KEY_1,
  process.env.GEMINI_KEY_2,
].filter(Boolean);

let keyIndex = 0;

function getClient() {
  return new GoogleGenAI({ apiKey: API_KEYS[keyIndex] });
}

function rotateKey() {
  keyIndex = (keyIndex + 1) % API_KEYS.length;
}

async function generateWithFailover(prompt, model) {
  for (let i = 0; i < API_KEYS.length; i++) {
    try {
      const ai = getClient();

      const res = await ai.models.generateContent({
        model,
        contents: prompt,
      });

      return res.candidates?.[0]?.content?.parts?.[0]?.text || "";

    } catch (err) {
      if (err.status === 429 || err.code === 429) {
        console.warn(`API Key ${keyIndex + 1} limit. Switching key...`);
        rotateKey();
        await new Promise(r => setTimeout(r, 300));
        continue;
      }

      throw err;
    }
  }

  throw new Error("Semua API key habis limit.");
}


// ------------------ 1) EXPLAIN CHART ------------------
export async function explainChart({ keyword, geo, range, growth, chart }) {
  const prompt = `
Jelaskan grafik Google Trends berikut secara singkat.

Keyword: ${keyword}
Region: ${geo}
Range: ${range}
Growth: ${growth}
Data: ${JSON.stringify(chart)}

Jelaskan:
- arah tren
- titik lonjakan/penurunan
- prediksi singkat

Instruksi Output:
- Jawab sangat singkat, maksimum 3 kalimat.
- Gunakan bahasa Indonesia.
- Jangan gunakan emoticon atau emoji.
- Jangan gunakan simbol dekoratif apa pun.
- Jangan gunakan bullet list.
- Jangan gunakan markdown, bold, italic, atau karakter penekanan.
- Jangan gunakan tanda strip dekoratif atau pemisah.
- Hanya keluarkan teks biasa.
`;


  return await generateWithFailover(prompt, "gemini-1.5-flash");
}

// ------------------ 2) SENTIMENT ------------------
export async function sentimentAnalysis(chart) {
  const prompt = `
Analisis sentimen data Google Trends berikut:
${JSON.stringify(chart)}

Berikan:
- klasifikasi (Positive, Negative, atau Neutral)
- alasan singkat

Instruksi Output:
- Jawab sangat singkat, maksimum 2 kalimat.
- Gunakan bahasa Indonesia.
- Jangan gunakan emoticon atau emoji.
- Jangan gunakan simbol dekoratif apa pun.
- Jangan gunakan bullet list.
- Jangan gunakan markdown, bold, italic, atau karakter penekanan.
- Jangan gunakan tanda strip dekoratif atau pemisah.
- Hanya keluarkan teks biasa.
`;

  return await generateWithFailover(prompt, "gemini-1.5-flash");
}