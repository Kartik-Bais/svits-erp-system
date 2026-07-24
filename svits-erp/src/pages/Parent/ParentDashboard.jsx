import { useAuth } from '../../contexts/AuthContext'

export default function ParentDashboard() {
  const { user } = useAuth()
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Welcome, {user?.name}! ‍‍</h1>
        <p className="page-subtitle">Monitoring: {user?.ward} · {user?.wardRollNo}</p>
      </div>
      <div className="grid-3 animate-fade-in">
        {[
          { label: 'Current CGPA',      value: '8.74', icon: '', color: 'var(--primary-500)',  bg: 'var(--primary-50)' },
          { label: 'Overall Attendance', value: '86%', icon: '', color: 'var(--accent-green)', bg: '#d1fae5' },
          { label: 'Fees Due',           value: '₹0',  icon: '', color: 'var(--accent-green)', bg: '#d1fae5' },
        ].map((s, i) => (
          <div key={i} className="stat-card card-hover" style={{ borderTop: `3px solid ${s.color}` }}>
            <div className="stat-icon" style={{ background: s.bg, color: s.color }}>
              <span style={{ fontSize: '1.4rem' }}>{s.icon}</span>
            </div>
            <div className="stat-info">
              <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 24 }} className="card animate-fade-in delay-2">
        <div className="card-body">
          <h2 className="section-title" style={{ marginBottom: 16 }}> Recent Messages from Faculty</h2>
          {[
            { from: 'Dr. Meena Kumari (OS)', msg: 'Arjun performed well in the mid-term exam. Keep it up!', date: 'July 15' },
            { from: 'Prof. Ravi (Web Tech)', msg: 'Please ensure Arjun completes the pending lab record.', date: 'July 12' },
          ].map((m, i) => (
            <div key={i} style={{ padding: '12px', background: 'var(--neutral-50)', borderRadius: 'var(--radius-md)', marginBottom: 10, border: '1px solid var(--border-color)' }}>
              <p style={{ fontWeight: 600, fontSize: '0.875rem' }}>{m.from}</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '4px 0' }}>{m.msg}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{m.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
