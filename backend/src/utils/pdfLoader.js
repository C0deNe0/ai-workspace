// src/utils/pdfLoader.js
import fs from "node:fs/promises";
import { createRequire } from "module";

// ✅ Use createRequire to import a CommonJS module in ESM
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

/**
 * Load a PDF and return it as an array of "documents"
 */
export async function loadPdf(filePath) {
  try {
    const buffer = await fs.readFile(filePath);
    const data = await pdfParse(buffer);

    return [
      {
        pageContent: data.text,
        metadata: { source: filePath },
      },
    ];
  } catch (err) {
    console.error("❌ PDF load error:", err.message);
    return [];
  }
}
