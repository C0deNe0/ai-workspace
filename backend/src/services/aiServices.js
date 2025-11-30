// src/services/aiServices.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import { VoyageAIClient, VoyageAIError } from "voyageai";
import "dotenv/config";

/**
 * =========================================
 *  INITIALIZATION
 * =========================================
 */
if (!process.env.GOOGLE_API_KEY) {
  console.error(" Missing GOOGLE_API_KEY in .env file.");
  process.exit(1);
}

if (!process.env.VOYAGE_API_KEY) {
  console.error(" Missing VOYAGE_API_KEY in .env file.");
  process.exit(1);
}


const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const llm = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

const voyage = new VoyageAIClient({
  apiKey: process.env.VOYAGE_API_KEY,
});

console.log("✅ Google Gemini connected (gemini-2.5-pro)");
console.log("✅ VoyageAIClient connected for embeddings");

/**
 * =========================================
 *  TEXT GENERATION (Gemini)
 * =========================================
 */
export async function generateAnswer(prompt) {
  try {
    if (!prompt?.trim()) throw new Error("Prompt is empty.");
    const result = await llm.generateContent(prompt);
    const text = result?.response?.text()?.trim();
    return text || "⚠️ No response generated. Please try again.";
  } catch (err) {
    console.error("❌ Gemini LLM Error:", err.message);
    throw new Error("AI model failed to generate an answer.");
  }
}

/**
 * =========================================
 *  EMBEDDING GENERATION (VoyageAI SDK)
 * =========================================
 */
export async function embedText(text) {
  const cleanText = (text || "")
    .replace(/[\r\n]+/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();

  if (!cleanText) throw new Error("Empty text provided for embedding.");

  try {
    const response = await voyage.embed({
      input: cleanText,
      model: "voyage-large-2-instruct", 
      maxRetries: 2,
      timeoutInSeconds: 60,
    });

    if (!response?.data?.[0]?.embedding) {
      throw new Error("Invalid embedding response from VoyageAI.");
    }

    return response.data[0].embedding;
  } catch (err) {
    if (err instanceof VoyageAIError) {
      console.error("❌ VoyageAI API Error:", err.statusCode, err.message);
    } else {
      console.error("❌ VoyageAI Error:", err.message);
    }
    throw new Error("Failed to generate embedding via VoyageAI.");
  }
}
