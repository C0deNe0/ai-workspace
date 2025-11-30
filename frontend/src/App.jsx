import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import { Route, Routes, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import HR from "./pages/HR.jsx";
import Meeting from "./pages/Meeting.jsx";
import Support from "./pages/Support.jsx";

export default function App() {
  // ✅ FIXED: Properly return from the arrow function
  const [dark, setDark] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) return savedTheme === "dark";
    // if user has never chosen a theme, respect system preference
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // ✅ Only add/remove dark class based on current state
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <div className="app-shell min-h-screen bg-white dark:bg-[#0a0a0a] text-black dark:text-white transition-colors duration-500">
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex flex-1 flex-col">
          <Topbar dark={dark} setDark={setDark} />
          <div className="flex-1 p-6 bg-gray-50 dark:bg-gray-950 transition-colors duration-500">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/hr" element={<HR />} />
              <Route path="/meeting" element={<Meeting />} />
              <Route path="/support" element={<Support />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}
