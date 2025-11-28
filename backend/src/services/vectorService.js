// src/services/vectorService.js
import { embedText } from "./aiServices.js";

/**
 * Simple manual in-memory vector store implementation
 * (no LangChain dependencies)
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
    const embedding = await embedText(doc.pageContent);
    store.push({ text: doc.pageContent, embedding });
  }

  console.log(`📚 Added ${docs.length} docs to ${name} store`);
  return store;
}

export async function queryStore(name, query, k = 3) {
  const store = await ensureStore(name);
  if (store.length === 0) return [];

  const queryEmbedding = await embedText(query);

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

/**
 * Simple recursive text splitter — replaces LangChain’s RecursiveCharacterTextSplitter.
 */
export async function splitDocs(
  rawDocs,
  { chunkSize = 1000, chunkOverlap = 200 } = {}
) {
  const chunks = [];

  for (const doc of rawDocs) {
    const text = doc.pageContent;
    let start = 0;

    while (start < text.length) {
      const end = Math.min(start + chunkSize, text.length);
      const chunkText = text.slice(start, end);
      chunks.push({ pageContent: chunkText, metadata: doc.metadata });
      start += chunkSize - chunkOverlap;
    }
  }

  return chunks;
}
