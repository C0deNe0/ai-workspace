// src/services/vectorService.js
import { embedder } from "./aiServices.js";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

/**
 * Simple manual in-memory vector store implementation
 * (avoids all package export issues in new LangChain builds)
 */

const stores = {
  hr: [],
  support: [],
};

export async function ensureStore(name = "support") {
  if (!stores[name]) stores[name] = [];
  return stores[name];
}

export async function addDocumentsToStore({ name = "support", docs = [] }) {
  const store = await ensureStore(name);

  for (const doc of docs) {
    const embedding = await embedder.embedQuery(doc.pageContent);
    store.push({ text: doc.pageContent, embedding });
  }

  console.log(`📚 Added ${docs.length} docs to ${name} store`);
  return store;
}

export async function queryStore(name, query, k = 3) {
  const store = await ensureStore(name);
  if (store.length === 0) return [];

  const queryEmbedding = await embedder.embedQuery(query);

  const scored = store
    .map((item) => ({
      text: item.text,
      score: cosineSimilarity(queryEmbedding, item.embedding),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k);

  return scored.map((r) => ({ pageContent: r.text, score: r.score }));
}

function cosineSimilarity(a, b) {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const normA = Math.sqrt(a.reduce((sum, val) => sum + val ** 2, 0));
  const normB = Math.sqrt(b.reduce((sum, val) => sum + val ** 2, 0));
  return dot / (normA * normB);
}

export async function splitDocs(rawDocs, opts = {}) {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
    ...opts,
  });
  return splitter.splitDocuments(rawDocs);
}
