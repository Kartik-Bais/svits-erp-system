/**
 * Formats the raw text response from Gemini into a structured JSON format 
 * suitable for the frontend.
 * @param {string} rawText 
 * @returns {object}
 */
const formatAssistantResponse = (rawText) => {
  // If the prompt strictly asks for JSON, we could try parsing it.
  // Otherwise, we just return a structured object.
  // The frontend can render this cleanly.
  
  // Basic markdown cleanup if needed (e.g., removing wrapping ```json)
  let text = rawText.trim()
  
  // Strip Markdown code blocks if the API returned them by accident for a plain text response
  if (text.startsWith('```') && text.endsWith('```')) {
    const lines = text.split('\n')
    text = lines.slice(1, -1).join('\n').trim()
  }

  return {
    success: true,
    data: {
      message: text,
      timestamp: new Date().toISOString()
    }
  }
}

/**
 * Specifically parses JSON out of a response if the prompt asked for JSON.
 * @param {string} rawText 
 * @returns {object|null}
 */
const parseJsonFromResponse = (rawText) => {
  try {
    let text = rawText.trim()
    if (text.startsWith('```json')) {
      text = text.replace(/^```json/, '').replace(/```$/, '').trim()
    }
    return JSON.parse(text)
  } catch (error) {
    return null
  }
}

module.exports = {
  formatAssistantResponse,
  parseJsonFromResponse
}
