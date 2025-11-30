import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Home,
  Users,
  MessageSquare,
  Settings,
  HelpCircle,
  ChevronRight,
} from "lucide-react";

const Card = ({ to, title, desc, emoji }) => (
  <motion.div
    whileHover={{ scale: 1.05, y: -4 }}
    whileTap={{ scale: 0.98 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    <Link
      to={to}
      className="block rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 border border-gray-700 shadow-lg hover:shadow-2xl transition relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />
      <div className="flex items-center gap-3 mb-3">
        {/* <motion.span
          className="text-3xl"
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          {emoji}
        </motion.span> */}
        <h3 className="text-2xl font-bold   text-white">{title}</h3>
      </div>
      <p className="text-md text-gray-400">{desc}</p>
      <div className="mt-3 flex items-center text-sm text-red-400 group-hover:translate-x-1 transition">
        <ChevronRight className="w-4 h-4 mr-1" /> Explore
      </div>
    </Link>
  </motion.div>
);

export default function LandingPage() {
  return (
    <div className="min-h-screen flex bg-[#0a0a0a] text-white">
      {/* Sidebar */}
      {/* <aside className="w-64 bg-gradient-to-b from-gray-900 to-black border-r border-gray-800 flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-2xl font-bold text-red-500 tracking-tight">
            AI Workspace
          </h1>
        </div>
        <nav className="flex-1 p-4 space-y-3">
          <SidebarItem icon={<Home />} text="Home" active />
          <SidebarItem icon={<Users />} text="Agents" />
          <SidebarItem icon={<MessageSquare />} text="Messages" />
          <SidebarItem icon={<Settings />} text="Settings" />
          <SidebarItem icon={<HelpCircle />} text="Help" />
        </nav>
        <div className="p-4 border-t border-gray-800 text-xs text-gray-500">
          © 2025 AI Workspace
        </div>
      </aside> */}

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {/* Hero */}
        <section className="py-20 text-center bg-linear-to-b from-gray-950 via-black to-gray-900">
          <motion.h1
            className="text-5xl font-bold mb-4 bg-linear-to-r from-red-400 via-pink-400 to-purple-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Welcome to Your Smart Workspace 👋
          </motion.h1>
          <motion.p
            className="text-gray-400 text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Manage HR queries, and get instant support, all powered by AI agents
            designed to simplify your work.
          </motion.p>
        </section>

        {/* --- HOW IT WORKS DEMO --- */}
        <section className="relative py-24 bg-black/70 backdrop-blur-lg border-y border-gray-800 overflow-hidden">
          <h2 className="text-center text-4xl font-bold mb-12">
            See it in Action 🚀
          </h2>

          <div className="max-w-5xl mx-auto relative z-10 grid lg:grid-cols-2 gap-12 px-6">
            {/* Left - Animated Screen */}
            <motion.div
              className="relative rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 p-8 shadow-xl backdrop-blur-sm overflow-hidden"
              whileHover={{ scale: 1.02 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-red-600/20 via-transparent to-transparent rounded-3xl"
                animate={{ opacity: [0.3, 0.5, 0.3] }}
                transition={{ repeat: Infinity, duration: 5 }}
              />

              <div className="flex flex-col space-y-4">
                <ChatBubble
                  sender="You"
                  text="How many casual leaves do we get?"
                />
                <ChatBubble
                  sender="AI Assistant"
                  text="Employees are entitled to 12 casual leaves per year."
                  isBot
                />
                <ChatBubble
                  sender="You"
                  text="Cool! Can you show the HR policy?"
                />
                <ChatBubble
                  sender="AI Assistant"
                  text="Sure! Opening policy.txt 🗂️"
                  isBot
                />
              </div>
            </motion.div>

            {/* Right - Explanation */}
            <div className="flex flex-col justify-center space-y-6">
              <h3 className="text-2xl font-semibold">
                Ask. Automate. Accelerate.
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Our AI assistants connect directly with your data and policies.
                Simply ask a question and get instant, contextual responses.
                Whether it’s HR, or Support, the AI handles it all.
              </p>
              <ul className="text-gray-300 space-y-3">
                <li>✅ Context-aware responses from your documents</li>
                <li>✅ Real-time knowledge updates</li>
                <li>✅ Integrated with Slack, Email, and Dashboards</li>
              </ul>
              <Link
                to="/demo"
                className="inline-block bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-3 rounded-full transition transform hover:scale-105"
              >
                Try Demo →
              </Link>
            </div>
          </div>

          {/* Floating bubbles */}
          <motion.div
            className="absolute top-10 left-10 w-20 h-20 bg-red-500/10 rounded-full blur-3xl"
            animate={{ y: [0, 20, 0] }}
            transition={{ repeat: Infinity, duration: 6 }}
          />
          <motion.div
            className="absolute bottom-10 right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"
            animate={{ y: [0, -20, 0] }}
            transition={{ repeat: Infinity, duration: 7 }}
          />
        </section>

        {/* Feature Cards */}
        <section className="max-w-6xl mx-auto  px-6 py-16">
          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-2 gap-8"
            initial="hidden"
            whileInView="visible"
            variants={{
              visible: {
                transition: { staggerChildren: 0.15 },
              },
            }}
          >
            <Card
              to="/hr"
              title="HR Assistant"
              emoji=""
              desc="Ask about leave, benefits, and company policies."
            />
            <Card
              to="/support"
              title="Support Assistant"
              emoji=""
              desc="Get instant answers to FAQs and product queries."
            />
            {/* <Card
              to="/meeting"
              title="Meeting Scheduler"
              emoji="🗓️"
              desc="Schedule and manage meetings effortlessly."
            /> */}
          </motion.div>
        </section>

        {/* About Section */}
        <section className="py-20 bg-gradient-to-t from-gray-950 via-black to-gray-900 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Empower Your Workflow with AI
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-10">
            Our AI assistants automate routine tasks, save time, and help your
            team focus on what really matters. Integrate seamlessly with your
            tools, from Google Calendar to internal HR systems.
          </p>
          <Link
            to="/get-started"
            className="inline-block bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-3 rounded-full transition transform hover:scale-105"
          >
            Get Started
          </Link>
        </section>

        {/* Footer */}
        <footer className="py-10 bg-black border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>Built with ❤️ using React, Tailwind, and Framer Motion.</p>
        </footer>
      </main>
    </div>
  );
}

function SidebarItem({ icon, text, active }) {
  return (
    <button
      className={`flex items-center gap-3 w-full p-3 rounded-lg transition ${
        active
          ? "bg-red-600 text-white"
          : "text-gray-400 hover:text-white hover:bg-gray-800"
      }`}
    >
      {icon}
      <span className="text-sm">{text}</span>
    </button>
  );
}

function ChatBubble({ sender, text, isBot }) {
  return (
    <motion.div
      className={`max-w-[80%] p-3 rounded-2xl ${
        isBot
          ? "bg-gray-800 text-gray-200 self-start"
          : "bg-red-600/70 text-white self-end"
      }`}
      initial={{ opacity: 0, x: isBot ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <p className="text-sm">{text}</p>
      <span className="block text-xs text-gray-400 mt-1">{sender}</span>
    </motion.div>
  );
}
