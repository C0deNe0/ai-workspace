// src/utils/pdfLoader.js
import { readFileSync } from "node:fs";
import path from "node:path";

// ✅ FIX: Use simple default import for pdf-ts (CommonJS module)
import PDFLoader from "pdf-ts";

/**
 * Loads a PDF file and returns its content as a "document" array.
 */
export async function loadPdf(filePath) {
  try {
    // Use readFileSync because pdf-ts expects a Buffer or ArrayBuffer
    const buffer = readFileSync(filePath);

    // Load the PDF using the class/function imported as PDFLoader
    const pdf = await PDFLoader.load(buffer);

    // Extract all text content
    const text = await pdf.extractText();

    // Join page contents into a single text block for subsequent chunking
    const fullText = Array.isArray(text) ? text.join("\n\n") : text;

    return [
      {
        pageContent: fullText.trim(),
        metadata: { source: path.basename(filePath) },
      },
    ];
  } catch (err) {
    console.error(`❌ PDF load error for ${filePath}:`, err.message);
    throw new Error(`Failed to load PDF using pdf-ts: ${err.message}`);
  }
}
