const { GoogleGenerativeAI } = require('@google/generative-ai')
const logger = require('../../config/logger')
const { buildPrompt } = require('./promptBuilder')
const ApiError = require('../ApiError')
const { HTTP_STATUS } = require('../../constants/status')

let genAI
if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
}

/**
 * Executes a prompt against the Gemini API using the specified model.
 * 
 * @param {string} intent - The persona/intent (e.g. 'chat')
 * @param {string} input - User input
 * @returns {Promise<string>} The raw text response
 */
const generateResponse = async (intent, input) => {
  if (!genAI) {
    logger.error('GEMINI_API_KEY is not configured.')
    throw new ApiError(HTTP_STATUS.SERVICE_UNAVAILABLE, 'Campus Assistant is currently unavailable.')
  }

  try {
    const prompt = buildPrompt(intent, input)
    // We use gemini-1.5-flash as the default fast and capable model for general text
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    return text
  } catch (error) {
    logger.error(`Campus Assistant Error [Intent: ${intent}]: ${error.message}`)
    throw new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'Failed to process request through Campus Assistant.')
  }
}

/**
 * Conversational Chat with history context
 */
const generateChatResponse = async (history, userInput) => {
  if (!genAI) {
    throw new ApiError(HTTP_STATUS.SERVICE_UNAVAILABLE, 'Campus Assistant is currently unavailable.')
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    const chat = model.startChat({
      history: history.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      })),
      generationConfig: {
        maxOutputTokens: 1000,
      }
    })

    // Prepend system prompt to the immediate user message for strong context adherence
    const prompt = buildPrompt('chat', userInput)
    const result = await chat.sendMessage(prompt)
    const response = await result.response
    return response.text()
  } catch (error) {
    logger.error(`Chat Assistant Error: ${error.message}`)
    throw new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'Chat service failed.')
  }
}

module.exports = {
  generateResponse,
  generateChatResponse
}
