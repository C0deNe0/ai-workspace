// src/agents/hrAgent.js
import { generateAnswer, embedText } from "../services/aiServices.js";
import {
  ensureStore,
  splitDocs,
  addDocumentsToStore,
} from "../services/vectorService.js";
import { loadFile } from "../utils/fileLoader.js";
import path from "node:path";
import fs from "node:fs/promises";

// Configuration
const HR_STORE_NAME = "hr_policy";
const HR_POLICY_PATH = path.join(process.cwd(), "data", "hr", "policy.txt");
let initialized = false;

// --- Prompt Templates for Clean Code ---

const RAG_SYSTEM_PROMPT = `
You are a highly professional and strict HR Assistant. Your sole purpose is to answer employee questions about company policies, benefits, and rules.
Answer the following question STRICTLY using the provided context. 
If the context does not contain the answer, you MUST state, "I apologize, but I don't have enough information in the company policy documents to answer that question." Do not guess or use outside knowledge.
Your response must be clear, polite, and based only on the facts provided in the context.

Context:
---
{context}
---

Question:
{question}
`;

const FALLBACK_SYSTEM_PROMPT = `
You are a helpful and polite HR Assistant. Since you do not have access to the official policy documents, provide a general, helpful, and professional answer regarding the topic, reminding the user that they should always verify with the official company handbook or HR team for the definitive answer.
Your tone must be encouraging and professional.

Question:
{question}
`;

export async function initHRAgent() {
  if (initialized) return;

  try {
    const stat = await fs.stat(HR_POLICY_PATH).catch(() => null);

    if (stat) {
      console.log("⏳ Found HR policy PDF. Loading and embedding...");
      const rawDocs = await loadFile(HR_POLICY_PATH);
      const chunks = await splitDocs(rawDocs);

      // Check if chunks are created before adding to store
      if (chunks.length > 0) {
        await addDocumentsToStore({ name: HR_STORE_NAME, docs: chunks });
        console.log(
          `📚 HR policy loaded into vector store with ${chunks.length} chunks.`
        );
      } else {
        console.log(
          "⚠️ HR policy was loaded but resulted in 0 usable text chunks."
        );
      }
    } else {
      console.log(
        "ℹ️ No HR policy PDF found. HR Agent will answer without RAG (Fallback Mode)."
      );
    }
  } catch (err) {
    console.warn("⚠️ HR Preload Error:", err.message);
  }

  initialized = true;
}

/**
 * Handle HR questions: uses RAG if data available, otherwise falls back to direct LLM.
 * @param {string} question - The user's question.
 * @returns {Promise<string>} The AI-generated answer.
 */
export async function askHR(question) {
  await initHRAgent();
  const store = await ensureStore(HR_STORE_NAME);
  const docCount = store.memoryVectors?.length || 0;

  // --- FALLBACK MODE (NO RAG) ---
  if (docCount === 0) {
    console.log("💬 Fallback Mode: Answering directly via Gemini (No RAG).");
    const prompt = FALLBACK_SYSTEM_PROMPT.replace("{question}", question);
    return await generateAnswer(prompt);
  }

  // --- RAG MODE ---
  console.log(`📖 RAG Mode: Searching ${docCount} document chunks for answer.`);

  // 1. Generate query embedding
  const queryEmb = await embedText(question);

  // 2. Retrieve top 3 most relevant documents
  const results = await store.similaritySearchVectorWithScore(queryEmb, 3);
  const context = results.map(([doc]) => doc.pageContent).join("\n---\n");

  // 3. Construct RAG prompt
  const prompt = RAG_SYSTEM_PROMPT.replace("{context}", context).replace(
    "{question}",
    question
  );

  // 4. Generate answer based on context
  return await generateAnswer(prompt);
}
