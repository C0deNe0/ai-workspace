import { generateAnswer, embedText } from "../services/aiServices.js";
import {
  ensureStore,
  splitDocs,
  addDocumentsToStore,
} from "../services/vectorService.js";
import { loadPdf } from "../utils/pdfLoader.js";
import path from "node:path";
import fs from "node:fs/promises";

const HR_POLICY_PATH = path.join(process.cwd(), "data", "hr", "policy.pdf");
let initialized = false;

/**
 * Initialize HR Agent: loads PDF if found and embeds into in-memory vector store.
 */
export async function initHRAgent() {
  if (initialized) return;

  try {
    const stat = await fs.stat(HR_POLICY_PATH).catch(() => null);
    if (stat) {
      const rawDocs = await loadPdf(HR_POLICY_PATH);
      const chunks = await splitDocs(rawDocs);
      await addDocumentsToStore({ name: "hr", docs: chunks });
      console.log("📚 HR policy loaded into vector store.");
    } else {
      console.log("ℹ️ No HR policy PDF found, HR will answer without RAG.");
    }
  } catch (err) {
    console.warn("⚠️ HR preload error:", err.message);
  }

  initialized = true;
}

/**
 * Handle HR questions: uses RAG if data available, otherwise fallback to direct LLM.
 */
export async function askHR(question) {
  await initHRAgent();
  const store = await ensureStore("hr");

  const count = store.memoryVectors?.length || 0;

  // ✅ Fallback: Direct LLM call if no docs
  if (!count) {
    console.log("💬 No HR docs found — answering directly via Gemini...");
    const answer = await generateAnswer(
      `You are an HR assistant for company policies, benefits, and leave rules. 
      Answer the following clearly and helpfully:\n\n${question}`
    );
    return answer;
  }

  // ✅ RAG: Retrieve from memory + respond using context
  console.log("📖 Using RAG retrieval for HR answer...");

  const queryEmb = await embedText(question);
  const results = await store.similaritySearchVectorWithScore(queryEmb, 3);
  const context = results.map(([doc]) => doc.pageContent).join("\n---\n");

  const prompt = `
You are an HR assistant. Answer the following question strictly using the provided context.
If the context does not contain enough information, say "I don't have enough policy details."
  
Question:
${question}

Context:
${context}
  `;

  const answer = await generateAnswer(prompt);
  return answer;
}
