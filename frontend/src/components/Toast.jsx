import { useEffect, useState } from "react";

export default function Toast({ message, showFor = 2500 }) {
  const [open, setOpen] = useState(Boolean(message));

  useEffect(() => {
    if (!message) return;
    setOpen(true);
    const id = setTimeout(() => {
      setOpen(false);
    }, showFor);

    return () => clearTimeout(id);
  }, [message, showFor]);

  if (!open) return null;
  return (
    <div className=" fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
      <div className="px-4 py-2 rounded-lg bg-black/80 text-white text-sm shadow-lg">
        {message}
      </div>
    </div>
  );
}
