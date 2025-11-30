import { useState } from "react";
import api from "../lib/api.js";
import ChatBubble from "../components/ChatBubble.jsx";
import ChatInput from "../components/ChatInput.jsx";
import Toast from "../components/Toast.jsx";
// import Spinner from "../components/Spinner.jsx";

export default function HR() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");

  const send = async (q) => {
    setLoading(true);
    setMessages((m) => [...m, { role: "user", text: q }]);
    try {
      const res = await api.post("/hr/ask", { question: q });
      setMessages((m) => [...m, { role: "assistant", text: res.data.answer }]);
    } catch (e) {
      setToast(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-2">🧍 HR Assistant</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Ask about leave, benefits, or HR policies.
      </p>

      <div className="card p-4 mb-4 min-h-[300px]">
        {messages.length === 0 && (
          <p className="text-sm text-gray-500">Start a conversation with HR…</p>
        )}
        {messages.map((m, i) => (
          <ChatBubble key={i} role={m.role} text={m.text} />
        ))}
        {loading && (
          <div className="flex justify-start items-center space-x-2">
            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-gray-500">HR Assistant is typing...</p>
          </div>
        )}
      </div>

      <ChatInput placeholder="Ask HR..." onSend={send} disabled={loading} />
      <Toast message={toast} />
    </div>
  );
}
