import { useState } from 'react'
import { MdCalendarToday, MdVideoCall, MdAccessTime, MdCheckCircle, MdCancel } from 'react-icons/md'
import toast from 'react-hot-toast'
import './ParentPTMPage.css'

const UPCOMING_MEETINGS = [
  { id: 1, teacher: 'Dr. Meena Kumari', subject: 'Operating Systems', date: '2026-07-25', time: '10:30 AM', type: 'Online', status: 'Scheduled' },
  { id: 2, teacher: 'Prof. Ravi', subject: 'Web Technologies', date: '2026-07-28', time: '02:00 PM', type: 'In-person', status: 'Pending' },
]

const TEACHERS = [
  'Dr. Meena Kumari (OS)',
  'Prof. Ravi (Web Tech)',
  'Dr. Ramesh (DSA)',
  'Mrs. Anjali (Maths)'
]

export default function ParentPTMPage() {
  const [meetings, setMeetings] = useState(UPCOMING_MEETINGS)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({
    teacher: TEACHERS[0],
    date: '',
    time: '10:00 AM',
    type: 'Online',
    reason: ''
  })

  const handleRequest = (e) => {
    e.preventDefault()
    if (!form.date) {
      toast.error('Please select a date')
      return
    }

    const newMeeting = {
      id: Date.now(),
      teacher: form.teacher.split(' (')[0],
      subject: form.teacher.split('(')[1].replace(')', ''),
      date: form.date,
      time: form.time,
      type: form.type,
      status: 'Pending'
    }

    setMeetings([...meetings, newMeeting])
    setShowModal(false)
    toast.success('PTM Request sent successfully!')
  }

  const handleCancel = (id) => {
    setMeetings(meetings.filter(m => m.id !== id))
    toast.success('Meeting cancelled')
  }

  return (
    <div className="parent-ptm-page animate-fade-in" id="parent-ptm-page">
      <div className="page-header">
        <div>
          <h1 className="page-title"> PTM Scheduler</h1>
          <p className="page-subtitle">Schedule and manage Parent-Teacher Meetings</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <MdCalendarToday size={18} /> Request Meeting
        </button>
      </div>

      <div className="parent-ptm-grid">
        {meetings.length > 0 ? meetings.map((m, i) => (
          <div key={m.id} className="card parent-ptm-card animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="parent-ptm-card-header">
              <div className="parent-ptm-teacher-info">
                <div className="parent-ptm-avatar">{m.teacher.charAt(0)}</div>
                <div>
                  <h3 className="parent-ptm-teacher-name">{m.teacher}</h3>
                  <p className="parent-ptm-subject">{m.subject}</p>
                </div>
              </div>
              <span className={`badge ${m.status === 'Scheduled' ? 'badge-success' : 'badge-warning'}`}>
                {m.status}
              </span>
            </div>
            
            <div className="parent-ptm-details">
              <div className="parent-ptm-detail-item">
                <MdCalendarToday size={16} /> {new Date(m.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
              </div>
              <div className="parent-ptm-detail-item">
                <MdAccessTime size={16} /> {m.time}
              </div>
              <div className="parent-ptm-detail-item" style={{ color: m.type === 'Online' ? 'var(--primary-600)' : 'var(--accent-orange)' }}>
                {m.type === 'Online' ? <MdVideoCall size={18} /> : <MdCheckCircle size={16} />} {m.type} Meeting
              </div>
            </div>

            <div className="parent-ptm-actions">
              {m.type === 'Online' && m.status === 'Scheduled' && (
                <button className="btn btn-primary btn-sm" style={{ flex: 1 }}>Join Meeting</button>
              )}
              <button className="btn btn-outline-danger btn-sm" onClick={() => handleCancel(m.id)}>
                Cancel
              </button>
            </div>
          </div>
        )) : (
          <div className="parent-ptm-empty card">
            <p>No upcoming meetings scheduled.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="parent-ptm-modal-overlay">
          <div className="parent-ptm-modal card animate-scale-in">
            <div className="parent-ptm-modal-header">
              <h2>Request New Meeting</h2>
              <button className="parent-ptm-modal-close" onClick={() => setShowModal(false)}>
                <MdCancel size={24} />
              </button>
            </div>
            <form className="parent-ptm-form" onSubmit={handleRequest}>
              <div className="form-group">
                <label>Select Teacher</label>
                <select className="form-input" value={form.teacher} onChange={e => setForm({...form, teacher: e.target.value})}>
                  {TEACHERS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              
              <div className="form-row">
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Preferred Date</label>
                  <input type="date" className="form-input" min={new Date().toISOString().split('T')[0]} value={form.date} onChange={e => setForm({...form, date: e.target.value})} required />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Preferred Time</label>
                  <select className="form-input" value={form.time} onChange={e => setForm({...form, time: e.target.value})}>
                    {['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Meeting Type</label>
                <div className="parent-ptm-radio-group">
                  <label className="parent-ptm-radio">
                    <input type="radio" name="type" value="Online" checked={form.type === 'Online'} onChange={e => setForm({...form, type: 'Online'})} />
                    <span>Online (Video Call)</span>
                  </label>
                  <label className="parent-ptm-radio">
                    <input type="radio" name="type" value="In-person" checked={form.type === 'In-person'} onChange={e => setForm({...form, type: 'In-person'})} />
                    <span>In-person (Campus)</span>
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label>Reason / Topic to discuss</label>
                <textarea className="form-input" rows="3" placeholder="Briefly state the reason..." value={form.reason} onChange={e => setForm({...form, reason: e.target.value})}></textarea>
              </div>

              <div className="parent-ptm-form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Send Request</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
