# 🧠 AI Workspace — Smart HR & Support Assistant

An AI-powered workspace that lets users upload company documents (like HR policies or support manuals) and ask natural questions — powered by **Gemini** for reasoning and **Voyage AI** for embeddings.

---

## 🚀 Overview

AI Workspace combines **document understanding**, **semantic search**, and **chat memory** to deliver context-aware answers.  
It extracts information from your uploaded PDFs, embeds them using **Voyage AI**, stores them in **MongoDB**, and uses **Gemini** to generate accurate, human-like responses.

---

## 🧩 Tech Stack

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Node.js + Express
- **Database:** MongoDB (Atlas/local)
- **LLM:** Gemini (Google AI)
- **Embeddings:** Voyage AI
- **Styling:** Tailwind (Dark/Light theme)

---

## ⚙️ Setup

```bash
# Clone repo
git clone https://github.com/yourusername/ai-workspace.git

# Install
cd backend && npm install
cd ../frontend && npm install


```

## .env

PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/
DB_NAME=ai_workspace
GEMINI_API_KEY=your_gemini_key
VOYAGE_API_KEY=your_voyage_key



## run 

# Backend
cd backend && npm run dev

# Frontend
cd ../frontend && npm run dev
