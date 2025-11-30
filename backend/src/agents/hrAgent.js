import { generateAnswer, embedText } from "../services/aiServices.js";
import {
  ensureStore,
  splitDocs,
  addDocumentsToStore,
} from "../services/vectorService.js";
import { loadFile } from "../utils/fileLoader.js";
import fs from "node:fs/promises";
import path from "node:path";
import { getDb } from "../db/mongo.js";
import { saveMessage, getRecentMessages } from "../services/memoryService.js";

const HR_STORE_NAME = "hr_policy";
const HR_POLICY_PATH = path.join(process.cwd(), "data", "hr", "policy.txt");

let initialized = false;

const RAG_SYSTEM_PROMPT = `
You are a highly professional and strict HR Assistant. Your sole purpose is to answer employee questions about company policies, benefits, and rules.
Answer strictly using the provided context. 
If the context does not contain the answer, say:
"I apologize, but I don't have enough information in the company policy documents to answer that question."
Be factual, polite, and precise.

Context:
---
{context}
---

Question:
{question}
`;

const FALLBACK_SYSTEM_PROMPT = `
You are a helpful and polite HR Assistant. Since you do not have access to the official policy documents, provide a general, helpful, and professional answer regarding the topic, reminding the user that they should always verify with the official HR team.

Question:
{question}
`;

/** Initialize HR policy vectors — only if not already in Mongo */
export async function initHRAgent() {
  if (initialized) return;

  try {
    const db = await getDb();
    const collection = db.collection(`vectors_${HR_STORE_NAME}`);
    const count = await collection.countDocuments();

    if (count > 0) {
      console.log(`✅ HR policy already embedded (${count} chunks in DB).`);
    } else {
      const stat = await fs.stat(HR_POLICY_PATH).catch(() => null);
      if (!stat) {
        console.warn("ℹ️ No HR policy file found. Running in fallback mode.");
        initialized = true;
        return;
      }

      console.log("⏳ Loading HR policy file for embedding...");
      const docs = await loadFile(HR_POLICY_PATH);
      const text = docs.map((d) => d.pageContent).join("\n\n");
      const chunks = await splitDocs([
        { pageContent: text, metadata: { source: "policy.txt" } },
      ]);

      if (chunks.length > 0) {
        await addDocumentsToStore({ name: HR_STORE_NAME, docs: chunks });
        console.log(
          `📚 HR policy embedded into vector store (${chunks.length} chunks).`
        );
      } else {
        console.warn("⚠️ HR policy produced 0 chunks. Check file content.");
      }
    }
  } catch (err) {
    console.error("⚠️ HR preload error:", err.message);
  }

  initialized = true;
}

/** Handle user questions (RAG + conversation memory) */
export async function askHR(question, sessionId = "default") {
  await initHRAgent();

  const history = await getRecentMessages(sessionId);
  const historyText = history
    .map((m) => `${m.role.toUpperCase()}: ${m.text}`)
    .join("\n");

  const store = await ensureStore(HR_STORE_NAME);
  const db = await getDb();
  const collection = db.collection(`vectors_${HR_STORE_NAME}`);
  const docCount = await collection.countDocuments();

  let answer;

  if (docCount === 0) {
    console.log("💬 Fallback Mode (No RAG data).");
    const prompt = `
Previous conversation:
${historyText || "(none)"}

${FALLBACK_SYSTEM_PROMPT.replace("{question}", question)}
`;
    answer = await generateAnswer(prompt);
  } else {
    console.log(`📖 RAG Mode: Searching ${docCount} chunks for context...`);
    const queryEmb = await embedText(question);
    const results = await store.similaritySearchVectorWithScore(queryEmb, 3);
    const context = results.map(([doc]) => doc.pageContent).join("\n---\n");

    const prompt = `
Previous conversation:
${historyText || "(none)"}

${RAG_SYSTEM_PROMPT.replace("{context}", context).replace(
  "{question}",
  question
)}
`;
    answer = await generateAnswer(prompt);
  }

  // 💾 Save conversation to Mongo memory
  await saveMessage(sessionId, "user", question);
  await saveMessage(sessionId, "assistant", answer);

  return answer;
}
