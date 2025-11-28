export default function ChatBubble({ role = "user", text = "" }) {
  const mine = role === "user";
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] mb-3 px-4 py-3  rounded-2xl shadow-stone-400 text-sm whitespace-pre-wrap ${
          mine
            ? "bg-brand-green text-white rounded-br-sm"
            : "bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-bl-sm"
        }`}
      >
        {text}
      </div>
    </div>
  );
}
