// src/services/aiServices.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config"; // Ensure dotenv is loaded if using environment variables

if (!process.env.GOOGLE_API_KEY) {
  console.error(
    "❌ GOOGLE_API_KEY missing! Set GOOGLE_API_KEY in your .env file."
  );
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// 1. Model for complex reasoning (RAG context understanding)
const LLM_MODEL = "gemini-2.5-pro";
const llm = genAI.getGenerativeModel({ model: LLM_MODEL });

// 2. Dedicated model for generating embeddings (for RAG search)
const EMBEDDING_MODEL = "embedding-001";
const embeddingModel = genAI.getGenerativeModel({ model: EMBEDDING_MODEL });

console.log(
  `✅ Google Generative AI connected to LLM: ${LLM_MODEL} and Embedder: ${EMBEDDING_MODEL}`
);

/**
 * Generates an answer using the main LLM.
 * @param {string} prompt - The prompt or instruction for the LLM.
 * @returns {Promise<string>} The generated text response.
 */
export async function generateAnswer(prompt) {
  try {
    const result = await llm.generateContent(prompt);
    const text = result.response.text().trim();
    return text || "⚠️ No text generated. Please try rephrasing your question.";
  } catch (err) {
    console.error("❌ Gemini API Error:", err.message);
    throw new Error("Failed to generate response from AI model.");
  }
}

/**
 * Generates an embedding (vector) for a given piece of text.
 * @param {string} text - The text to embed.
 * @returns {Promise<number[]>} The embedding vector.
 */
export const embedText = async (text) => {
  try {
    const response = await embeddingModel.embedContent({ content: text });
    return response.embedding.values;
  } catch (err) {
    console.error("❌ Gemini Embedding API Error:", err.message);
    throw new Error("Failed to generate embedding for RAG.");
  }
};

// ... (Your llm and embedText exports for compatibility, if needed)
// For a cleaner agent, the above exported functions are sufficient.
