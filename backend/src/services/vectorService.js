// src/services/vectorService.js
import { MongoClient } from "mongodb";
import { embedText } from "./aiServices.js";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "hragent";

let client;
let db;

/** Connect to MongoDB and reuse connection */
async function connect() {
  if (!db) {
    if (!uri)
      throw new Error("❌ Missing MONGODB_URI in environment variables");
    client = new MongoClient(uri);
    await client.connect();
    db = client.db(dbName);
    console.log("✅ Connected to MongoDB vector store");
  }
  return db;
}

/** Compute cosine similarity */
function cosineSimilarity(a, b) {
  if (a.length !== b.length)
    throw new Error("Vectors must have the same dimension.");
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const normA = Math.sqrt(a.reduce((sum, val) => sum + val ** 2, 0));
  const normB = Math.sqrt(b.reduce((sum, val) => sum + val ** 2, 0));
  return normA === 0 || normB === 0 ? 0 : dot / (normA * normB);
}

/**
 * Ensure a collection exists for the given store name
 */
export async function ensureStore(name = "support") {
  const database = await connect();
  const collection = database.collection(`vectors_${name}`);

  // Return a store-like proxy object for compatibility
  return {
    name,
    collection,
    async similaritySearchVectorWithScore(queryEmbedding, k = 3) {
      return await similaritySearch(name, queryEmbedding, k);
    },
    // For backward compatibility with .memoryVectors.length
    get memoryVectors() {
      return collection; // dummy reference, not used for actual length
    },
  };
}

/**
 * Add documents and their embeddings to the Mongo vector store
 */
export async function addDocumentsToStore({ name = "support", docs = [] }) {
  const { collection } = await ensureStore(name);

  const inserts = [];
  for (const doc of docs) {
    const cleanedText = doc.pageContent
      .replace(/[\r\n]+/g, " ")
      .replace(/\s{2,}/g, " ")
      .trim();

    if (!cleanedText) continue;

    const embedding = await embedText(cleanedText);
    inserts.push({
      text: cleanedText,
      embedding,
      metadata: doc.metadata || {},
      createdAt: new Date(),
    });
  }

  if (inserts.length > 0) {
    await collection.insertMany(inserts);
    console.log(`📚 Inserted ${inserts.length} docs into ${name} vector store`);
  }

  return inserts;
}

/**
 * Perform similarity search in MongoDB
 */
export async function similaritySearch(name, queryEmbedding, k = 3) {
  const { collection } = await ensureStore(name);
  const docs = await collection.find({}).toArray();
  if (!docs || docs.length === 0) return [];

  const scored = docs
    .map((item) => ({
      doc: { pageContent: item.text, metadata: item.metadata },
      score: cosineSimilarity(queryEmbedding, item.embedding),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k);

  return scored.map((r) => [r.doc, r.score]);
}

/**
 * Chunk text documents for vectorization.
 * Safer defaults: smaller chunks + overlap
 */
export async function splitDocs(
  rawDocs,
  { chunkSize = 500, chunkOverlap = 50 } = {}
) {
  const chunks = [];

  for (const doc of rawDocs) {
    const text = doc.pageContent
      .replace(/[\r\n]+/g, " ")
      .replace(/\s{2,}/g, " ");

    let start = 0;

    while (start < text.length) {
      const end = Math.min(start + chunkSize, text.length);
      const chunkText = text.slice(start, end);

      if (chunkText.trim().length > 0) {
        chunks.push({
          pageContent: chunkText.trim(),
          metadata: { ...doc.metadata, chunk_start: start },
        });
      }

      start += chunkSize - chunkOverlap;
      if (start >= text.length) break;
    }
  }

  return chunks;
}
