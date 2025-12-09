// src/services/aiService.js
import { GoogleGenAI } from "@google/genai";

import dotenv from 'dotenv'

dotenv.config({ path: '/.env' })

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

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


  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL,
    contents: prompt,
  });

  return response.candidates?.[0]?.content?.parts?.[0]?.text || "";
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

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: prompt,
  });

  return response.candidates?.[0]?.content?.parts?.[0]?.text || "";
}