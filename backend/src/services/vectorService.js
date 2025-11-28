// src/services/vectorService.js
import { embedText } from "./aiServices.js";

/**
 * Simple manual in-memory vector store implementation
 */

const stores = {}; // Stores all document vectors by name (e.g., 'hr')

// --- Utility Functions ---

function cosineSimilarity(a, b) {
  if (a.length !== b.length)
    throw new Error("Vectors must have the same dimension.");

  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const normA = Math.sqrt(a.reduce((sum, val) => sum + val ** 2, 0));
  const normB = Math.sqrt(b.reduce((sum, val) => sum + val ** 2, 0));

  // Avoid division by zero, return 0 for zero vectors
  return normA === 0 || normB === 0 ? 0 : dot / (normA * normB);
}

/**
 * Performs the similarity search on the specified store.
 * @param {string} name - The store name ('hr', 'support', etc.).
 * @param {number[]} queryEmbedding - The embedding of the user's query.
 * @param {number} k - The number of top results to return.
 * @returns {Promise<[{pageContent: string, metadata: any}, number][]>} Top k results in the format expected by hrAgent.js.
 */
async function similaritySearch(name, queryEmbedding, k = 3) {
  const store = stores[name];
  if (!store || store.length === 0) return [];

  const scored = store
    .map((item) => ({
      doc: { pageContent: item.text, metadata: item.metadata }, // Preserve document structure
      score: cosineSimilarity(queryEmbedding, item.embedding),
    }))
    // Sort by score (descending)
    .sort((a, b) => b.score - a.score)
    .slice(0, k);

  // Format for the agent: [[doc, score], [doc, score], ...]
  return scored.map((r) => [r.doc, r.score]);
}

// --- Store Management Functions ---

export async function ensureStore(name = "support") {
  if (!stores[name]) {
    stores[name] = [];
    // FIX: Attach the search method directly to the store object
    // to satisfy the agent's call: `store.similaritySearchVectorWithScore(...)`
    stores[name].similaritySearchVectorWithScore = async (queryVector, k) =>
      await similaritySearch(name, queryVector, k);
    stores[name].memoryVectors = stores[name]; // For tracking length in the agent
  }
  return stores[name];
}

export async function addDocumentsToStore({ name = "support", docs = [] }) {
  const store = await ensureStore(name);

  for (const doc of docs) {
    // FIX: Ensure clean text is passed to the embedding model
    const cleanedText = doc.pageContent
      .replace(/[\r\n]+/g, " ") // Replace multiple newlines/carriage returns with space
      .replace(/\s{2,}/g, " ") // Replace multiple spaces with a single space
      .trim();

    if (cleanedText.length > 0) {
      const embedding = await embedText(cleanedText);
      // Store the original text and metadata
      store.push({ text: cleanedText, embedding, metadata: doc.metadata });
    }
  }

  console.log(`📚 Added ${store.length} docs to ${name} store`);
  return store;
}

/**
 * Simple recursive text splitter — with necessary cleanup and safer chunk size.
 * @param {object[]} rawDocs - Array of documents with pageContent.
 * @param {object} options - Options for chunking.
 * @returns {object[]} Array of chunked documents.
 */
export async function splitDocs(
  rawDocs,
  { chunkSize = 500, chunkOverlap = 50 } = {} // FIX: Use safer, smaller defaults
) {
  const chunks = [];

  for (const doc of rawDocs) {
    // FIX: Pre-clean the entire document content
    const text = doc.pageContent
      .replace(/[\r\n]+/g, " ")
      .replace(/\s{2,}/g, " ");

    let start = 0;

    while (start < text.length) {
      const end = Math.min(start + chunkSize, text.length);
      let chunkText = text.slice(start, end);

      // Ensure chunk text is not empty after trimming
      if (chunkText.trim().length > 0) {
        chunks.push({
          pageContent: chunkText.trim(),
          metadata: { ...doc.metadata, chunk_start: start },
        });
      }

      // Increment start position, ensuring overlap
      start += chunkSize - chunkOverlap;

      // Break loop if the overlap logic causes start to exceed text length
      if (start >= text.length) break;
    }
  }

  return chunks;
}
