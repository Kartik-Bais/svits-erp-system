const asyncHandler = require('../utils/asyncHandler')
const ApiResponse = require('../utils/ApiResponse')
const { HTTP_STATUS } = require('../constants/status')

const AssistantConversation = require('../models/AssistantConversation.model')
const { generateResponse, generateChatResponse } = require('../utils/campusAssistant/gemini.service')
const { formatAssistantResponse, parseJsonFromResponse } = require('../utils/campusAssistant/responseFormatter')
const pdfParse = require('pdf-parse')

// Helper function to fetch and parse a document if passed a URL (simplified for text-based processing)
const extractTextFromUrl = async (url) => {
  try {
    const response = await fetch(url)
    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    // Attempt PDF parsing if it's a PDF
    if (url.toLowerCase().endsWith('.pdf') || response.headers.get('content-type') === 'application/pdf') {
      const data = await pdfParse(buffer)
      return data.text
    }
    
    // Otherwise fallback to basic text
    return buffer.toString('utf-8')
  } catch (error) {
    return 'Unable to extract text from the provided URL.'
  }
}

const chat = asyncHandler(async (req, res) => {
  const { message } = req.body
  if (!message) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json(new ApiResponse(false, 'Message is required'))
  }

  let conversation = await AssistantConversation.findOne({ user: req.user._id })
  if (!conversation) {
    conversation = await AssistantConversation.create({ user: req.user._id, messages: [] })
  }

  // Generate response
  const rawResponse = await generateChatResponse(conversation.messages, message)
  const formattedResponse = formatAssistantResponse(rawResponse)

  // Save history
  conversation.messages.push({ role: 'user', content: message })
  conversation.messages.push({ role: 'model', content: rawResponse })
  
  // Keep history manageable
  if (conversation.messages.length > 50) {
    conversation.messages = conversation.messages.slice(-50)
  }
  
  await conversation.save()

  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, 'Chat response', formattedResponse.data))
})

const summarizeDocument = asyncHandler(async (req, res) => {
  const { text, fileUrl } = req.body
  
  let contentToSummarize = text
  if (fileUrl && !text) {
    contentToSummarize = await extractTextFromUrl(fileUrl)
  }

  if (!contentToSummarize) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json(new ApiResponse(false, 'Text or fileUrl is required'))
  }

  const rawResponse = await generateResponse('documentSummarization', contentToSummarize)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, 'Document summarized', formatAssistantResponse(rawResponse).data))
})

const reviewResume = asyncHandler(async (req, res) => {
  const { resumeText, fileUrl } = req.body
  
  let content = resumeText
  if (fileUrl && !resumeText) {
    content = await extractTextFromUrl(fileUrl)
  }

  if (!content) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json(new ApiResponse(false, 'Resume text or fileUrl is required'))
  }

  const rawResponse = await generateResponse('resumeReview', content)
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, 'Resume reviewed', formatAssistantResponse(rawResponse).data))
})

const planStudy = asyncHandler(async (req, res) => {
  const { topicList, daysAvailable } = req.body
  
  const input = `Topics: ${topicList}\nDays Available: ${daysAvailable}`
  const rawResponse = await generateResponse('studyPlanner', input)
  
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, 'Study plan generated', formatAssistantResponse(rawResponse).data))
})

const analyzePerformance = asyncHandler(async (req, res) => {
  // In a real scenario, this would query the DB for the user's attendance/grades
  const { attendancePercentage, recentGrades } = req.body
  
  const input = `Attendance: ${attendancePercentage}%\nGrades: ${recentGrades}`
  const rawResponse = await generateResponse('performanceAnalysis', input)
  
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, 'Performance analyzed', formatAssistantResponse(rawResponse).data))
})

const nlSearch = asyncHandler(async (req, res) => {
  const { query } = req.query
  if (!query) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json(new ApiResponse(false, 'Query is required'))
  }

  // Use the assistant to extract keywords
  const rawResponse = await generateResponse('nlpSearch', query)
  const keywords = rawResponse.split(',').map(k => k.trim()).filter(k => k)

  // Redirect to standard global search using the first extracted keyword
  const searchQuery = keywords.length > 0 ? keywords[0] : query
  
  // We can just call the globalSearch controller logic directly or redirect, 
  // but for simplicity, we'll return the suggested keywords and let frontend call search
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, 'NLP search processed', { suggestedKeywords: keywords, primaryKeyword: searchQuery }))
})

const clearHistory = asyncHandler(async (req, res) => {
  await AssistantConversation.findOneAndDelete({ user: req.user._id })
  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, 'Chat history cleared'))
})

module.exports = {
  chat,
  summarizeDocument,
  reviewResume,
  planStudy,
  analyzePerformance,
  nlSearch,
  clearHistory
}
