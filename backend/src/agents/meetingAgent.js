import { llm } from "../services/aiServices.js";

/**
 * Free + deployable: We won't call Google Calendar here.
 * Instead, we parse details and return a confirmation summary.
 * (Later you can add OAuth2 + Calendar API.)
 */
export async function scheduleMeeting({
  summary,
  startTime,
  endTime,
  attendees = [],
}) {
  // quick validation
  if (!summary || !startTime || !endTime) {
    return { ok: false, message: "Missing summary/startTime/endTime" };
  }

  // Normalize attendees
  const emails = (attendees || []).filter(Boolean);

  // Optionally, ask LLM to produce a nice confirmation string
  const resp = await llm.invoke([
    { role: "system", content: "You format friendly meeting confirmations." },
    {
      role: "user",
      content: `Create a short confirmation:\nTitle: ${summary}\nStart: ${startTime}\nEnd: ${endTime}\nAttendees: ${
        emails.join(", ") || "none"
      }`,
    },
  ]);

  return { ok: true, message: resp.content };
}
