import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, ReferenceLine, Legend
} from 'recharts'
import { MdWarning, MdCheckCircle, MdCalendarToday, MdTrendingUp } from 'react-icons/md'
import './AttendancePage.css'

const SUBJECTS = [
  { code: 'CS301', name: 'Data Structures & Algorithms', faculty: 'Dr. Rao',     total: 25, present: 23, pct: 92, color: '#8b5cf6' },
  { code: 'CS302', name: 'Operating Systems',            faculty: 'Prof. Meena', total: 23, present: 18, pct: 78, color: '#4F8EF7' },
  { code: 'CS303', name: 'Database Management Systems',  faculty: 'Dr. Anand',   total: 25, present: 22, pct: 88, color: '#06b6d4' },
  { code: 'CS304', name: 'Web Technologies',             faculty: 'Prof. Ravi',  total: 25, present: 17, pct: 68, color: '#ef4444' },
  { code: 'HS301', name: 'Soft Skills & Communication',  faculty: 'Ms. Lakshmi', total: 20, present: 19, pct: 95, color: '#10b981' },
  { code: 'CS399', name: 'Mini Project',                 faculty: 'Dr. Rao',     total: 10, present: 10, pct: 100, color: '#f59e0b' },
]

const BAR_DATA = SUBJECTS.map(s => ({
  name: s.code, pct: s.pct, color: s.color,
  fill: s.pct >= 75 ? s.color : '#ef4444',
}))

const MONTHLY_TREND = [
  { month: 'Feb', overall: 91 },
  { month: 'Mar', overall: 88 },
  { month: 'Apr', overall: 84 },
  { month: 'May', overall: 87 },
  { month: 'Jun', overall: 83 },
  { month: 'Jul', overall: 86 },
]

const CALENDAR_DATA = (() => {
  const dates = []
  for (let d = 1; d <= 18; d++) {
    const type = d % 7 === 0 ? 'holiday' : d % 5 === 0 ? 'absent' : d % 11 === 0 ? 'late' : 'present'
    dates.push({ d, type })
  }
  return dates
})()

const OVERALL = Math.round(SUBJECTS.reduce((s, c) => s + c.pct, 0) / SUBJECTS.length)

const CustomBarTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const s = SUBJECTS.find(sub => sub.code === payload[0].payload.name)
    return (
      <div style={{ background: '#fff', border: '1px solid var(--border-color)', borderRadius: 8, padding: '10px 14px', fontSize: 13, boxShadow: 'var(--shadow-md)' }}>
        <p style={{ fontWeight: 700 }}>{s?.name}</p>
        <p style={{ color: payload[0].payload.fill, fontWeight: 600 }}>{payload[0].value}% attendance</p>
        <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>{s?.present}/{s?.total} classes</p>
      </div>
    )
  }
  return null
}

export default function AttendancePage() {
  const [selected, setSelected] = useState(null)
  const sel = selected != null ? SUBJECTS[selected] : null

  const requiredForSub = (sub) => {
    if (sub.pct >= 75) return null
    const needed = Math.ceil((0.75 * sub.total - sub.present) / 0.25)
    return needed > 0 ? needed : 0
  }

  return (
    <div className="attendance-page" id="attendance-page">
      <div className="page-header">
        <div>
          <h1 className="page-title"> Attendance</h1>
          <p className="page-subtitle">6th Semester · Academic Year 2025–26</p>
        </div>
        <div className={`overall-chip ${OVERALL >= 75 ? 'safe' : 'risk'}`}>
          {OVERALL >= 75 ? <MdCheckCircle size={18} /> : <MdWarning size={18} />}
          <span>Overall: <strong>{OVERALL}%</strong></span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="at-summary-grid animate-fade-in">
        {[
          { label: 'Overall', value: `${OVERALL}%`, icon: '', color: OVERALL >= 75 ? 'var(--accent-green)' : 'var(--accent-red)', bg: OVERALL >= 75 ? '#d1fae5' : '#fee2e2' },
          { label: 'Classes Attended', value: SUBJECTS.reduce((a, s) => a + s.present, 0), icon: '', color: 'var(--primary-500)', bg: 'var(--primary-50)' },
          { label: 'Classes Missed',   value: SUBJECTS.reduce((a, s) => a + (s.total - s.present), 0), icon: '', color: 'var(--accent-red)', bg: '#fee2e2' },
          { label: 'Subjects at Risk', value: SUBJECTS.filter(s => s.pct < 75).length, icon: <MdWarning />, color: 'var(--accent-orange)', bg: '#fef3c7' },
        ].map((c, i) => (
          <div key={i} className="sd-stat-card animate-fade-in" style={{ '--accent': c.color, animationDelay: `${i * 0.08}s` }}>
            <div className="sd-stat-icon" style={{ background: c.bg, color: c.color }}>
              <span style={{ fontSize: '1.4rem' }}>{c.icon}</span>
            </div>
            <div className="sd-stat-body">
              <p className="sd-stat-value" style={{ color: c.color }}>{c.value}</p>
              <p className="sd-stat-label">{c.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="at-charts-row animate-fade-in delay-1">
        {/* Bar chart */}
        <div className="card at-chart-card">
          <div className="card-header"><h2 className="section-title">Subject-wise Attendance</h2></div>
          <div className="card-body" style={{ paddingTop: 8 }}>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={BAR_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 5 }} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomBarTooltip />} />
                <ReferenceLine y={75} stroke="#ef4444" strokeDasharray="5 5" label={{ value: '75%', fill: '#ef4444', fontSize: 11, position: 'insideTopRight' }} />
                <Bar dataKey="pct" radius={[6, 6, 0, 0]}>
                  {BAR_DATA.map((entry, i) => (
                    <rect key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trend chart */}
        <div className="card at-chart-card">
          <div className="card-header"><h2 className="section-title">Monthly Trend</h2></div>
          <div className="card-body" style={{ paddingTop: 8 }}>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={MONTHLY_TREND} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip />
                <ReferenceLine y={75} stroke="#ef4444" strokeDasharray="5 5" />
                <Line type="monotone" dataKey="overall" stroke="var(--primary-500)" strokeWidth={2.5}
                  dot={{ fill: 'var(--primary-500)', r: 5 }} activeDot={{ r: 7 }} name="Overall %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Subject Table */}
      <div className="card animate-fade-in delay-2">
        <div className="card-header"><h2 className="section-title"> Detailed Subject Report</h2></div>
        <div className="at-table-wrapper">
          <table className="at-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Faculty</th>
                <th>Total Classes</th>
                <th>Present</th>
                <th>Absent</th>
                <th>Attendance %</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {SUBJECTS.map((s, i) => {
                const needed = requiredForSub(s)
                return (
                  <tr key={i} className={`at-row ${selected === i ? 'selected' : ''}`} onClick={() => setSelected(selected === i ? null : i)}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="at-subject-dot" style={{ background: s.color }} />
                        <div>
                          <p style={{ fontWeight: 600 }}>{s.name}</p>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.code}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{s.faculty}</td>
                    <td style={{ textAlign: 'center', fontWeight: 600 }}>{s.total}</td>
                    <td style={{ textAlign: 'center', color: 'var(--accent-green)', fontWeight: 600 }}>{s.present}</td>
                    <td style={{ textAlign: 'center', color: 'var(--accent-red)', fontWeight: 600 }}>{s.total - s.present}</td>
                    <td>
                      <div className="at-pct-cell">
                        <span style={{ fontWeight: 700, color: s.pct >= 75 ? 'var(--accent-green)' : 'var(--accent-red)', fontFamily: 'var(--font-heading)' }}>
                          {s.pct}%
                        </span>
                        <div className="at-mini-bar">
                          <div style={{ width: `${s.pct}%`, background: s.pct >= 75 ? s.color : '#ef4444', height: '100%', borderRadius: 99 }} />
                        </div>
                      </div>
                    </td>
                    <td>
                      {s.pct >= 75 ? (
                        <span className="badge badge-success"><MdCheckCircle size={12} /> Safe</span>
                      ) : (
                        <span className="badge badge-danger"><MdWarning size={12} /> {needed > 0 ? `Need +${needed}` : 'At Limit'}</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {sel && (
          <div className="at-detail-panel animate-scale-in">
            <h3>{sel.name}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: '8px 0 16px' }}>
              {sel.present} classes attended out of {sel.total} total.
              {sel.pct < 75 && ` You need to attend ${requiredForSub(sel)} more consecutive classes to reach 75%.`}
              {sel.pct >= 75 && ` You can miss up to ${Math.floor(sel.present - 0.75 * sel.total)} more classes safely.`}
            </p>
            <div className="at-calendar-preview">
              {CALENDAR_DATA.slice(0, sel.total).map((c) => (
                <div key={c.d} className={`at-cal-day at-cal-${c.type}`} title={c.type}>
                  {c.d}
                </div>
              ))}
            </div>
            <div className="at-cal-legend">
              {[['present','Present'],['absent','Absent'],['late','Late'],['holiday','Holiday']].map(([t, l]) => (
                <span key={t} className="tt-legend-item">
                  <span className={`at-cal-dot at-cal-${t}`} />
                  {l}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
