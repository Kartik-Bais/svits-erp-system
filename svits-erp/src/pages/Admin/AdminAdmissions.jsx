import { useState } from 'react'
import { MdSearch, MdCheckCircle, MdCancel, MdWarning, MdArrowForward } from 'react-icons/md'
import toast from 'react-hot-toast'
import './AdminAdmissions.css'

const MOCK_APPLICANTS = [
  { id: 'APP2026-001', name: 'Rajesh Kumar', course: 'B.Tech CSE', score: '92%', status: 'Applied', date: '18 Jul 2026' },
  { id: 'APP2026-002', name: 'Simran Kaur', course: 'MBA', score: '88%', status: 'Under Review', date: '17 Jul 2026' },
  { id: 'APP2026-003', name: 'Amit Singh', course: 'B.Tech IT', score: '74%', status: 'Applied', date: '16 Jul 2026' },
  { id: 'APP2026-004', name: 'Neha Gupta', course: 'M.Tech CSE', score: '95%', status: 'Admitted', date: '15 Jul 2026' },
  { id: 'APP2026-005', name: 'Karan Patel', course: 'B.Tech ECE', score: '62%', status: 'Rejected', date: '14 Jul 2026' },
]

export default function AdminAdmissions() {
  const [activeTab, setActiveTab] = useState('Applied')
  const [applicants, setApplicants] = useState(MOCK_APPLICANTS)

  const filteredApplicants = applicants.filter(a => a.status === activeTab || activeTab === 'All')

  const handleStatusChange = (id, newStatus) => {
    setApplicants(applicants.map(a => a.id === id ? { ...a, status: newStatus } : a))
    toast.success(`Applicant ${id} moved to ${newStatus}`)
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'Applied': return 'var(--primary-500)'
      case 'Under Review': return 'var(--accent-orange)'
      case 'Admitted': return 'var(--accent-green)'
      case 'Rejected': return 'var(--accent-red)'
      default: return 'var(--text-muted)'
    }
  }

  return (
    <div className="admin-admissions-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title"> Admissions Portal</h1>
          <p className="page-subtitle">Manage new applications and enrollment pipeline</p>
        </div>
      </div>

      <div className="admin-admissions-stats">
        {[
          { label: 'Total Applications', value: applicants.length },
          { label: 'Under Review', value: applicants.filter(a => a.status === 'Under Review').length },
          { label: 'Admitted', value: applicants.filter(a => a.status === 'Admitted').length },
        ].map((s, i) => (
          <div key={i} className="card admin-admission-stat">
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="admin-admissions-tabs">
          {['All', 'Applied', 'Under Review', 'Admitted', 'Rejected'].map(tab => (
            <button 
              key={tab}
              className={`admin-adm-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="admin-admissions-list">
          {filteredApplicants.map((app, i) => (
            <div key={app.id} className="admin-adm-card animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="admin-adm-info">
                <div className="admin-adm-avatar">{app.name.charAt(0)}</div>
                <div>
                  <h3 className="admin-adm-name">{app.name}</h3>
                  <div className="admin-adm-meta">
                    <span>{app.id}</span> • <span>{app.course}</span> • <span>Score: {app.score}</span>
                  </div>
                </div>
              </div>
              
              <div className="admin-adm-status">
                <span className="badge" style={{ backgroundColor: getStatusColor(app.status), color: '#fff' }}>
                  {app.status}
                </span>
                <span className="admin-adm-date">{app.date}</span>
              </div>

              <div className="admin-adm-actions">
                {app.status === 'Applied' && (
                  <button className="btn btn-outline btn-sm" onClick={() => handleStatusChange(app.id, 'Under Review')}>
                    Review <MdArrowForward />
                  </button>
                )}
                {app.status === 'Under Review' && (
                  <>
                    <button className="btn btn-success btn-sm" onClick={() => handleStatusChange(app.id, 'Admitted')}>
                      <MdCheckCircle /> Admit
                    </button>
                    <button className="btn btn-outline-danger btn-sm" onClick={() => handleStatusChange(app.id, 'Rejected')}>
                      <MdCancel /> Reject
                    </button>
                  </>
                )}
                <button className="btn btn-secondary btn-sm">View Details</button>
              </div>
            </div>
          ))}
          {filteredApplicants.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No applicants found for this status.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
