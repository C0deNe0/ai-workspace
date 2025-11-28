import { useState } from "react";

export default function ChatInput({
  placeholder = "Type your message...",
  onSend,
  disabled,
}) {
  const [value, setValue] = useState("");

  const submit = () => {
    if (!value.trim() || disabled) return;
    onSend?.(value);
    setValue("");
  };

  return (
    <div className="flex gap-2">
      <input
        type="text"
        placeholder={placeholder}
        className="input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        disabled={disabled}
      />
      <button className="btn btn-primary" onClick={submit} disabled={disabled}>
        Send
      </button>
    </div>
  );
}
