// src/services/aiServices.js
import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GOOGLE_API_KEY) {
  console.error("❌ GOOGLE_API_KEY missing!");
  process.exit(1);
}

// ✅ Use new stable endpoint
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

console.log("✅ Google Generative AI connected to model: gemini-2.5pro");

export async function generateAnswer(prompt) {
  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return text || "⚠️ No text generated.";
  } catch (err) {
    console.error("❌ Gemini API Error:", err.message);
    throw err;
  }
}

export const llm = {
  invoke: async (messages) => {
    const prompt = messages
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join("\n");
    const content = await generateAnswer(prompt);
    return { content };
  },
};

// Simple embedding stub (for in-memory store)
export const embedText = async (text) => {
  const words = text.split(/\s+/);
  const vector = new Array(512).fill(0);
  for (let i = 0; i < words.length; i++) {
    const index = i % 512;
    vector[index] += words[i].length * 0.01;
  }
  return vector;
};
