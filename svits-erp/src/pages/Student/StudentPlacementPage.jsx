import { useState } from 'react'
import { MdWork, MdUploadFile, MdLocationCity, MdDateRange, MdCheckCircle, MdCancel } from 'react-icons/md'
import toast from 'react-hot-toast'
import './StudentPlacementPage.css'

const UPCOMING_DRIVES = [
  { id: 1, company: 'Google', role: 'Software Engineer', ctc: '24 LPA', location: 'Hyderabad', date: '25 Aug 2026', eligible: true },
  { id: 2, company: 'TCS Digital', role: 'System Analyst', ctc: '7.5 LPA', location: 'Pan India', date: '10 Sep 2026', eligible: true },
  { id: 3, company: 'Amazon', role: 'SDE-1', ctc: '32 LPA', location: 'Bangalore', date: '15 Sep 2026', eligible: false, reason: 'CGPA Criteria: > 9.0' },
]

export default function StudentPlacementPage() {
  const [resumeUploaded, setResumeUploaded] = useState(false)

  const handleApply = (company) => {
    if (!resumeUploaded) {
      toast.error('Please upload your resume first!')
      return
    }
    toast.success(`Successfully applied to ${company}!`)
  }

  const handleResumeUpload = () => {
    setResumeUploaded(true)
    toast.success('Resume updated successfully!')
  }

  return (
    <div className="student-placement-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title"> Placement Cell</h1>
          <p className="page-subtitle">Track campus drives, apply for jobs, and manage your profile</p>
        </div>
      </div>

      <div className="placement-grid">
        <div className="card placement-profile-card">
          <div className="card-header"><h2 className="section-title">My Placement Profile</h2></div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="placement-stat-row">
              <span>Current CGPA:</span> <strong>8.74</strong>
            </div>
            <div className="placement-stat-row">
              <span>Active Backlogs:</span> <strong style={{ color: 'var(--accent-green)' }}>0</strong>
            </div>
            <div className="placement-stat-row">
              <span>Placement Status:</span> <strong style={{ color: 'var(--accent-orange)' }}>Unplaced</strong>
            </div>

            <div className="placement-resume-section">
              <div className="placement-resume-status">
                {resumeUploaded ? (
                  <span style={{ color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <MdCheckCircle /> Resume Uploaded
                  </span>
                ) : (
                  <span style={{ color: 'var(--accent-red)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <MdCancel /> No Resume Found
                  </span>
                )}
              </div>
              <button className="btn btn-outline" style={{ width: '100%' }} onClick={handleResumeUpload}>
                <MdUploadFile /> Upload New Resume
              </button>
            </div>
          </div>
        </div>

        <div className="placement-drives-section">
          <div className="card">
            <div className="card-header"><h2 className="section-title">Upcoming Campus Drives</h2></div>
            <div className="card-body" style={{ padding: 0 }}>
              <div className="placement-drive-list">
                {UPCOMING_DRIVES.map(drive => (
                  <div key={drive.id} className={`placement-drive-item ${!drive.eligible ? 'ineligible' : ''}`}>
                    <div className="placement-drive-info">
                      <div className="placement-company-logo">
                        <MdLocationCity size={24} color="var(--primary-600)" />
                      </div>
                      <div>
                        <h3 className="placement-company-name">{drive.company}</h3>
                        <p className="placement-company-role">{drive.role}</p>
                        <div className="placement-drive-meta">
                          <span> {drive.ctc}</span>
                          <span><MdLocationCity size={14}/> {drive.location}</span>
                          <span><MdDateRange size={14}/> {drive.date}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="placement-drive-action">
                      {drive.eligible ? (
                        <button className="btn btn-primary" onClick={() => handleApply(drive.company)}>Apply Now</button>
                      ) : (
                        <div className="placement-ineligible-msg">
                          Not Eligible
                          <br/><small>{drive.reason}</small>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
