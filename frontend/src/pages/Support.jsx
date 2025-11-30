import { useState, useRef, useEffect } from "react";
import api from "../lib/api.js";
import ChatBubble from "../components/ChatBubble.jsx";
import ChatInput from "../components/ChatInput.jsx";
import Toast from "../components/Toast.jsx";

export default function Support() {
  const [file, setFile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false); // Chat loading
  const [uploading, setUploading] = useState(false); // Upload loading
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
    <div className="max-w-4xl mx-auto py-10 px-4 transition-colors duration-500">
      {/* Header + Upload */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-4xl font-bold mb-1 text-gray-900 dark:text-white">
            <span className="text-red-600"> Support</span> Assistant
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Upload your documentation or FAQs, then ask smart, context-aware
            questions.
          </p>
        </div>

        <div className="flex items-center border rounded-2xl p-3 border-red-300 gap-3">
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
            disabled={uploading}
            className="text-xs file:mr-2 file:px-3 file:py-1 file:rounded-md file:border-0 file:bg-red-600 file:text-white hover:file:bg-red-700 transition cursor-pointer"
          />
          <button
            onClick={upload}
            disabled={uploading}
            className="px-4 py-2 rounded-md font-medium bg-red-600 hover:bg-red-700 text-white transition disabled:opacity-60"
          >
            {uploading ? "⏳ Uploading..." : " Upload"}
          </button>
        </div>
      </div>

      {/* File Info */}
      {file && (
        <p className="text-xs text-gray-500 mb-3">
          Selected file:{" "}
          <strong className="text-red-600 dark:text-red-400">
            {file.name}
          </strong>
        </p>
      )}

      {/* Chat Box */}
      <div className="relative rounded-3xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-900 backdrop-blur-lg p-6 shadow-lg hover:shadow-red-500/10 transition-all duration-500 overflow-hidden min-h-[320px] max-h-[500px] overflow-y-auto">
        {/* red gradient overlay */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-red-600/5 via-transparent to-transparent opacity-80 rounded-3xl"></div>

        {messages.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 text-sm py-10">
            🚀 Start by uploading a PDF, then ask a question!
          </div>
        )}

        <div className="space-y-5 relative z-10">
          {messages.map((m, i) => (
            <ChatBubble key={i} role={m.role} text={m.text} />
          ))}

          {loading && (
            <div className="flex justify-start items-center space-x-2 text-gray-500 dark:text-gray-400">
              <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm">AI Assistant is thinking...</p>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="mt-8">
        <ChatInput
          placeholder="Ask something about your uploaded document..."
          onSend={ask}
          disabled={loading}
        />
      </div>

      {/* Toast */}
      <Toast message={toast} />
    </div>
  );
}
