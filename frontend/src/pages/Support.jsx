import { useState } from "react";
import api from "../lib/api.js";
import ChatBubble from "../components/ChatBubble.jsx";
import ChatInput from "../components/ChatInput.jsx";
import Toast from "../components/Toast.jsx";
// import Spinner from "../components/Spinner.jsx";

export default function Support() {
  const [file, setFile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");

  const upload = async () => {
    if (!file) {
      setToast("Please select a PDF file.");
      return;
    }
    const form = new FormData();
    form.append("file", file);
    setLoading(true);
    try {
      await api.post("/support/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setToast("File uploaded successfully!");
    } catch (e) {
      setToast(e.message);
    } finally {
      setLoading(false);
    }
  };

  const ask = async (q) => {
    setMessages((m) => [...m, { role: "user", text: q }]);
    setLoading(true);
    try {
      const res = await api.post("/support/ask", { question: q });
      setMessages((m) => [...m, { role: "assistant", text: res.data.answer }]);
    } catch (e) {
      setToast(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-semibold">💬 Support Assistant</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Upload FAQ docs, then ask questions from them.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button
            onClick={upload}
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? "Processing..." : "Upload"}
          </button>
        </div>
      </div>

      <div className="card p-4 mb-4 min-h-[300px]">
        {messages.length === 0 && (
          <p className="text-sm text-gray-500">
            Start by asking about your uploaded document…
          </p>
        )}
        {messages.map((m, i) => (
          <ChatBubble key={i} role={m.role} text={m.text} />
        ))}
        {loading && "..."}
      </div>

      <ChatInput
        placeholder="Ask something from your document..."
        onSend={ask}
        disabled={loading}
      />
      <Toast message={toast} />
    </div>
  );
}
