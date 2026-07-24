import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Link } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts'
import { MdPeople, MdAssignment, MdCalendarToday, MdBeachAccess,
         MdArrowForward, MdTrendingUp, MdStar, MdNotifications, MdCheckCircle } from 'react-icons/md'
import './FacultyDashboard.css'

const CLASS_ATTENDANCE = [
  { cls: 'IT-3A', pct: 84, students: 65 },
  { cls: 'IT-3B', pct: 91, students: 62 },
  { cls: 'CS-3A', pct: 78, students: 68 },
]

const MARKS_DIST = [
  { range: '90-100', count: 12, fill: '#10b981' },
  { range: '80-89',  count: 28, fill: '#4F8EF7' },
  { range: '70-79',  count: 18, fill: '#f59e0b' },
  { range: '60-69',  count: 10, fill: '#ef4444' },
  { range: '<60',    count: 4,  fill: '#94a3b8' },
]

const MONTHLY_ATTENDANCE = [
  { month: 'Feb', pct: 88 }, { month: 'Mar', pct: 85 },
  { month: 'Apr', pct: 82 }, { month: 'May', pct: 87 },
  { month: 'Jun', pct: 84 }, { month: 'Jul', pct: 86 },
]

const TODAY_SCHEDULE = [
  { subject: 'Data Structures',        batch: 'IT-3A',  time: '9:00 AM',  room: 'Lab-3',  type: 'Lab'     },
  { subject: 'Algorithms',             batch: 'CS-3B',  time: '11:00 AM', room: 'A-302',  type: 'Lecture' },
  { subject: 'DSA Lab',                batch: 'IT-3A',  time: '2:00 PM',  room: 'Lab-3',  type: 'Lab'     },
]

const PENDING = [
  { task: 'Grade OS mid-term papers',   batch: 'CS-3A', due: 'Today', urgent: true  },
  { task: 'Submit attendance report',   batch: 'All',   due: 'Tomorrow', urgent: true  },
  { task: 'Review mini-project proposals', batch: 'IT-3A', due: 'July 22', urgent: false },
  { task: 'Upload DSA lab manual',      batch: 'IT-3A', due: 'July 25', urgent: false },
]

const ANNOUNCEMENTS = [
  { text: 'Internal exam schedule released — July 22-26', type: 'info', time: '2h ago' },
  { text: '3 leave requests pending approval', type: 'warning', time: '5h ago' },
  { text: 'New grading rubric uploaded by HOD', type: 'success', time: '1d ago' },
]

export default function FacultyDashboard() {
  const { user } = useAuth()
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening'

  const STATS = [
    { label: 'Total Students', value: '195', icon: '', color: 'var(--primary-500)',   bg: 'var(--primary-50)',  trend: 'Across 3 sections' },
    { label: 'Classes Today',  value: TODAY_SCHEDULE.length.toString(), icon: '', color: 'var(--accent-green)', bg: '#d1fae5', trend: 'Classes scheduled' },
    { label: 'Leave Balance',  value: '12',  icon: <MdBeachAccess />, color: 'var(--accent-teal)',   bg: '#cffafe',  trend: 'Days remaining' },
  ]

  return (
    <div className="faculty-dashboard" id="faculty-dashboard">
      {/* Header */}
      <div className="sd-page-header animate-fade-in">
        <div>
          <h1 className="page-title">{greeting}, {user?.name?.split(' ')[0]}! </h1>
          <p className="page-subtitle">{user?.designation} · {user?.department} · Exp: {user?.experience}</p>
        </div>
        <div className="fac-quick-links">
          <Link to="/faculty/attendance" className="btn btn-primary btn-sm"><MdCalendarToday size={15} /> Mark Attendance</Link>
          <Link to="/faculty/results" className="btn btn-secondary btn-sm"><MdAssignment size={15} /> Enter Marks</Link>
        </div>
      </div>

      {/* Stats */}
      <div className="sd-stats-grid animate-fade-in delay-1">
        {STATS.map((s, i) => (
          <div key={i} className="sd-stat-card" style={{ '--accent': s.color }}>
            <div className="sd-stat-icon" style={{ background: s.bg, color: s.color }}>
              <span style={{ fontSize: '1.5rem' }}>{s.icon}</span>
            </div>
            <div className="sd-stat-body">
              <p className="sd-stat-value" style={{ color: s.color }}>{s.value}</p>
              <p className="sd-stat-label">{s.label}</p>
              <p className="sd-stat-trend up"><MdTrendingUp size={13} />{s.trend}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="fac-main-grid animate-fade-in delay-2">
        {/* LEFT */}
        <div className="sd-left-col">

          {/* Today's Schedule */}
          <div className="card">
            <div className="card-header">
              <div className="flex items-center justify-between" style={{ width: '100%' }}>
                <h2 className="section-title"><MdCalendarToday size={17} style={{ color: 'var(--primary-500)', verticalAlign: 'middle', marginRight: 6 }} /> Today's Schedule</h2>
                <Link to="/faculty/timetable" className="btn btn-outline btn-sm" style={{ fontSize: '0.8rem' }}>View All <MdArrowForward size={14} /></Link>
              </div>
            </div>
            <div className="sd-class-list">
              {TODAY_SCHEDULE.map((cls, i) => (
                <div key={i} className="sd-class-row animate-fade-in" style={{ animationDelay: `${i * 0.07}s` }}>
                  <div className="sd-class-time-col">
                    <p className="sd-class-time">{cls.time.split(' ')[0]}</p>
                    <p className="sd-class-ampm">{cls.time.split(' ')[1]}</p>
                  </div>
                  <div className="sd-class-stripe" style={{ background: cls.type === 'Lab' ? '#8b5cf6' : 'var(--primary-500)' }} />
                  <div className="sd-class-info">
                    <p className="sd-class-name">{cls.subject}</p>
                    <p className="sd-class-meta">Batch: {cls.batch} · Room: {cls.room}</p>
                  </div>
                  <span className="badge" style={{ background: cls.type === 'Lab' ? '#ede9fe' : 'var(--primary-50)', color: cls.type === 'Lab' ? '#7c3aed' : 'var(--primary-700)', flexShrink: 0 }}>{cls.type}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Tasks */}
          <div className="card">
            <div className="card-header">
              <h2 className="section-title"><MdAssignment size={17} style={{ color: 'var(--accent-orange)', verticalAlign: 'middle', marginRight: 6 }} /> Pending Tasks</h2>
            </div>
            <div className="card-body" style={{ padding: '8px 24px 20px' }}>
              {PENDING.map((t, i) => (
                <div key={i} className="sd-deadline-row animate-fade-in" style={{ animationDelay: `${i * 0.06}s` }}>
                  <div className={`sd-deadline-dot ${t.urgent ? 'urgent' : ''}`} />
                  <div className="sd-deadline-info">
                    <p className="sd-deadline-task">{t.task}</p>
                    <p className="sd-deadline-date">Batch: {t.batch} · Due: {t.due}</p>
                  </div>
                  {t.urgent && <span className="badge badge-danger" style={{ flexShrink: 0 }}>Urgent</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Class Attendance Summary */}
          <div className="card">
            <div className="card-header">
              <div className="flex items-center justify-between" style={{ width: '100%' }}>
                <h2 className="section-title"> Class Attendance Summary</h2>
                <Link to="/faculty/attendance" className="btn btn-outline btn-sm" style={{ fontSize: '0.8rem' }}>Manage</Link>
              </div>
            </div>
            <div className="card-body" style={{ paddingTop: 8 }}>
              {CLASS_ATTENDANCE.map((c, i) => (
                <div key={i} className="sd-attend-row">
                  <div className="sd-attend-head">
                    <span className="sd-attend-sub">{c.cls}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.students} students</span>
                    <span className="sd-attend-pct" style={{ color: c.pct >= 75 ? 'var(--accent-green)' : 'var(--accent-red)' }}>{c.pct}%</span>
                  </div>
                  <div className="sd-attend-track">
                    <div className="sd-attend-fill" style={{ width: `${c.pct}%`, background: c.pct >= 75 ? 'var(--primary-500)' : 'var(--accent-red)' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="sd-right-col">
          {/* Marks Distribution Pie */}
          <div className="card">
            <div className="card-header"><h2 className="section-title"><MdStar size={17} style={{ color: 'var(--accent-orange)', verticalAlign: 'middle', marginRight: 6 }} /> Marks Distribution</h2></div>
            <div className="card-body" style={{ paddingTop: 8 }}>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={MARKS_DIST} margin={{ top: 5, right: 5, left: -25, bottom: 5 }} barSize={24}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                  <XAxis dataKey="range" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                  <Tooltip formatter={(v) => [v, 'Students']} />
                  <Bar dataKey="count" radius={[5, 5, 0, 0]}>
                    {MARKS_DIST.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Monthly attendance trend */}
          <div className="card">
            <div className="card-header"><h2 className="section-title"> Attendance Trend</h2></div>
            <div className="card-body" style={{ paddingTop: 8 }}>
              <ResponsiveContainer width="100%" height={150}>
                <LineChart data={MONTHLY_ATTENDANCE} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                  <Tooltip formatter={(v) => [`${v}%`, 'Avg Attendance']} />
                  <Line type="monotone" dataKey="pct" stroke="var(--primary-500)" strokeWidth={2.5}
                    dot={{ fill: 'var(--primary-500)', r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Announcements */}
          <div className="card">
            <div className="card-header">
              <h2 className="section-title"><MdNotifications size={17} style={{ color: 'var(--primary-500)', verticalAlign: 'middle', marginRight: 6 }} /> Announcements</h2>
            </div>
            <div className="card-body" style={{ padding: '8px 20px 16px' }}>
              {ANNOUNCEMENTS.map((a, i) => (
                <div key={i} className="fac-announce-row animate-fade-in" style={{ animationDelay: `${i * 0.08}s` }}>
                  <div className={`fac-announce-dot ${a.type}`} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.875rem', fontWeight: 500 }}>{a.text}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
