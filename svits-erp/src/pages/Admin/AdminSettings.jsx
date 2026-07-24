import { useState } from 'react'
import { MdSave, MdSettings, MdLanguage, MdSecurity, MdNotifications } from 'react-icons/md'
import toast from 'react-hot-toast'
import './AdminSettings.css'

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('general')

  const handleSave = (e) => {
    e.preventDefault()
    toast.success('Settings saved successfully!')
  }

  return (
    <div className="admin-settings-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">️ System Settings</h1>
          <p className="page-subtitle">Configure ERP preferences and global variables</p>
        </div>
      </div>

      <div className="admin-settings-container">
        <div className="admin-settings-sidebar card">
          <button className={`admin-settings-nav-btn ${activeTab === 'general' ? 'active' : ''}`} onClick={() => setActiveTab('general')}>
            <MdSettings size={20} /> General
          </button>
          <button className={`admin-settings-nav-btn ${activeTab === 'academic' ? 'active' : ''}`} onClick={() => setActiveTab('academic')}>
            <MdLanguage size={20} /> Academic Year
          </button>
          <button className={`admin-settings-nav-btn ${activeTab === 'security' ? 'active' : ''}`} onClick={() => setActiveTab('security')}>
            <MdSecurity size={20} /> Security
          </button>
          <button className={`admin-settings-nav-btn ${activeTab === 'notifications' ? 'active' : ''}`} onClick={() => setActiveTab('notifications')}>
            <MdNotifications size={20} /> Notifications
          </button>
        </div>

        <div className="admin-settings-content card animate-fade-in">
          {activeTab === 'general' && (
            <form onSubmit={handleSave}>
              <h2 className="section-title" style={{ marginBottom: 24 }}>General Settings</h2>
              
              <div className="form-group">
                <label className="form-label">College Name</label>
                <input type="text" className="form-input" defaultValue="Sri Vaishnavi Institute of Technology and Science" />
              </div>
              
              <div className="form-row">
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Contact Email</label>
                  <input type="email" className="form-input" defaultValue="admin@svits.ac.in" />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Contact Phone</label>
                  <input type="text" className="form-input" defaultValue="+91 800 123 4567" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Address</label>
                <textarea className="form-input" rows="3" defaultValue="123 Education Hub, Knowledge City, State - 500001"></textarea>
              </div>

              <div className="admin-settings-actions">
                <button type="submit" className="btn btn-primary"><MdSave size={18} /> Save Changes</button>
              </div>
            </form>
          )}

          {activeTab === 'academic' && (
            <form onSubmit={handleSave}>
              <h2 className="section-title" style={{ marginBottom: 24 }}>Academic Configuration</h2>
              
              <div className="form-group">
                <label className="form-label">Current Academic Year</label>
                <select className="form-input" defaultValue="2025-2026">
                  <option>2024-2025</option>
                  <option>2025-2026</option>
                  <option>2026-2027</option>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Odd Semester Start</label>
                  <input type="date" className="form-input" defaultValue="2025-07-15" />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Even Semester Start</label>
                  <input type="date" className="form-input" defaultValue="2026-01-15" />
                </div>
              </div>

              <div className="admin-settings-actions">
                <button type="submit" className="btn btn-primary"><MdSave size={18} /> Save Changes</button>
              </div>
            </form>
          )}
          
          {(activeTab === 'security' || activeTab === 'notifications') && (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
              <h3>Settings under development</h3>
              <p>These options will be available in the next system update.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
