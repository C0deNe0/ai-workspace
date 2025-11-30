import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

export default function ChatBubble({ role = "user", text = "" }) {
  const mine = role === "user";

  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] mb-3 px-4 py-3 rounded-2xl text-sm shadow-stone-400 ${
          mine
            ? "bg-brand-green text-white rounded-br-sm"
            : "bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-bl-sm text-gray-800 dark:text-gray-100"
        }`}
      >
        {mine ? (
          <p className="whitespace-pre-wrap">{text}</p>
        ) : (
          <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  return (
                    <code
                      className={`${
                        inline
                          ? "bg-gray-200 dark:bg-gray-800 rounded px-1"
                          : "block bg-gray-100 dark:bg-gray-800 p-2 rounded-md text-sm"
                      }`}
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
              }}
            >
              {text}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
