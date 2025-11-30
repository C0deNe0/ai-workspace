import { useState } from "react";
import api from "../lib/api.js";
import ChatBubble from "../components/ChatBubble.jsx";
import ChatInput from "../components/ChatInput.jsx";
import Toast from "../components/Toast.jsx";

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
    <div className="max-w-4xl mx-auto py-10 px-4 transition-colors duration-500">
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">
          <span className="text-red-600"> HR</span>
           Assistant
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Ask about leave, benefits, or company policies, your AI HR assistant
          is ready to help.
        </p>
      </div>

      {/* Chat Area */}
      <div className="relative rounded-3xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gradient-to-br dark:from-gray-950 dark:to-gray-900 backdrop-blur-lg p-6 shadow-lg hover:shadow-red-500/10 transition-all duration-500 overflow-hidden">
        {/* red gradient glow */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-red-600/5 via-transparent to-transparent opacity-80 rounded-3xl"></div>

        {messages.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 text-sm py-10">
             Start a conversation with HR below👇
          </div>
        )}

        <div className="space-y-5 relative z-10">
          {messages.map((m, i) => (
            <ChatBubble key={i} role={m.role} text={m.text} />
          ))}

          {loading && (
            <div className="flex justify-start items-center space-x-2 text-gray-500 dark:text-gray-400">
              <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm">HR Assistant is typing...</p>
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="mt-8">
        <ChatInput placeholder="Ask HR..." onSend={send} disabled={loading} />
      </div>

      {/* Toast Notification */}
      <Toast message={toast} />
    </div>
  );
}
