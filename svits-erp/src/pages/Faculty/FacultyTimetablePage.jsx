import { useState } from 'react'
import { MdCalendarToday, MdAccessTime, MdLocationOn, MdGroup } from 'react-icons/md'
import './FacultyTimetablePage.css'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const FACULTY_SCHEDULE = {
  Monday: [
    { id: 1, time: '09:00 AM - 10:00 AM', subject: 'Data Structures', batch: 'IT-3A', room: 'A-301', type: 'Lecture', color: '#4F8EF7' },
    { id: 2, time: '11:00 AM - 01:00 PM', subject: 'DSA Lab', batch: 'IT-3A', room: 'Lab-3', type: 'Lab', color: '#8b5cf6' },
    { id: 3, time: '02:00 PM - 03:00 PM', subject: 'Algorithms', batch: 'CS-3B', room: 'A-302', type: 'Lecture', color: '#10b981' }
  ],
  Tuesday: [
    { id: 4, time: '10:00 AM - 11:00 AM', subject: 'Data Structures', batch: 'IT-3B', room: 'A-304', type: 'Lecture', color: '#4F8EF7' },
    { id: 5, time: '01:00 PM - 03:00 PM', subject: 'Algorithms Lab', batch: 'CS-3B', room: 'Lab-2', type: 'Lab', color: '#8b5cf6' }
  ],
  Wednesday: [
    { id: 6, time: '09:00 AM - 11:00 AM', subject: 'DSA Lab', batch: 'IT-3B', room: 'Lab-3', type: 'Lab', color: '#8b5cf6' },
    { id: 7, time: '12:00 PM - 01:00 PM', subject: 'Algorithms', batch: 'CS-3A', room: 'A-305', type: 'Lecture', color: '#10b981' }
  ],
  Thursday: [
    { id: 8, time: '11:00 AM - 12:00 PM', subject: 'Data Structures', batch: 'IT-3A', room: 'A-301', type: 'Lecture', color: '#4F8EF7' },
    { id: 9, time: '02:00 PM - 04:00 PM', subject: 'Mini Project Guide', batch: 'IT-3A & 3B', room: 'Lab-4', type: 'Project', color: '#f59e0b' }
  ],
  Friday: [
    { id: 10, time: '10:00 AM - 11:00 AM', subject: 'Algorithms', batch: 'CS-3B', room: 'A-302', type: 'Lecture', color: '#10b981' },
    { id: 11, time: '11:00 AM - 12:00 PM', subject: 'Data Structures', batch: 'IT-3B', room: 'A-304', type: 'Lecture', color: '#4F8EF7' }
  ],
  Saturday: []
}

export default function FacultyTimetablePage() {
  const [activeDay, setActiveDay] = useState('Monday')
  
  return (
    <div className="fac-timetable-page animate-fade-in" id="faculty-timetable-page">
      <div className="page-header">
        <div>
          <h1 className="page-title"> Teaching Schedule</h1>
          <p className="page-subtitle">Your weekly class and lab timetable</p>
        </div>
      </div>

      <div className="card">
        <div className="card-header fac-tt-tabs">
          {DAYS.map(day => (
            <button
              key={day}
              className={`fac-tt-tab ${activeDay === day ? 'active' : ''}`}
              onClick={() => setActiveDay(day)}
            >
              {day}
            </button>
          ))}
        </div>
        
        <div className="card-body">
          <div className="fac-tt-list">
            {FACULTY_SCHEDULE[activeDay]?.length > 0 ? (
              FACULTY_SCHEDULE[activeDay].map((cls, idx) => (
                <div key={cls.id} className="fac-tt-card animate-fade-in" style={{ animationDelay: `${idx * 0.05}s`, borderLeftColor: cls.color }}>
                  <div className="fac-tt-time">
                    <MdAccessTime size={18} />
                    <span>{cls.time}</span>
                  </div>
                  <div className="fac-tt-details">
                    <h3 className="fac-tt-subject">{cls.subject}</h3>
                    <div className="fac-tt-meta">
                      <span className="fac-tt-meta-item"><MdGroup size={16} /> Batch: {cls.batch}</span>
                      <span className="fac-tt-meta-item"><MdLocationOn size={16} /> Room: {cls.room}</span>
                    </div>
                  </div>
                  <div className="fac-tt-type">
                    <span className="badge" style={{ backgroundColor: `${cls.color}20`, color: cls.color }}>
                      {cls.type}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="fac-tt-empty">
                <MdCalendarToday size={48} color="var(--neutral-300)" />
                <p>No classes scheduled for {activeDay}.</p>
                <span>Enjoy your day off or use it for research!</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
