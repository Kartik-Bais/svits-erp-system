import { MdPeople, MdPerson, MdBusiness, MdLibraryBooks, MdAdminPanelSettings } from 'react-icons/md'

const STATS = [
  { label: 'Total Students', value: '4,218', icon: <MdPeople />, color: 'var(--primary-500)',  bg: 'var(--primary-50)' },
  { label: 'Total Faculty',  value: '184',   icon: <MdPerson />, color: 'var(--accent-green)', bg: '#d1fae5' },
  { label: 'Departments',    value: '24',    icon: <MdBusiness />, color: 'var(--accent-purple)', bg: '#ede9fe' },
  { label: 'Active Courses', value: '312',   icon: <MdLibraryBooks />, color: 'var(--accent-orange)', bg: '#fef3c7' },
]

export default function AdminDashboard() {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title"><MdAdminPanelSettings style={{verticalAlign: 'middle', marginRight: 8, color: 'var(--primary-500)'}}/> Admin Control Center</h1>
        <p className="page-subtitle">Sri Vaishnavi Institute of Technology and Science — System Overview</p>
      </div>
      <div className="grid-4 animate-fade-in">
        {STATS.map((s, i) => (
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
      <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }} className="animate-fade-in delay-2">
        <div className="card">
          <div className="card-header"><h2 className="section-title">Recent Admissions</h2></div>
          <div className="card-body">
            {['Priya Nair — B.Tech CSE', 'Rahul Verma — MBA', 'Sneha Reddy — M.Tech IT'].map((s, i) => (
              <div key={i} style={{ padding: '10px 0', borderBottom: i < 2 ? '1px solid var(--border-color)' : 'none', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 500 }}>{s}</span>
                <span className="badge badge-success">Admitted</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="card-header"><h2 className="section-title">System Alerts</h2></div>
          <div className="card-body">
            {[
              { msg: '28 students below 75% attendance', type: 'danger' },
              { msg: 'Fee defaulters: 142 students', type: 'warning' },
              { msg: 'Exam schedule published for Sem 6', type: 'primary' },
            ].map((a, i) => (
              <div key={i} style={{ padding: '10px 0', borderBottom: i < 2 ? '1px solid var(--border-color)' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.875rem' }}>{a.msg}</span>
                <span className={`badge badge-${a.type}`}>{a.type === 'danger' ? 'Alert' : a.type === 'warning' ? 'Warn' : 'Info'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
