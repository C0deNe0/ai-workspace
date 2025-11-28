import { generateAnswer } from "../services/aiServices.js";

/**
 * Free & deployable meeting agent.
 * Instead of integrating Google Calendar, it just confirms scheduling info.
 */
export async function scheduleMeeting({
  summary,
  startTime,
  endTime,
  attendees = [],
}) {
  if (!summary || !startTime || !endTime) {
    return { ok: false, message: "Missing summary/startTime/endTime" };
  }

  const attendeeList = attendees.filter(Boolean).join(", ") || "None";

  const message = await generateAnswer(`
You are an assistant that formats friendly meeting confirmations.
Given the following details, create a concise confirmation message:

Title: ${summary}
Start: ${startTime}
End: ${endTime}
Attendees: ${attendeeList}

Keep it short and professional.
  `);

  return { ok: true, message };
}
