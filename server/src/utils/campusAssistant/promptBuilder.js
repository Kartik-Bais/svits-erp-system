const promptTemplates = require('./promptTemplates.json')

/**
 * Builds the final prompt string that gets sent to Gemini.
 * Prepends the strict system persona to ensure the assistant never breaks character.
 * 
 * @param {string} intent - The key from promptTemplates (e.g. 'chat', 'resumeReview')
 * @param {string} userInput - The context or text provided by the user/system
 * @returns {string} The formatted prompt string
 */
const buildPrompt = (intent, userInput) => {
  const systemInstruction = promptTemplates.system
  const specificInstruction = promptTemplates[intent] || ''
  
  // Construct the prompt in a way that enforces the rules strongly
  return `
--- SYSTEM INSTRUCTIONS ---
${systemInstruction}
${specificInstruction}
--- END SYSTEM INSTRUCTIONS ---

--- USER INPUT ---
${userInput}
--- END USER INPUT ---
  `.trim()
}

module.exports = {
  buildPrompt
}
