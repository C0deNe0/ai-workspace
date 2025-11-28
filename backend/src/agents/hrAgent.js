import { llm } from "../services/aiServices.js";
import {
  ensureStore,
  splitDocs,
  addDocumentsToStore,
} from "../services/vectorService.js";
import { loadPdf } from "../utils/pdfLoader.js";
import path from "node:path";
import fs from "node:fs/promises";
// import { RetrievalQAChain } from "langchain/chains";

// Optional: preload a sample HR PDF if you put one at /data/hr/policy.pdf
const HR_POLICY_PATH = path.join(process.cwd(), "data", "hr", "policy.pdf");
let initialized = false;

export async function initHRAgent() {
  if (initialized) return;
  try {
    const stat = await fs.stat(HR_POLICY_PATH).catch(() => null);
    if (stat) {
      const raw = await loadPdf(HR_POLICY_PATH);
      const chunks = await splitDocs(raw);
      await addDocumentsToStore({ name: "hr", docs: chunks });
      console.log("📚 HR policy loaded into vector store.");
    } else {
      console.log("ℹ️ No HR policy PDF found, HR will answer without RAG.");
    }
  } catch (e) {
    console.warn("HR preload error:", e.message);
  }
  initialized = true;
}

export async function askHR(question) {
  await initHRAgent();
  const store = await ensureStore("hr");

  // If store empty, fallback to direct LLM
  const count = store.memoryVectors?.length || 0;
  if (!count) {
    const resp = await llm.invoke([
      {
        role: "system",
        content:
          "You are a helpful HR assistant for leave, benefits and policy queries.",
      },
      { role: "user", content: question },
    ]);
    return resp.content;
  }

  // RAG: retrieve context then answer
  // Minimal manual retrieval (top 3)
  const queryEmb = await store.embeddings.embedQuery(question);
  const results = await store.similaritySearchVectorWithScore(queryEmb, 3);
  const context = results.map(([doc]) => doc.pageContent).join("\n---\n");

  const prompt = [
    {
      role: "system",
      content:
        "You are an HR assistant. Answer strictly using the provided context. If missing, say you don't have enough info.",
    },
    { role: "user", content: `Question: ${question}\n\nContext:\n${context}` },
  ];

  const resp = await llm.invoke(prompt);
  return resp.content;
}
