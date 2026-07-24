import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { MdEdit, MdSave, MdClose, MdEmail, MdPhone, MdLocationOn,
         MdBloodtype, MdCake, MdPerson, MdSchool, MdEmojiEvents } from 'react-icons/md'
import toast from 'react-hot-toast'
import './ProfilePage.css'

const BADGES = [
  { id: 1, icon: '', name: '100% Attendance',      desc: 'Perfect attendance in a subject',          earned: true,  color: '#10b981', bg: '#d1fae5', date: 'May 2025' },
  { id: 2, icon: '', name: 'Early Submitter',        desc: 'Submitted 5 assignments before deadline',  earned: true,  color: '#f59e0b', bg: '#fef3c7', date: 'Jun 2025' },
  { id: 3, icon: '', name: 'Consistent Performer',   desc: 'CGPA above 8.5 for 3 semesters',          earned: true,  color: '#4F8EF7', bg: 'var(--primary-50)', date: 'Jul 2025' },
  { id: 4, icon: '', name: 'Top Coder',              desc: 'Scored A+ in a programming subject',       earned: true,  color: '#8b5cf6', bg: '#ede9fe', date: 'Jun 2025' },
  { id: 5, icon: '', name: 'Assignment Ace',          desc: 'Full marks in 3 consecutive assignments',  earned: true,  color: '#ec4899', bg: '#fce7f3', date: 'Jul 2025' },
  { id: 6, icon: '', name: '7-Day Streak',           desc: 'Logged in 7 days in a row',               earned: false, color: '#ef4444', bg: '#fee2e2', date: null },
  { id: 7, icon: '', name: 'Library Regular',         desc: 'Borrowed 10+ books from library',          earned: false, color: '#06b6d4', bg: '#cffafe', date: null },
  { id: 8, icon: '', name: 'Semester Topper',         desc: 'Rank #1 in the class for a semester',      earned: false, color: '#f59e0b', bg: '#fef3c7', date: null },
]

const PERSONAL_FIELDS = [
  { key: 'name',        label: 'Full Name',      icon: MdPerson,      type: 'text' },
  { key: 'email',       label: 'Email',          icon: MdEmail,       type: 'email' },
  { key: 'phone',       label: 'Phone',          icon: MdPhone,       type: 'tel' },
  { key: 'dob',         label: 'Date of Birth',  icon: MdCake,        type: 'date' },
  { key: 'bloodGroup',  label: 'Blood Group',    icon: MdBloodtype,   type: 'text' },
  { key: 'address',     label: 'Address',        icon: MdLocationOn,  type: 'text' },
  { key: 'fatherName',  label: 'Father\'s Name', icon: MdPerson,      type: 'text' },
  { key: 'motherName',  label: 'Mother\'s Name', icon: MdPerson,      type: 'text' },
]

const ACADEMIC_INFO = [
  { label: 'Roll Number',    key: 'rollNo' },
  { label: 'Branch',         key: 'branch' },
  { label: 'Semester',       key: 'semester' },
  { label: 'Current CGPA',   key: 'cgpa' },
  { label: 'Year',           key: 'year' },
  { label: 'Department',     key: 'department' },
]

export default function ProfilePage() {
  const { user } = useAuth()
  const [editing, setEditing] = useState(false)
  const [activeTab, setActiveTab] = useState('personal') // personal | academic | badges
  const [form, setForm] = useState({ ...user })

  const initials = user?.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  const earnedCount = BADGES.filter(b => b.earned).length

  const handleSave = () => {
    toast.success('Profile updated successfully! ')
    setEditing(false)
  }

  const handleCancel = () => {
    setForm({ ...user })
    setEditing(false)
  }

  return (
    <div className="profile-page" id="profile-page">
      {/* Profile Banner */}
      <div className="profile-banner animate-fade-in">
        <div className="profile-banner-bg" />
        <div className="profile-banner-content">
          <div className="profile-avatar-wrap">
            <div className="profile-avatar avatar-placeholder" style={{ background: 'var(--gradient-primary)', fontSize: '2rem' }}>
              {initials}
            </div>
            <div className="profile-avatar-badge"></div>
          </div>
          <div className="profile-banner-info">
            <h1 className="profile-name">{user?.name}</h1>
            <p className="profile-meta">{user?.rollNo} · {user?.branch} · {user?.semester} Semester</p>
            <div className="profile-badges-mini">
              {BADGES.filter(b => b.earned).slice(0, 5).map(b => (
                <span key={b.id} title={b.name} className="profile-mini-badge" style={{ background: b.bg, color: b.color }}>
                  {b.icon}
                </span>
              ))}
              {earnedCount > 5 && <span className="profile-mini-badge" style={{ background: 'var(--neutral-100)', color: 'var(--text-secondary)' }}>+{earnedCount - 5}</span>}
            </div>
          </div>
          <div className="profile-actions">
            {!editing ? (
              <button className="btn btn-primary" onClick={() => setEditing(true)} id="profile-edit-btn">
                <MdEdit size={17} /> Edit Profile
              </button>
            ) : (
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-success" onClick={handleSave} id="profile-save-btn">
                  <MdSave size={17} /> Save
                </button>
                <button className="btn btn-secondary" onClick={handleCancel} id="profile-cancel-btn">
                  <MdClose size={17} /> Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="profile-tabs animate-fade-in delay-1">
        {[
          { key: 'personal',  label: ' Personal Info' },
          { key: 'academic',  label: ' Academic Info' },
          { key: 'badges',    label: ` Achievements (${earnedCount}/${BADGES.length})` },
        ].map(tab => (
          <button
            key={tab.key}
            className={`profile-tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
            id={`profile-tab-${tab.key}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'personal' && (
        <div className="card animate-fade-in">
          <div className="card-body">
            <div className="profile-fields-grid">
              {PERSONAL_FIELDS.map(field => (
                <div key={field.key} className="form-group">
                  <label className="form-label">
                    <field.icon size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                    {field.label}
                  </label>
                  {editing ? (
                    <input
                      type={field.type}
                      className="form-input"
                      value={form[field.key] || ''}
                      onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                      id={`field-${field.key}`}
                    />
                  ) : (
                    <div className="profile-field-value">{user?.[field.key] || '—'}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'academic' && (
        <div className="card animate-fade-in">
          <div className="card-body">
            <div className="profile-fields-grid">
              {ACADEMIC_INFO.map(field => (
                <div key={field.key} className="form-group">
                  <label className="form-label">
                    <MdSchool size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                    {field.label}
                  </label>
                  <div className="profile-field-value" style={{ fontWeight: 600, fontSize: '1rem' }}>
                    {field.key === 'cgpa' ? (
                      <span style={{ color: 'var(--primary-600)', fontSize: '1.25rem', fontFamily: 'var(--font-heading)', fontWeight: 700 }}>
                        {user?.[field.key]} / 10
                      </span>
                    ) : user?.[field.key] || '—'}
                  </div>
                </div>
              ))}
            </div>

            {/* CGPA visual */}
            <div className="profile-cgpa-bar" style={{ marginTop: 24 }}>
              <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
                <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>CGPA Progress</span>
                <span style={{ fontWeight: 700, color: 'var(--primary-600)', fontFamily: 'var(--font-heading)' }}>8.74 / 10</span>
              </div>
              <div className="sd-attend-track" style={{ height: 12 }}>
                <div className="sd-attend-fill" style={{ width: '87.4%', background: 'var(--gradient-primary)' }} />
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 6 }}>
                You need 0.26 more CGPA to reach 9.0 — keep up the excellent work!
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'badges' && (
        <div className="animate-fade-in">
          <div className="badges-header">
            <p className="badges-subtitle">
              You've earned <strong style={{ color: 'var(--primary-600)' }}>{earnedCount}</strong> out of {BADGES.length} available badges.
              Keep performing to unlock more! 
            </p>
          </div>
          <div className="badges-grid">
            {BADGES.map((b, i) => (
              <div
                key={b.id}
                className={`badge-card animate-fade-in ${!b.earned ? 'locked' : ''}`}
                style={{ animationDelay: `${i * 0.07}s`, '--b-color': b.color, '--b-bg': b.bg }}
              >
                <div className="badge-icon-wrap" style={{ background: b.earned ? b.bg : 'var(--neutral-100)' }}>
                  <span className="badge-icon">{b.icon}</span>
                  {!b.earned && <div className="badge-lock"></div>}
                </div>
                <div className="badge-info">
                  <p className="badge-name" style={{ color: b.earned ? 'var(--text-primary)' : 'var(--text-muted)' }}>{b.name}</p>
                  <p className="badge-desc">{b.desc}</p>
                  {b.earned && b.date && (
                    <p className="badge-date">Earned: {b.date}</p>
                  )}
                  {!b.earned && (
                    <p className="badge-locked-text"> Not yet unlocked</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
