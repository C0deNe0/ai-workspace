import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function Topbar() {
  const [dark, setDark] = useState(() => {
    localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <header className="sticky top-0 z-20 bg-white/70 dark:bg-gray-900/70 backdrop-blur border-b border-gray-200 dark:border-gray-800">
      <div className="mx-auto w-full max-w-7xl px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-semibold"> AI workspace</h1>
        <button className="btn btn-ghost" onClick={() => setDark((v) => !v)}>
          {dark ? <Sun size={18} /> : <Moon size={18} />}
          <span className="hidden sm:inline">{dark ? "light" : "dark"}</span>
        </button>
      </div>
    </header>
  );
}
