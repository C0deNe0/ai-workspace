import express from "express";

const router = express.Router();

router.post("/schedule", async (req, res, next) => {
  try {
    const { summary, startTime, endTime, attendees } = req.body;
    const result = await scheduleMetting({
      summary,
      startTime,
      endTime,
      attendees,
    });

    if (!result.ok) return res.status(400).json(result);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
