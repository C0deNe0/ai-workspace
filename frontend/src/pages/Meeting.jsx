import { useState } from "react";
import api from "../lib/api.js";
import Toast from "../components/Toast.jsx";
// import Spinner from "../components/Spinner.jsx";

export default function Meeting() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [participants, setParticipants] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [toast, setToast] = useState("");

  const schedule = async () => {
    if (!title || !date || !start || !end) {
      setToast("Please fill all fields.");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/meeting/schedule", {
        summary: title,
        startTime: `${date}T${start}`,
        endTime: `${date}T${end}`,
        attendees: participants
          .split(",")
          .map((e) => e.trim())
          .filter(Boolean),
      });
      setResult(res.data.message || "Meeting Scheduled!");
    } catch (e) {
      setToast(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-3">🗓️ Meeting Scheduler</h2>

      <div className="card p-5 space-y-4">
        <div>
          <label className="label">Title</label>
          <input
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Weekly Sync"
          />
        </div>

        <div className="grid sm:grid-cols-3 gap-3">
          <div>
            <label className="label">Date</label>
            <input
              type="date"
              className="input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div>
            <label className="label">Start Time</label>
            <input
              type="time"
              className="input"
              value={start}
              onChange={(e) => setStart(e.target.value)}
            />
          </div>
          <div>
            <label className="label">End Time</label>
            <input
              type="time"
              className="input"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="label">Participants (emails)</label>
          <input
            className="input"
            value={participants}
            onChange={(e) => setParticipants(e.target.value)}
            placeholder="user1@company.com, user2@company.com"
          />
        </div>

        <button
          className="btn btn-primary"
          onClick={schedule}
          disabled={loading}
        >
          {loading ? "Scheduling..." : "Schedule Meeting"}
        </button>

        {loading && "..."}
      </div>

      {result && (
        <div className="card p-4 mt-4">
          <p className="text-sm">{result}</p>
        </div>
      )}
      <Toast message={toast} />
    </div>
  );
}
