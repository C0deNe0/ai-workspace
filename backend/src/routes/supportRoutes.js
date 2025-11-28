import express from "express";
import multer from "multer";
import path from "node:path";
import fs from "node:fs/promises";
import { loadPdf } from "../utils/pdfLoader.js";
import { uploadSupportDocs, askSupport } from "../agents/supportAgent.js";

const router = express.Router();

// create uploads dir if missing
const uploadDir = path.join(process.cwd(), "uploads");
const upload = multer({ dest: uploadDir });

// Ensure upload dir exists before start
try {
  await fs.mkdir(uploadDir, { recursive: true });
} catch {}

// ============= 📄 Upload Route =============
router.post("/upload", upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }

    const filePath = req.file.path;
    const docs = await loadPdf(filePath);

    if (!docs || docs.length === 0) {
      await fs.unlink(filePath).catch(() => {});
      return res.status(400).json({ error: "Could not parse PDF content" });
    }

    const result = await uploadSupportDocs(docs);

    // cleanup tmp file
    await fs.unlink(filePath).catch(() => {});

    res.json({
      success: true,
      message: "✅ PDF uploaded and indexed successfully",
      added: result.added || 0,
    });
  } catch (err) {
    console.error("Upload error:", err);
    next(err);
  }
});

// ============= 💬 Ask Support Route =============
router.post("/ask", async (req, res, next) => {
  try {
    const { question } = req.body;
    if (!question?.trim()) {
      return res.status(400).json({ error: "question is required" });
    }

    const answer = await askSupport(question);
    res.json({ answer });
  } catch (err) {
    console.error("Support error:", err);
    next(err);
  }
});

export default router;
