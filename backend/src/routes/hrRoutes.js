import express from "express";
import { askHR } from "../agents/hrAgent.js";

const router = express.Router();

router.post("/ask", async (req, res, next) => {
  try {
    const { question } = req.body;
    if (!question)
      return res.status(400).json({ error: "question is required" });
    const answer = await askHR(question);
    res.json({ answer });
  } catch (e) {
    next(e);
  }
});

export default router;
