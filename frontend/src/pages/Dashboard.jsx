import { Link } from "react-router-dom";

const Card = ({ to, title, desc, emoji }) => (
  <Link
    to={to}
    className="card p-6 hover:shadow-lg transition border border-gray-100 dark:border-gray-800"
  >
    <div className="flex items-center gap-3 mb-3">
      <span className="text-2xl">{emoji}</span>
      <h3 className="text-lg font-semibold">{title}</h3>
    </div>
    <p className="text-sm text-gray-600 dark:text-gray-400">{desc}</p>
  </Link>
);

export default function Dashboard() {
  return (
    <div className="max-w-6xl mx-auto text-white">
      <h1 className="text-3xl font-bold mb-2">Welcome 👋</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Choose an agent to get started.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card
          to="/hr"
          title="HR Assistant"
          emoji="🧍"
          desc="Ask about leave, benefits and company policies."
        />
        <Card
          to="/meeting"
          title="Meeting Scheduler"
          emoji="🗓️"
          desc="Schedule or manage meetings via Google Calendar."
        />
        <Card
          to="/support"
          title="Support Assistant"
          emoji="💬"
          desc="Answer FAQs or product queries from docs."
        />
      </div>
    </div>
  );
}
