// src/db/mongo.js
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "hragent";

let client;
let db;

export async function getDb() {
  if (db) return db;
  if (!uri) throw new Error("MONGODB_URI is not set");
  client = new MongoClient(uri, { ignoreUndefined: true });
  await client.connect();
  db = client.db(dbName);

  // Helpful indexes
  await db.collection("messages").createIndex({ sessionId: 1, createdAt: -1 });

  return db;
}

export async function closeDb() {
  if (client) await client.close();
  client = null;
  db = null;
}
