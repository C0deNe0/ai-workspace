import {
  ChatGoogleGenerativeAI,
  GoogleGenerativeAIEmbeddings,
} from "@langchain/google-genai";

import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.GOOGLE_API_KEY;
if (!API_KEY) {
  console.log("api key is not set");
}

export const llm = new ChatGoogleGenerativeAI({
  apiKey: API_KEY,
  model: "gemini-1.5-flash",
  temperature: 0.2,
});

export const embedder = new GoogleGenerativeAIEmbeddings({
  apiKey: API_KEY,
  model: "text-embedding-004",
});
