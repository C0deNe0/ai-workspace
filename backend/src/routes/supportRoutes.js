import express from "express";
import multer from "multer";
import path from "node:path";
import fs from "node:fs/promises";
import { loadPdf } from "../utils/pdfLoader.js";
import { uploadSupportDocs, askSupport } from "../agents/supportAgent.js";

const router = express.Router();
const upload = multer({ dest: path.join(process.cwd(), "uploads") });

router.post("/upload", upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file provided" });

    const filePath = req.file.path;
    const docs = await loadPdf(filePath);
    const result = await uploadSupportDocs(docs);

    // cleanup tmp
    await fs.unlink(filePath).catch(() => {});
    res.json({ message: "Uploaded & indexed", ...result });
  } catch (e) {
    next(e);
  }
});

router.post("/ask", async (req, res, next) => {
  try {
    const { question } = req.body;
    if (!question)
      return res.status(400).json({ error: "question is required" });
    const answer = await askSupport(question);
    res.json({ answer });
  } catch (e) {
    next(e);
  }
});

export default router;
