import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { MdCheckCircle, MdCancel, MdWarning } from 'react-icons/md'
import './ParentAttendancePage.css'

const SUBJECT_ATTENDANCE = [
  { subject: 'OS', attended: 35, total: 40 },
  { subject: 'DSA', attended: 38, total: 45 },
  { subject: 'Web Tech', attended: 42, total: 45 },
  { subject: 'Maths', attended: 28, total: 40 },
  { subject: 'Soft Skills', attended: 20, total: 20 },
]

export default function ParentAttendancePage() {
  const chartData = SUBJECT_ATTENDANCE.map(s => {
    const pct = Math.round((s.attended / s.total) * 100)
    return {
      name: s.subject,
      pct,
      fill: pct >= 75 ? 'var(--primary-500)' : 'var(--accent-red)'
    }
  })

  const overallAttended = SUBJECT_ATTENDANCE.reduce((acc, curr) => acc + curr.attended, 0)
  const overallTotal = SUBJECT_ATTENDANCE.reduce((acc, curr) => acc + curr.total, 0)
  const overallPct = Math.round((overallAttended / overallTotal) * 100)

  return (
    <div className="parent-att-page animate-fade-in" id="parent-attendance-page">
      <div className="page-header">
        <div>
          <h1 className="page-title"> Ward's Attendance</h1>
          <p className="page-subtitle">Track your child's daily class presence</p>
        </div>
      </div>

      <div className="parent-att-stats">
        <div className="card parent-att-stat-card">
          <div className="parent-att-stat-icon" style={{ background: '#e0f2fe', color: '#0284c7' }}>
            <MdCheckCircle size={28} />
          </div>
          <div>
            <div className="parent-att-stat-label">Overall Attendance</div>
            <div className="parent-att-stat-value" style={{ color: overallPct >= 75 ? 'var(--primary-600)' : 'var(--accent-red)' }}>
              {overallPct}%
            </div>
          </div>
        </div>
        <div className="card parent-att-stat-card">
          <div className="parent-att-stat-icon" style={{ background: '#d1fae5', color: '#059669' }}>
            <MdCheckCircle size={28} />
          </div>
          <div>
            <div className="parent-att-stat-label">Classes Attended</div>
            <div className="parent-att-stat-value">{overallAttended}</div>
          </div>
        </div>
        <div className="card parent-att-stat-card">
          <div className="parent-att-stat-icon" style={{ background: '#fee2e2', color: '#dc2626' }}>
            <MdCancel size={28} />
          </div>
          <div>
            <div className="parent-att-stat-label">Classes Missed</div>
            <div className="parent-att-stat-value">{overallTotal - overallAttended}</div>
          </div>
        </div>
      </div>

      <div className="parent-att-grid">
        <div className="card">
          <div className="card-header">
            <h2 className="section-title">Subject-wise Breakdown</h2>
          </div>
          <div className="card-body" style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} formatter={(v) => [`${v}%`, 'Attendance']} />
                <Bar dataKey="pct" radius={[4, 4, 0, 0]} maxBarSize={50}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="section-title">Action Items</h2>
          </div>
          <div className="card-body parent-att-alerts">
            {chartData.filter(c => c.pct < 75).length > 0 ? (
              chartData.filter(c => c.pct < 75).map((c, i) => (
                <div key={i} className="parent-att-alert danger">
                  <MdWarning size={24} />
                  <div>
                    <strong>Low Attendance in {c.name}</strong>
                    <p>Current attendance is {c.pct}%. Needs to be above 75% to appear in exams.</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="parent-att-alert success">
                <MdCheckCircle size={24} />
                <div>
                  <strong>All Good!</strong>
                  <p>Attendance is well above the required 75% in all subjects.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
