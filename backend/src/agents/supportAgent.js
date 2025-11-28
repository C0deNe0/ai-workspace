import {
  ensureStore,
  splitDocs,
  addDocumentsToStore,
} from "../services/vectorService.js";
import { llm } from "../services/aiServices.js";

export async function uploadSupportDocs(langchainDocs) {
  const chunks = await splitDocs(langchainDocs);
  await addDocumentsToStore({ name: "support", docs: chunks });
  return { added: chunks.length };
}

export async function askSupport(question) {
  const store = await ensureStore("support");
  const count = store.memoryVectors?.length || 0;

  if (!count) {
    const fallback = await llm.invoke([
      {
        role: "system",
        content:
          "You are a support assistant. If no documentation context is available, answer generically and suggest uploading docs.",
      },
      { role: "user", content: question },
    ]);
    return fallback.content;
  }

  const queryEmb = await store.embeddings.embedQuery(question);
  const results = await store.similaritySearchVectorWithScore(queryEmb, 4);
  const context = results.map(([doc]) => doc.pageContent).join("\n---\n");

  const resp = await llm.invoke([
    {
      role: "system",
      content:
        "Answer from context. If insufficient, say so briefly and avoid hallucination.",
    },
    { role: "user", content: `Question: ${question}\n\nContext:\n${context}` },
  ]);
  return resp.content;
}
