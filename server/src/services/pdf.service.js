/**
 * pdf.service.js
 * Handles all PDF parsing logic in one dedicated service.
 * pdf-parse is lazy-loaded here so it doesn't crash
 * Jest/Node environments that lack browser globals (DOMMatrix, etc.).
 */

/**
 * Parse a PDF buffer and return its extracted text.
 * @param {Buffer} buffer - The raw PDF file buffer
 * @returns {Promise<string>} Extracted text content
 */
const parsePdfBuffer = async (buffer) => {
  // Lazy-load pdf-parse so it is never required at module-import time.
  // This prevents jest from crashing when it loads the app (pdfjs-dist
  // expects browser globals like DOMMatrix which don't exist in Node).
  const pdfParse = require('pdf-parse')
  const data = await pdfParse(buffer)
  return data.text
}

/**
 * Fetch a remote URL and extract its text content.
 * If the resource is a PDF it is parsed with pdf-parse,
 * otherwise the raw body is returned as UTF-8 text.
 *
 * @param {string} url - Remote URL to fetch
 * @returns {Promise<string>} Extracted text content
 */
const extractTextFromUrl = async (url) => {
  try {
    const response = await fetch(url)
    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const contentType = response.headers.get('content-type') || ''
    const isPdf =
      url.toLowerCase().endsWith('.pdf') ||
      contentType.includes('application/pdf')

    if (isPdf) {
      return await parsePdfBuffer(buffer)
    }

    return buffer.toString('utf-8')
  } catch {
    return 'Unable to extract text from the provided URL.'
  }
}

module.exports = { parsePdfBuffer, extractTextFromUrl }
