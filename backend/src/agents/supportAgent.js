import {
  ensureStore,
  splitDocs,
  addDocumentsToStore,
  queryStore,
} from "../services/vectorService.js";
import { generateAnswer } from "../services/aiServices.js";

/**
 * Upload and process support documentation (PDF or text).
 */
export async function uploadSupportDocs(langchainDocs) {
  const chunks = await splitDocs(langchainDocs);
  await addDocumentsToStore({ name: "support", docs: chunks });
  console.log(`📄 Added ${chunks.length} chunks to support store`);
  return { added: chunks.length };
}


export async function askSupport(question) {
  const store = await ensureStore("support");
  const count = store.length;

  // ✅ If no docs available, fallback to a direct LLM answer
  if (count === 0) {
    const fallback = await generateAnswer(`
You are a friendly support assistant. The user asked:
"${question}"

Since no documentation is available, give a generic answer and suggest uploading docs if relevant.
    `);
    return fallback;
  }

  // ✅ Retrieve top-matching chunks
  const results = await queryStore("support", question, 4);
  const context = results.map((r) => r.pageContent).join("\n---\n");

  // ✅ Generate an answer using the context
  const response = await generateAnswer(`
You are a helpful customer support assistant.
Answer the user's question *only* using the provided context.
If context is insufficient, say "I don't have enough information."
  
Question:
${question}

Context:
${context}
  `);

  return response;
}
