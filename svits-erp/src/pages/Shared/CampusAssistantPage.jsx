import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { MdSupportAgent, MdSend, MdMoreVert } from 'react-icons/md'
import './CampusAssistantPage.css'

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
  ],
}

// Mock response engine — swap this for a real API call when backend is ready
function getResponse(query, role) {
  const q = query.toLowerCase()

  if (role === 'student') {
    if (q.includes('attendance')) return "Your current attendance in Operating Systems is 82%. You have attended 41 out of 50 classes."
    if (q.includes('fee')) return "You have a pending Transport fee of ₹15,000 and a Library fine of ₹150."
  }

  if (role === 'faculty') {
    if (q.includes('below 75') || q.includes('attendance')) return "4 students are below 75% in your OS class: Amit Singh, Rahul Verma, Karan Patel, and Sneha Reddy."
    if (q.includes('leaves')) return "You have 4 Casual Leaves and 2 Sick Leaves remaining this year."
  }

  if (role === 'admin') {
    if (q.includes('fee collection')) return "Today's total fee collection across all departments is ₹1,45,000."
    if (q.includes('admission')) return "There are 42 pending admission applications currently under review."
  }

  if (role === 'parent') {
    if (q.includes('ptm')) return "The next Parent-Teacher Meeting is scheduled for 15th August 2026."
    if (q.includes('fee')) return "Arjun's tuition and hostel fees are paid. There is a pending transport fee of ₹15,000."
  }

  return "I can help with that. Would you like me to redirect you to the relevant section?"
}

export default function CampusAssistantPage() {
  const { user } = useAuth()
  const role = user?.role || 'student'

  const [messages, setMessages] = useState([
    { id: 1, sender: 'assistant', text: `Hello ${user?.name || 'there'}! How can I help you today?` }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const send = (text) => {
    if (!text.trim()) return

    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text }])
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { id: Date.now() + 1, sender: 'assistant', text: getResponse(text, role) }
      ])
      setIsTyping(false)
    }, 1200)
  }

  return (
    <div className="ca-page animate-fade-in">
      <div className="ca-page-container card">
        <div className="ca-page-header">
          <div className="ca-page-title">
            <div className="ca-page-avatar">
              <MdSupportAgent size={22} />
            </div>
            <div>
              <h2>Campus Assistant</h2>
              <p>Ask anything about your academic data</p>
            </div>
          </div>
          <button className="icon-btn" aria-label="More options">
            <MdMoreVert size={20} />
          </button>
        </div>

        <div className="ca-page-body">
          {messages.map(msg => (
            <div key={msg.id} className={`ca-page-message-row ca-page-message-row--${msg.sender}`}>
              {msg.sender === 'assistant' && (
                <div className="ca-page-message-icon">
                  <MdSupportAgent size={15} />
                </div>
              )}
              <div className={`ca-page-bubble ca-page-bubble--${msg.sender}`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="ca-page-message-row ca-page-message-row--assistant">
              <div className="ca-page-message-icon">
                <MdSupportAgent size={15} />
              </div>
              <div className="ca-page-bubble ca-page-bubble--assistant ca-page-typing">
                <span /><span /><span />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="ca-page-chips">
          {SUGGESTIONS[role]?.map((s, i) => (
            <button key={i} className="ca-page-chip" onClick={() => send(s)}>
              {s}
            </button>
          ))}
        </div>

        <div className="ca-page-footer">
          <input
            type="text"
            placeholder={`Ask a question about your ${role} data…`}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send(input)}
            aria-label="Message"
          />
          <button
            className="ca-page-send-btn"
            disabled={!input.trim()}
            onClick={() => send(input)}
            aria-label="Send"
          >
            <MdSend size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
