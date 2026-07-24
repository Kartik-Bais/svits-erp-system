import { useState } from 'react'
import { MdTrendingUp, MdDownload, MdStar } from 'react-icons/md'
import './ParentResultsPage.css'

const SEMESTERS = [
  { id: 1, name: 'Semester 1', sgpa: 8.5 },
  { id: 2, name: 'Semester 2', sgpa: 8.2 },
  { id: 3, name: 'Semester 3', sgpa: 8.8 },
  { id: 4, name: 'Semester 4', sgpa: 8.6 },
  { id: 5, name: 'Semester 5', sgpa: 8.9 },
]

const CURRENT_SEM_MARKS = [
  { subject: 'Operating Systems', marks: 88, max: 100, grade: 'A+' },
  { subject: 'Web Technologies', marks: 92, max: 100, grade: 'O' },
  { subject: 'Design & Analysis of Algorithms', marks: 85, max: 100, grade: 'A+' },
  { subject: 'Software Engineering', marks: 78, max: 100, grade: 'A' },
  { subject: 'Database Systems Lab', marks: 95, max: 100, grade: 'O' },
]

export default function ParentResultsPage() {
  const [activeSem, setActiveSem] = useState(5)

  return (
    <div className="parent-res-page animate-fade-in" id="parent-results-page">
      <div className="page-header">
        <div>
          <h1 className="page-title"> Academic Results</h1>
          <p className="page-subtitle">Track your child's academic performance</p>
        </div>
      </div>

      <div className="parent-res-overview card animate-fade-in">
        <div className="parent-res-overview-content">
          <div className="parent-res-cgpa-block">
            <div className="parent-res-cgpa-icon">
              <MdStar size={32} color="#f59e0b" />
            </div>
            <div>
              <div className="parent-res-cgpa-label">Current CGPA</div>
              <div className="parent-res-cgpa-value">8.74 <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ 10</span></div>
            </div>
          </div>
          <div className="parent-res-trend">
            <MdTrendingUp size={24} color="var(--accent-green)" />
            <span>Consistent Performance</span>
          </div>
        </div>
      </div>

      <div className="card animate-fade-in delay-1">
        <div className="card-header parent-res-sem-tabs">
          {SEMESTERS.map(sem => (
            <button 
              key={sem.id} 
              className={`parent-res-sem-tab ${activeSem === sem.id ? 'active' : ''}`}
              onClick={() => setActiveSem(sem.id)}
            >
              {sem.name}
              <span className="parent-res-sem-sgpa">SGPA: {sem.sgpa}</span>
            </button>
          ))}
        </div>
        
        <div className="card-body" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 className="section-title">Semester {activeSem} Grade Sheet</h3>
            <button className="btn btn-outline btn-sm">
              <MdDownload size={16} /> Download Marksheet
            </button>
          </div>

          <div className="parent-res-table-wrapper">
            <table className="parent-res-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th style={{ textAlign: 'center' }}>Marks Obtained</th>
                  <th style={{ textAlign: 'center' }}>Max Marks</th>
                  <th style={{ textAlign: 'center' }}>Grade</th>
                </tr>
              </thead>
              <tbody>
                {CURRENT_SEM_MARKS.map((m, i) => (
                  <tr key={i} className="animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                    <td style={{ fontWeight: 600 }}>{m.subject}</td>
                    <td style={{ textAlign: 'center', fontWeight: 600, color: 'var(--primary-600)' }}>{m.marks}</td>
                    <td style={{ textAlign: 'center', color: 'var(--text-muted)' }}>{m.max}</td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`badge ${m.grade === 'O' ? 'badge-success' : 'badge-primary'}`}>
                        {m.grade}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
