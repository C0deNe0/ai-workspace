import { Link, useLocation } from "react-router-dom";
import { Home, Bot, Calendar, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

const NavItem = ({ to, icon: Icon, label }) => {
  const { pathname } = useLocation();
  const active = pathname === to;
  return (
    <Link to={to} className="relative block">
      <div
        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
          active
            ? "bg-brand-600 text-white"
            : "hover:bg-gray-100 dark:hover:bg-gray-800"
        }`}
      >
        <Icon size={18} />
        <span className="text-sm font-medium">{label}</span>
      </div>
      {active && (
        <motion.div
          layoutId="activeNav"
          className="absolute inset-0 rounded-lg border border-white/30"
        />
      )}
    </Link>
  );
};

export default function Sidebar() {
  return (
    <aside className="hidden md:block w-[260px] border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4">
      <div className="space-y-6">
        <div>
          <div className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
            Navigation
          </div>
          <nav className="space-y-1">
            <NavItem to="/" icon={Home} label="Dashboard" />
            <NavItem to="/hr" icon={Bot} label="HR Assistant" />
            {/* <NavItem to="/meeting" icon={Calendar} label="Meeting Scheduler" /> */}
            <NavItem
              to="/support"
              icon={MessageCircle}
              label="Support Assistant"
            />
          </nav>
        </div>
        <div className="card p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Backend URL
          </p>
          <p className="text-xs mt-1 break-all text-gray-500 dark:text-gray-500">
            {import.meta.env.VITE_API_URL || "http://localhost:5000"}
          </p>
        </div>
      </div>
    </aside>
  );
}
