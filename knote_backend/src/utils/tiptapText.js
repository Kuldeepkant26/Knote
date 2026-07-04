// Walks a TipTap JSON document and returns a short plain-text preview.
function extractText(node) {
  if (!node || typeof node !== "object") return "";

  let text = "";
  if (typeof node.text === "string") {
    text += node.text;
  }
  if (Array.isArray(node.content)) {
    for (const child of node.content) {
      text += extractText(child);
      // Add a space between block-ish children so words don't run together.
      if (child.type && child.type !== "text") text += " ";
    }
  }
  return text;
}

function tiptapToPreview(doc, maxLength = 160) {
  const raw = extractText(doc)
    .replace(/\s+/g, " ")
    .trim();
  return raw.length > maxLength ? `${raw.slice(0, maxLength).trim()}…` : raw;
}

module.exports = { tiptapToPreview };
