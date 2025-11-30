// src/services/memoryService.js
import { getDb } from "../db/mongo.js";

/**
 * Save a chat message in MongoDB (user or assistant)
 */
export async function saveMessage(sessionId, role, text) {
  const db = await getDb();
  await db.collection("conversations").insertOne({
    sessionId,
    role, // "user" or "assistant"
    text,
    createdAt: new Date(),
  });
}

/**
 * Retrieve the recent messages for a given session
 */
export async function getRecentMessages(sessionId, limit = 6) {
  const db = await getDb();
  const messages = await db
    .collection("conversations")
    .find({ sessionId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();

  // Return oldest → newest
  return messages.reverse();
}

/**
 * Optional: clear session memory
 */
export async function clearConversation(sessionId) {
  const db = await getDb();
  await db.collection("conversations").deleteMany({ sessionId });
}
