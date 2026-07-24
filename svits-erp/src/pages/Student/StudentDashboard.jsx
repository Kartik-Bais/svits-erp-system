import { useAuth } from '../../contexts/AuthContext'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {
  AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis
} from 'recharts'
import { MdTrendingUp, MdTrendingDown, MdCalendarToday, MdAssignment,
         MdArrowForward, MdStar, MdFlashOn, MdDragIndicator, MdSettings,
         MdEventNote, MdEventAvailable, MdLibraryBooks, MdBarChart, MdPerson, MdSmartToy, MdCheckCircle, MdWarning } from 'react-icons/md'
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core'
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import './StudentDashboard.css'

const CGPA_TREND = [
  { sem: 'S1', cgpa: 7.8 }, { sem: 'S2', cgpa: 8.1 },
  { sem: 'S3', cgpa: 8.3 }, { sem: 'S4', cgpa: 8.5 },
  { sem: 'S5', cgpa: 8.6 }, { sem: 'S6', cgpa: 8.74 },
]

const TODAY_CLASSES = [
  { subject: 'Data Structures & Algorithms', time: '9:00', ampm: 'AM', room: 'Lab-3',  faculty: 'Dr. Rao',    type: 'Lab',     color: 'var(--accent-purple)' },
  { subject: 'Operating Systems',            time: '11:00', ampm: 'AM', room: 'A-201', faculty: 'Prof. Meena', type: 'Lecture', color: 'var(--primary-500)' },
  { subject: 'Database Management Systems',  time: '1:00', ampm: 'PM',  room: 'A-302', faculty: 'Dr. Anand',  type: 'Lecture', color: 'var(--accent-teal)' },
  { subject: 'Web Technologies Lab',         time: '2:00', ampm: 'PM',  room: 'Lab-1', faculty: 'Prof. Ravi', type: 'Lab',     color: 'var(--accent-green)' },
]

const UPCOMING = [
  { task: 'DSA Assignment Submission',    deadline: 'Tomorrow, 11:59 PM', urgent: true  },
  { task: 'OS Internal Exam',              deadline: 'July 22nd',          urgent: true  },
  { task: 'DBMS Mini Project Review',      deadline: 'July 28th',          urgent: false },
  { task: 'Web Tech Practical Record',     deadline: 'July 30th',          urgent: false },
]

const QUICK_ACTIONS = [
  { label: 'Timetable',   icon: <MdEventNote />, path: '/student/timetable',   color: 'var(--primary-500)',  bg: 'var(--primary-50)' },
  { label: 'Attendance',  icon: <MdEventAvailable />, path: '/student/attendance',  color: 'var(--accent-green)', bg: '#d1fae5' },
  { label: 'Assignments', icon: <MdLibraryBooks />, path: '/student/assignments', color: 'var(--accent-orange)',bg: '#fef3c7' },
  { label: 'Results',     icon: <MdBarChart />, path: '/student/results',     color: 'var(--accent-purple)',bg: '#ede9fe' },
  { label: 'Profile',     icon: <MdPerson />, path: '/student/profile',     color: 'var(--accent-teal)',  bg: '#cffafe' },
  { label: 'AI Help',     icon: <MdSmartToy />, path: '/student/ai',          color: 'var(--primary-600)',  bg: 'var(--primary-100)' },
]

const STATS = [
  { label: 'CGPA',        value: '8.74', icon: <MdTrendingUp />, color: 'var(--primary-500)',  bg: 'var(--primary-50)',  trend: '+0.12 this sem', up: true  },
  { label: 'Attendance',  value: '86%',  icon: <MdEventAvailable />, color: 'var(--accent-green)', bg: '#d1fae5',            trend: '86% overall',    up: true  },
  { label: 'Assignments', value: '3',    icon: <MdLibraryBooks />, color: 'var(--accent-orange)',bg: '#fef3c7',            trend: 'Due this week',  up: false },
  { label: 'Backlogs',    value: '0',    icon: <MdCheckCircle />, color: 'var(--accent-green)', bg: '#d1fae5',            trend: 'Clean record!',  up: true  },
]

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#fff', border: '1px solid var(--border-color)', borderRadius: 8, padding: '6px 12px', fontSize: 13, boxShadow: 'var(--shadow-md)' }}>
        <p style={{ fontWeight: 700, color: 'var(--primary-600)' }}>CGPA: {payload[0].value}</p>
      </div>
    )
  }
  return null
}

const SortableItem = ({ id, content, isCustomizing }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })
  const style = { transform: CSS.Transform.toString(transform), transition }

  return (
    <div ref={setNodeRef} style={style} className={`sortable-widget-wrap ${isCustomizing ? 'customizing' : ''}`}>
      {isCustomizing && (
        <div className="widget-drag-handle" {...attributes} {...listeners}>
          <MdDragIndicator size={20} />
        </div>
      )}
      {content}
    </div>
  )
}

export default function StudentDashboard() {
  const { user } = useAuth()
  const { t } = useTranslation()
  const hour = new Date().getHours()
  const greeting = hour < 12 ? t('good_morning') : hour < 17 ? t('good_afternoon') : t('good_evening')

  const [isCustomizing, setIsCustomizing] = useState(false)

  // Define widgets
  const WIDGETS = {
    'quick_actions': (
      <div className="card h-full">
        <div className="card-header">
          <h2 className="section-title">
            <MdFlashOn size={18} style={{ color: 'var(--accent-orange)', verticalAlign: 'middle', marginRight: 6 }} />
            {t('quick_actions')}
          </h2>
        </div>
        <div className="card-body">
          <div className="sd-qa-grid">
            {QUICK_ACTIONS.map((qa, i) => (
              <Link key={i} to={qa.path} className="sd-qa-btn" style={{ '--qa-color': qa.color, '--qa-bg': qa.bg }}>
                <span className="sd-qa-icon">{qa.icon}</span>
                <span className="sd-qa-label">{qa.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    ),
    'today_classes': (
      <div className="card h-full">
        <div className="card-header">
          <div className="flex items-center justify-between" style={{ width: '100%' }}>
            <h2 className="section-title">
              <MdCalendarToday size={17} style={{ color: 'var(--primary-500)', verticalAlign: 'middle', marginRight: 6 }} />
              {t('today_classes')}
            </h2>
            <span className="badge badge-primary">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long' })}
            </span>
          </div>
        </div>
        <div className="sd-class-list">
          {TODAY_CLASSES.map((cls, i) => (
            <div key={i} className="sd-class-row">
              <div className="sd-class-time-col">
                <p className="sd-class-time">{cls.time}</p>
                <p className="sd-class-ampm">{cls.ampm}</p>
              </div>
              <div className="sd-class-stripe" style={{ background: cls.color }} />
              <div className="sd-class-info">
                <p className="sd-class-name">{cls.subject}</p>
                <p className="sd-class-meta">{cls.faculty} · {cls.room}</p>
              </div>
              <span className="badge" style={{
                background: cls.type === 'Lab' ? '#ede9fe' : 'var(--primary-50)',
                color: cls.color, flexShrink: 0
              }}>{cls.type}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    'upcoming_deadlines': (
      <div className="card h-full">
        <div className="card-header">
          <div className="flex items-center justify-between" style={{ width: '100%' }}>
            <h2 className="section-title">
              <MdAssignment size={17} style={{ color: 'var(--accent-orange)', verticalAlign: 'middle', marginRight: 6 }} />
              Upcoming Deadlines
            </h2>
            <Link to="/student/assignments" className="btn btn-outline btn-sm" style={{ fontSize: '0.8rem' }}>
              View All <MdArrowForward size={14} />
            </Link>
          </div>
        </div>
        <div className="card-body" style={{ padding: '8px 24px 20px' }}>
          {UPCOMING.map((item, i) => (
            <div key={i} className="sd-deadline-row">
              <div className={`sd-deadline-dot ${item.urgent ? 'urgent' : ''}`} />
              <div className="sd-deadline-info">
                <p className="sd-deadline-task">{item.task}</p>
                <p className="sd-deadline-date">{item.deadline}</p>
              </div>
              {item.urgent && <span className="badge badge-danger" style={{ flexShrink: 0 }}>Urgent</span>}
            </div>
          ))}
        </div>
      </div>
    ),
    'cgpa_trend': (
      <div className="card h-full">
        <div className="card-header">
          <div className="flex items-center justify-between" style={{ width: '100%' }}>
            <h2 className="section-title"> CGPA Trend</h2>
            <span className="badge badge-primary">
              <MdStar size={11} /> 8.74 Current
            </span>
          </div>
        </div>
        <div className="card-body" style={{ paddingTop: 8 }}>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={CGPA_TREND} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="cgpaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F8EF7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4F8EF7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="sem" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis domain={[7, 10]} tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="cgpa" stroke="var(--primary-500)" strokeWidth={2.5}
                fill="url(#cgpaGrad)" dot={{ fill: 'var(--primary-500)', r: 4 }}
                activeDot={{ r: 6, fill: 'var(--primary-600)' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    ),
    'attendance_overview': (
      <div className="card h-full">
        <div className="card-header">
          <h2 className="section-title"> Attendance Overview</h2>
        </div>
        <div className="card-body" style={{ paddingTop: 8 }}>
          {[
            { sub: 'Data Structures', pct: 92, color: 'var(--accent-green)', classes: '23/25' },
            { sub: 'Operating Systems', pct: 78, color: 'var(--accent-orange)', classes: '18/23' },
            { sub: 'DBMS', pct: 88, color: 'var(--primary-500)', classes: '22/25' },
            { sub: 'Web Technologies', pct: 68, color: 'var(--accent-red)', classes: '17/25' },
            { sub: 'Soft Skills', pct: 95, color: 'var(--accent-teal)', classes: '19/20' },
          ].map((s, i) => (
            <div key={i} className="sd-attend-row">
              <div className="sd-attend-head">
                <span className="sd-attend-sub">{s.sub}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.classes}</span>
                <span className="sd-attend-pct" style={{ color: s.color }}>{s.pct}%</span>
              </div>
              <div className="sd-attend-track">
                <div className="sd-attend-fill" style={{ width: `${s.pct}%`, background: s.color }} />
              </div>
            </div>
          ))}
          <div className="sd-attend-warning">
            <MdWarning size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} /> Web Technologies at 68% — risk of detention. Attend next 4 classes!
          </div>
        </div>
      </div>
    )
  }

  const defaultOrder = ['quick_actions', 'today_classes', 'upcoming_deadlines', 'cgpa_trend', 'attendance_overview']
  const [widgetOrder, setWidgetOrder] = useState(() => {
    const saved = localStorage.getItem('sd-widget-order')
    return saved ? JSON.parse(saved) : defaultOrder
  })

  useEffect(() => {
    localStorage.setItem('sd-widget-order', JSON.stringify(widgetOrder))
  }, [widgetOrder])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (active.id !== over.id) {
      setWidgetOrder((items) => {
        const oldIndex = items.indexOf(active.id)
        const newIndex = items.indexOf(over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  return (
    <div className="student-dashboard" id="student-dashboard">
      <div className="sd-page-header animate-fade-in">
        <div>
          <h1 className="page-title">{greeting}, {user?.name.split(' ')[0]}! </h1>
          <p className="page-subtitle">{user?.branch} · {user?.semester} Semester · Roll: {user?.rollNo}</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button 
            className={`btn btn-sm ${isCustomizing ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setIsCustomizing(!isCustomizing)}
          >
            <MdSettings size={16} /> {isCustomizing ? 'Done Editing' : 'Customize Layout'}
          </button>
          <Link to="/student/profile" className="sd-profile-chip">
            <div className="avatar-placeholder avatar-md" style={{ background: 'var(--gradient-primary)', fontSize: '1rem' }}>
              {user?.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>{user?.name}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.rollNo}</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Stats Row */}
      <div className="sd-stats-grid animate-fade-in delay-1">
        {STATS.map((s, i) => (
          <div key={i} className="sd-stat-card" style={{ '--accent': s.color }}>
            <div className="sd-stat-icon" style={{ background: s.bg, color: s.color }}>
              <span style={{ fontSize: '1.5rem' }}>{s.icon}</span>
            </div>
            <div className="sd-stat-body">
              <p className="sd-stat-value" style={{ color: s.color }}>{s.value}</p>
              <p className="sd-stat-label">{s.label}</p>
              <p className={`sd-stat-trend ${s.up ? 'up' : 'down'}`}>
                {s.up ? <MdTrendingUp size={13} /> : <MdTrendingDown size={13} />}
                {s.trend}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Draggable Main Content */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={widgetOrder} strategy={rectSortingStrategy}>
          <div className="sd-widget-grid animate-fade-in delay-2">
            {widgetOrder.map(id => (
              <SortableItem key={id} id={id} content={WIDGETS[id]} isCustomizing={isCustomizing} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}
