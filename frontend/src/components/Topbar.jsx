import { Moon, Sun } from "lucide-react";

export default function Topbar({ dark, setDark }) {
  return (
    <header className="sticky top-0 z-20 bg-white/70 dark:bg-gray-900/70 backdrop-blur border-b border-gray-200 dark:border-gray-800 transition-colors duration-500">
      <div className="mx-auto w-full max-w-7xl px-4 py-3 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          AI Workspace
        </h1>

        {/* <button
          onClick={() => setDark((v) => !v)}
          className="relative flex items-center gap-2 px-3 py-2 rounded-lg transition bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          {dark ? (
            <Sun
              size={18}
              className="text-yellow-400 transition-transform duration-300"
            />
          ) : (
            <Moon
              size={18}
              className="text-blue-400 transition-transform duration-300"
            />
          )}
          <span className="hidden sm:inline text-sm font-medium capitalize">
            {dark ? "Light" : "Dark"}
          </span>
        </button> */}
      </div>
    </header>
  );
}
