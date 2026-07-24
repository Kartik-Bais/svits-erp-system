import { useState, useRef, useEffect } from 'react'
import { MdChat, MdClose, MdArrowForward } from 'react-icons/md'
import './CampusAssistant.css'

const RESPONSES = {
  fee: "The fee structure varies by program. Check the Finance section for your detailed ledger.",
  attendance: "Your attendance records are available in the Attendance tab. Maintain above 75% to avoid shortage.",
  grade: "Use the CGPA calculator in the Results tab to predict your SGPA and CGPA.",
  default: "I can help with that. Please contact administration or check the relevant portal section.",
}

function getResponse(message) {
  const q = message.toLowerCase()
  if (q.includes('fee') || q.includes('cost')) return RESPONSES.fee
  if (q.includes('attendance') || q.includes('absent')) return RESPONSES.attendance
  if (q.includes('grade') || q.includes('cgpa')) return RESPONSES.grade
  return RESPONSES.default
}

export default function CampusAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hi! How can I help you today?' }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const bodyRef = useRef(null)

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight
    }
  }, [messages, isTyping])

  const handleSubmit = (e) => {
    e.preventDefault()
    const text = input.trim()
    if (!text) return

    setMessages(prev => [...prev, { role: 'user', text }])
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', text: getResponse(text) }])
      setIsTyping(false)
    }, 1000)
  }

  return (
    <div className="campus-assistant">
      {isOpen && (
        <div className="ca-window animate-fade-in">
          <div className="ca-header">
            <div className="ca-header-info">
              <MdChat size={18} />
              <span>Campus Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="ca-close-btn" aria-label="Close">
              <MdClose size={18} />
            </button>
          </div>

          <div className="ca-body" ref={bodyRef}>
            {messages.map((msg, i) => (
              <div key={i} className={`ca-bubble ca-bubble--${msg.role}`}>
                {msg.text}
              </div>
            ))}
            {isTyping && (
              <div className="ca-bubble ca-bubble--assistant ca-typing">
                <span /><span /><span />
              </div>
            )}
          </div>

          <form className="ca-input-row" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Ask a question..."
              value={input}
              onChange={e => setInput(e.target.value)}
              aria-label="Message"
            />
            <button type="submit" disabled={!input.trim()} aria-label="Send">
              <MdArrowForward size={18} />
            </button>
          </form>
        </div>
      )}

      <button
        className={`ca-fab ${isOpen ? 'ca-fab--open' : ''}`}
        onClick={() => setIsOpen(o => !o)}
        aria-label={isOpen ? 'Close assistant' : 'Open Campus Assistant'}
      >
        {isOpen ? <MdClose size={26} /> : <MdChat size={26} />}
      </button>
    </div>
  )
}
