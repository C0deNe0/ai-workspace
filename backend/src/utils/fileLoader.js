// src/utils/fileLoader.js
import { readFile } from "node:fs/promises";
import path from "node:path";

/**
 * Loads a text file (e.g., .txt or .md) and returns its content as a document.
 * This is much more stable than parsing PDFs.
 * @param {string} filePath - Absolute path to the file.
 * @returns {Promise<{pageContent: string, metadata: {source: string}}[]>} An array of document objects.
 */
export async function loadFile(filePath) {
    try {
        // Read the file as a string
        const fullText = await readFile(filePath, { encoding: 'utf-8' });

        return [
            {
                pageContent: fullText.trim(),
                metadata: { source: path.basename(filePath) },
            },
        ];
    } catch (err) {
        console.error(`❌ File load error for ${filePath}:`, err.message);
        throw new Error(`Failed to load text file: ${err.message}`);
    }
}