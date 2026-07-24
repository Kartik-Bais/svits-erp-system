import { useState } from 'react'
import { MdChat, MdClose, MdArrowForward } from 'react-icons/md'
import './AIAssistant.css'

export default function AIAssistant() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState([
    { role: 'ai', text: 'Hi! I am your UniVerse AI Assistant. How can I help you today?' }
  ])
  const [chatInput, setChatInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const handleChatSubmit = (e) => {
    e.preventDefault()
    if (!chatInput.trim()) return
    const userMessage = chatInput
    setChatMessages(prev => [...prev, { role: 'user', text: userMessage }])
    setChatInput('')
    setIsTyping(true)
    
    setTimeout(() => {
      setIsTyping(false)
      let aiResponse = "I can definitely help with that. Please contact our administration for more details."
      if (userMessage.toLowerCase().includes('fee') || userMessage.toLowerCase().includes('cost')) {
        aiResponse = "The fee structure varies by program. You can check the Finance section for your detailed ledger."
      } else if (userMessage.toLowerCase().includes('attendance') || userMessage.toLowerCase().includes('absent')) {
        aiResponse = "You can view your detailed attendance records in the Attendance tab. Make sure to maintain above 75%!"
      } else if (userMessage.toLowerCase().includes('grade') || userMessage.toLowerCase().includes('cgpa')) {
        aiResponse = "You can predict your SGPA/CGPA using the new calculator tool in the Results tab."
      }
      setChatMessages(prev => [...prev, { role: 'ai', text: aiResponse }])
    }, 1200)
  }

  return (
    <div className="ai-chat-widget">
      {isChatOpen && (
        <div className="ai-chat-window animate-fade-in">
          <div className="ai-chat-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <MdChat size={20} />
              <h4 style={{ margin: 0, fontWeight: 700 }}>UniVerse AI</h4>
            </div>
            <button onClick={() => setIsChatOpen(false)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', padding: 0 }}>
              <MdClose size={20} />
            </button>
          </div>
          <div className="ai-chat-body">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`ai-chat-bubble ${msg.role}`}>
                {msg.text}
              </div>
            ))}
            {isTyping && (
              <div className="ai-chat-bubble ai typing">
                <span>.</span><span>.</span><span>.</span>
              </div>
            )}
          </div>
          <form className="ai-chat-input-area" onSubmit={handleChatSubmit}>
            <input 
              type="text" 
              placeholder="Type your question..." 
              value={chatInput} 
              onChange={(e) => setChatInput(e.target.value)}
            />
            <button type="submit" disabled={!chatInput.trim()}>
              <MdArrowForward size={18} />
            </button>
          </form>
        </div>
      )}
      <button 
        className={`ai-chat-fab ${isChatOpen ? 'open' : ''}`}
        onClick={() => setIsChatOpen(!isChatOpen)}
      >
        {isChatOpen ? <MdClose size={28} /> : <MdChat size={28} />}
      </button>
    </div>
  )
}
