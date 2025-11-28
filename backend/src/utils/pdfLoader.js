import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

// returns LangChain Document[]
export async function loadPdf(filePath) {
  const loader = new PDFLoader(filePath, { parsedItemSeparator: "\n" });
  return loader.load();
}
