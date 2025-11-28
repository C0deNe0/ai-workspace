import { useState, useRef, useEffect } from "react";
import api from "../lib/api.js";
import ChatBubble from "../components/ChatBubble.jsx";
import ChatInput from "../components/ChatInput.jsx";
import Toast from "../components/Toast.jsx";

export default function Support() {
  const [file, setFile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false); // For chat
  const [uploading, setUploading] = useState(false); // For upload
  const [toast, setToast] = useState("");

  const chatEndRef = useRef(null);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 📂 Upload PDF
  const upload = async () => {
    if (!file) {
      setToast("Please select a PDF file first.");
      return;
    }
    const form = new FormData();
    form.append("file", file);
    setUploading(true);

    try {
      const res = await api.post("/support/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setToast(res.data.message || "✅ File uploaded and indexed!");
    } catch (err) {
      console.error(err);
      setToast(
        "❌ Upload failed: " + (err.response?.data?.error || err.message)
      );
    } finally {
      setUploading(false);
    }
  };

  // 💬 Ask a Question
  const ask = async (q) => {
    if (!q.trim()) return;
    setMessages((m) => [...m, { role: "user", text: q }]);
    setLoading(true);

    try {
      const res = await api.post("/support/ask", { question: q });
      const answer = res.data.answer || "No answer received.";
      setMessages((m) => [...m, { role: "assistant", text: answer }]);
    } catch (err) {
      console.error(err);
      setToast("Error: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header + Upload */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-semibold">🧩 Support Assistant</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Upload support or FAQ PDFs, then ask context-aware questions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
            disabled={uploading}
          />
          <button
            onClick={upload}
            className="btn btn-primary px-4 py-1 rounded-md"
            disabled={uploading}
          >
            {uploading ? "⏳ Uploading..." : "📤 Upload"}
          </button>
        </div>
      </div>

      {/* File info */}
      {file && (
        <p className="text-xs text-gray-500 mb-2">
          Selected file: <strong>{file.name}</strong>
        </p>
      )}

      {/* Chat Box */}
      <div className="card p-4 mb-4 min-h-[300px] max-h-[500px] overflow-y-auto border rounded-lg bg-white/70 dark:bg-gray-900/40">
        {messages.length === 0 && (
          <p className="text-sm text-gray-500">
            Start by uploading a document, then ask a question…
          </p>
        )}
        {messages.map((m, i) => (
          <ChatBubble key={i} role={m.role} text={m.text} />
        ))}
        {loading && <p className="text-sm text-blue-500">🤖 Thinking...</p>}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <ChatInput
        placeholder="Ask something about your uploaded document..."
        onSend={ask}
        disabled={loading}
      />

      {/* Toast */}
      <Toast message={toast} />
    </div>
  );
}
