import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { MdSmartToy, MdSend, MdMic, MdAttachFile, MdMoreVert } from 'react-icons/md'
import './AIAssistantPage.css'

const SUGGESTIONS = {
  student: [
    "What is my current attendance in Operating Systems?",
    "When is the deadline for the next assignment?",
    "Show my fee dues for this semester.",
    "Is the library open on Sundays?",
  ],
  faculty: [
    "Who are the top 5 students in my OS class?",
    "Which students have attendance below 75%?",
    "How many leaves do I have left this year?",
    "Schedule an extra class for Saturday.",
  ],
  admin: [
    "Generate a fee collection report for today.",
    "How many new admission applications are pending?",
    "Show the breakdown of faculty by department.",
    "Are there any critical system alerts?",
  ],
  parent: [
    "What is the date for the next PTM?",
    "Has Arjun paid his hostel fees?",
    "Show me the attendance report for this month.",
    "Is there any upcoming holiday?",
  ]
}

export default function AIAssistantPage() {
  const { user } = useAuth()
  const role = user?.role || 'student'
  
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: `Hello ${user?.name || 'there'}! I am SVITS AI, your college assistant. How can I help you today?` }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const handleSend = (text) => {
    if (!text.trim()) return
    
    const userMsg = { id: Date.now(), sender: 'user', text }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    // Mock AI Response Delay
    setTimeout(() => {
      const aiMsg = { 
        id: Date.now() + 1, 
        sender: 'ai', 
        text: getMockResponse(text, role) 
      }
      setMessages(prev => [...prev, aiMsg])
      setIsTyping(false)
    }, 1500)
  }

  const getMockResponse = (query, role) => {
    const q = query.toLowerCase()
    if (role === 'student') {
      if (q.includes('attendance')) return "Your current attendance in Operating Systems is 82%. You have attended 41 out of 50 classes."
      if (q.includes('fee')) return "You have a pending Transport fee of ₹15,000 and a Library fine of ₹150."
    }
    if (role === 'faculty') {
      if (q.includes('below 75') || q.includes('attendance')) return "There are 4 students with attendance below 75% in your OS class: Amit Singh, Rahul Verma, Karan Patel, and Sneha Reddy."
      if (q.includes('leaves')) return "You have 4 Casual Leaves (CL) and 2 Sick Leaves (SL) remaining for this year."
    }
    if (role === 'admin') {
      if (q.includes('fee collection')) return "Today's total fee collection across all departments is ₹1,45,000."
      if (q.includes('admission')) return "There are 42 pending admission applications currently under review."
    }
    if (role === 'parent') {
      if (q.includes('ptm')) return "The next Parent-Teacher Meeting (PTM) is scheduled for 15th August 2026."
      if (q.includes('fee')) return "Arjun's tuition and hostel fees are paid, but there is a pending transport fee of ₹15,000."
    }
    
    return "I found some information regarding that, but I'm still learning! Would you like me to redirect you to the relevant portal page?"
  }

  return (
    <div className="ai-assistant-page animate-fade-in">
      <div className="ai-chat-container card">
        <div className="ai-chat-header">
          <div className="ai-chat-title">
            <div className="ai-avatar"><MdSmartToy size={24} /></div>
            <div>
              <h2>SVITS AI Assistant</h2>
              <p>Powered by Advanced LLMs</p>
            </div>
          </div>
          <button className="icon-btn"><MdMoreVert size={20} /></button>
        </div>

        <div className="ai-chat-body">
          {messages.map(msg => (
            <div key={msg.id} className={`ai-message-wrapper ${msg.sender}`}>
              {msg.sender === 'ai' && <div className="ai-message-avatar"><MdSmartToy size={16} /></div>}
              <div className={`ai-message ${msg.sender}`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="ai-message-wrapper ai">
              <div className="ai-message-avatar"><MdSmartToy size={16} /></div>
              <div className="ai-message ai typing-indicator">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="ai-chat-suggestions">
          {SUGGESTIONS[role]?.map((sug, i) => (
            <button key={i} className="ai-suggestion-chip" onClick={() => handleSend(sug)}>
              {sug}
            </button>
          ))}
        </div>

        <div className="ai-chat-footer">
          <button className="icon-btn"><MdAttachFile size={22} /></button>
          <div className="ai-chat-input-wrapper">
            <input 
              type="text" 
              placeholder={`Ask SVITS AI anything about your ${role} data...`}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend(input)}
            />
            <button className="icon-btn"><MdMic size={22} /></button>
          </div>
          <button 
            className="ai-send-btn" 
            disabled={!input.trim()} 
            onClick={() => handleSend(input)}
          >
            <MdSend size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}
