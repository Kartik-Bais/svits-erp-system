import { useState, useEffect } from 'react'
import { MdChevronLeft, MdChevronRight, MdAccessTime, MdLocationOn, MdPerson } from 'react-icons/md'
import './TimetablePage.css'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const TIME_SLOTS = ['9:00', '10:00', '11:00', '12:00', '1:00', '2:00', '3:00', '4:00']

const SCHEDULE = {
  Monday: [
    { time: '9:00',  subject: 'Data Structures',      code: 'CS301', faculty: 'Dr. Rao',    room: 'Lab-3',  type: 'Lab',     span: 2, color: '#8b5cf6' },
    { time: '11:00', subject: 'Operating Systems',     code: 'CS302', faculty: 'Prof. Meena',room: 'A-201',  type: 'Lecture', span: 1, color: '#4F8EF7' },
    { time: '12:00', subject: 'Lunch Break',           code: '',      faculty: '',            room: '',       type: 'Break',   span: 1, color: '#e2e8f0' },
    { time: '1:00',  subject: 'DBMS',                  code: 'CS303', faculty: 'Dr. Anand',  room: 'A-302',  type: 'Lecture', span: 1, color: '#06b6d4' },
    { time: '2:00',  subject: 'Web Technologies Lab',  code: 'CS304', faculty: 'Prof. Ravi', room: 'Lab-1',  type: 'Lab',     span: 2, color: '#10b981' },
  ],
  Tuesday: [
    { time: '9:00',  subject: 'Operating Systems',     code: 'CS302', faculty: 'Prof. Meena',room: 'A-201',  type: 'Lecture', span: 1, color: '#4F8EF7' },
    { time: '10:00', subject: 'Soft Skills',            code: 'HS301', faculty: 'Ms. Lakshmi',room: 'A-101',  type: 'Lecture', span: 1, color: '#f59e0b' },
    { time: '11:00', subject: 'DBMS Lab',               code: 'CS303', faculty: 'Dr. Anand',  room: 'Lab-2',  type: 'Lab',     span: 2, color: '#06b6d4' },
    { time: '12:00', subject: 'Lunch Break',            code: '',      faculty: '',            room: '',       type: 'Break',   span: 1, color: '#e2e8f0' },
    { time: '1:00',  subject: 'Data Structures',        code: 'CS301', faculty: 'Dr. Rao',    room: 'A-302',  type: 'Lecture', span: 1, color: '#8b5cf6' },
    { time: '2:00',  subject: 'Mini Project',           code: 'CS399', faculty: 'Dr. Rao',    room: 'Lab-3',  type: 'Project', span: 2, color: '#ec4899' },
  ],
  Wednesday: [
    { time: '9:00',  subject: 'Web Technologies',       code: 'CS304', faculty: 'Prof. Ravi', room: 'A-201',  type: 'Lecture', span: 1, color: '#10b981' },
    { time: '10:00', subject: 'Operating Systems Lab',  code: 'CS302', faculty: 'Prof. Meena',room: 'Lab-4',  type: 'Lab',     span: 2, color: '#4F8EF7' },
    { time: '12:00', subject: 'Lunch Break',            code: '',      faculty: '',            room: '',       type: 'Break',   span: 1, color: '#e2e8f0' },
    { time: '1:00',  subject: 'Soft Skills',            code: 'HS301', faculty: 'Ms. Lakshmi',room: 'A-101',  type: 'Lecture', span: 1, color: '#f59e0b' },
    { time: '2:00',  subject: 'DBMS',                  code: 'CS303', faculty: 'Dr. Anand',  room: 'A-302',  type: 'Lecture', span: 1, color: '#06b6d4' },
  ],
  Thursday: [
    { time: '9:00',  subject: 'Data Structures Lab',    code: 'CS301', faculty: 'Dr. Rao',    room: 'Lab-3',  type: 'Lab',     span: 2, color: '#8b5cf6' },
    { time: '11:00', subject: 'Web Technologies',       code: 'CS304', faculty: 'Prof. Ravi', room: 'A-201',  type: 'Lecture', span: 1, color: '#10b981' },
    { time: '12:00', subject: 'Lunch Break',            code: '',      faculty: '',            room: '',       type: 'Break',   span: 1, color: '#e2e8f0' },
    { time: '1:00',  subject: 'Operating Systems',      code: 'CS302', faculty: 'Prof. Meena',room: 'A-201',  type: 'Lecture', span: 1, color: '#4F8EF7' },
    { time: '2:00',  subject: 'Library / Self Study',   code: '',      faculty: '',            room: 'Library',type: 'Free',    span: 1, color: '#94a3b8' },
  ],
  Friday: [
    { time: '9:00',  subject: 'DBMS',                  code: 'CS303', faculty: 'Dr. Anand',  room: 'A-302',  type: 'Lecture', span: 1, color: '#06b6d4' },
    { time: '10:00', subject: 'Data Structures',        code: 'CS301', faculty: 'Dr. Rao',    room: 'A-201',  type: 'Lecture', span: 1, color: '#8b5cf6' },
    { time: '11:00', subject: 'Soft Skills',            code: 'HS301', faculty: 'Ms. Lakshmi',room: 'A-101',  type: 'Lecture', span: 1, color: '#f59e0b' },
    { time: '12:00', subject: 'Lunch Break',            code: '',      faculty: '',            room: '',       type: 'Break',   span: 1, color: '#e2e8f0' },
    { time: '1:00',  subject: 'Mini Project',           code: 'CS399', faculty: 'Dr. Rao',    room: 'Lab-3',  type: 'Project', span: 2, color: '#ec4899' },
  ],
  Saturday: [
    { time: '9:00',  subject: 'Web Technologies Lab',  code: 'CS304', faculty: 'Prof. Ravi', room: 'Lab-1',  type: 'Lab',     span: 2, color: '#10b981' },
    { time: '11:00', subject: 'Extra Classes / Doubt',  code: '',      faculty: 'Various',    room: 'A-201',  type: 'Extra',   span: 1, color: '#94a3b8' },
    { time: '12:00', subject: 'Lunch Break',            code: '',      faculty: '',            room: '',       type: 'Break',   span: 1, color: '#e2e8f0' },
  ],
}

const TYPE_BADGE = {
  Lab:     { bg: '#ede9fe', color: '#7c3aed', label: 'Lab' },
  Lecture: { bg: 'var(--primary-50)', color: 'var(--primary-700)', label: 'Lecture' },
  Break:   { bg: '#f1f5f9', color: '#64748b', label: 'Break' },
  Project: { bg: '#fce7f3', color: '#be185d', label: 'Project' },
  Free:    { bg: '#f0fdf4', color: '#15803d', label: 'Free' },
  Extra:   { bg: '#f0fdf4', color: '#15803d', label: 'Extra' },
}

const today = new Date().toLocaleDateString('en-US', { weekday: 'long' })

export default function TimetablePage() {
  const [activeDay, setActiveDay] = useState(DAYS.includes(today) ? today : 'Monday')
  const [view, setView] = useState('day') // 'day' | 'week'
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update clock every minute to keep active highlighting fresh
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  const currentHour = currentTime.getHours()
  const schedule = SCHEDULE[activeDay] || []

  // Helper to parse time string like "9:00" or "2:00" to 24h format for comparison
  const getStartHour = (timeStr) => {
    const [hStr] = timeStr.split(':')
    let h = parseInt(hStr, 10)
    if (h < 8) h += 12 // Assuming 1:00 to 5:00 are PM (13 to 17)
    return h
  }

  return (
    <div className="timetable-page" id="timetable-page">
      <div className="page-header">
        <div>
          <h1 className="page-title"> Timetable</h1>
          <p className="page-subtitle">B.Tech IT · Section A · 6th Semester · Academic Year 2025–26</p>
        </div>
        <div className="tt-view-toggle">
          <button className={`tt-toggle-btn ${view === 'day' ? 'active' : ''}`} onClick={() => setView('day')}>Day</button>
          <button className={`tt-toggle-btn ${view === 'week' ? 'active' : ''}`} onClick={() => setView('week')}>Week</button>
        </div>
      </div>

      {/* Day tabs */}
      <div className="tt-day-tabs animate-fade-in">
        {DAYS.map(day => (
          <button
            key={day}
            className={`tt-day-tab ${activeDay === day ? 'active' : ''} ${day === today ? 'today' : ''}`}
            onClick={() => setActiveDay(day)}
            id={`tab-${day.toLowerCase()}`}
          >
            <span className="tt-day-short">{day.slice(0, 3)}</span>
            {day === today && <span className="tt-today-dot" />}
          </button>
        ))}
      </div>

      {view === 'day' ? (
        /* Day View */
        <div className="tt-day-view animate-fade-in delay-1">
          <h2 className="tt-day-heading">
            {activeDay}
            {activeDay === today && <span className="badge badge-primary" style={{ marginLeft: 10, fontSize: '0.7rem' }}>Today</span>}
          </h2>

          <div className="tt-periods">
            {schedule.map((cls, i) => {
              const startH = getStartHour(cls.time)
              const endH = startH + (cls.span || 1)
              const isActiveNow = activeDay === today && currentHour >= startH && currentHour < endH

              return (
                <div
                  key={i}
                  className={`tt-period-card animate-fade-in ${cls.type === 'Break' ? 'tt-break-card' : ''} ${isActiveNow ? 'active-now' : ''}`}
                  style={{ animationDelay: `${i * 0.08}s`, '--cls-color': cls.color }}
                >
                  {/* Time */}
                <div className="tt-period-time">
                  <MdAccessTime size={14} style={{ color: cls.color || 'var(--text-muted)' }} />
                  <span>{cls.time} {parseInt(cls.time) < 9 ? 'PM' : parseInt(cls.time) >= 9 && parseInt(cls.time) < 12 ? 'AM' : parseInt(cls.time) === 12 ? 'PM' : 'PM'}</span>
                  {cls.span > 1 && <span className="tt-period-span">({cls.span}h)</span>}
                </div>

                {/* Content */}
                <div className="tt-period-body">
                  <div className="tt-period-stripe" style={{ background: cls.color }} />
                  <div className="tt-period-info">
                    <div className="tt-period-head">
                      <p className="tt-period-subject">{cls.subject}</p>
                      {cls.code && <span className="badge" style={{ background: TYPE_BADGE[cls.type]?.bg, color: TYPE_BADGE[cls.type]?.color, fontSize: '0.7rem' }}>{cls.code}</span>}
                    </div>
                    {cls.faculty && (
                      <div className="tt-period-meta">
                        <span><MdPerson size={13} /> {cls.faculty}</span>
                        <span><MdLocationOn size={13} /> {cls.room}</span>
                      </div>
                    )}
                  </div>
                  {cls.type !== 'Break' && (
                    <span className="badge tt-type-badge" style={{ background: TYPE_BADGE[cls.type]?.bg, color: TYPE_BADGE[cls.type]?.color }}>
                      {TYPE_BADGE[cls.type]?.label}
                    </span>
                  )}
                  {isActiveNow && <span className="live-badge"><span className="pulse-dot"></span> LIVE</span>}
                </div>
              </div>
            )})}

            {schedule.length === 0 && (
              <div className="tt-empty">
                 No classes scheduled for {activeDay}. Enjoy your day!
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Week View */
        <div className="tt-week-view animate-fade-in delay-1">
          <div className="tt-week-grid">
            {DAYS.map(day => (
              <div key={day} className={`tt-week-col ${day === today ? 'today-col' : ''}`}>
                <div className="tt-week-col-header">
                  <p className="tt-week-day">{day.slice(0, 3)}</p>
                  {day === today && <span className="tt-today-badge">Today</span>}
                </div>
                {(SCHEDULE[day] || []).map((cls, i) => {
                  const startH = getStartHour(cls.time)
                  const endH = startH + (cls.span || 1)
                  const isActiveNow = day === today && currentHour >= startH && currentHour < endH
                  
                  return cls.type !== 'Break' ? (
                    <div key={i} className={`tt-week-card ${isActiveNow ? 'active-now' : ''}`} style={{ background: cls.color + '18', borderLeft: `3px solid ${cls.color}` }}>
                      <p className="tt-week-sub">{cls.subject.split(' ').slice(0, 2).join(' ')}</p>
                      <p className="tt-week-time">{cls.time} {cls.type === 'Lab' ? '· Lab' : ''}</p>
                    </div>
                  ) : null
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="tt-legend animate-fade-in delay-2">
        {Object.entries(TYPE_BADGE).map(([key, val]) => (
          key !== 'Break' && (
            <div key={key} className="tt-legend-item">
              <div className="tt-legend-dot" style={{ background: val.color }} />
              <span>{val.label}</span>
            </div>
          )
        ))}
      </div>
    </div>
  )
}
