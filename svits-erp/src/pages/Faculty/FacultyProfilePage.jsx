import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { MdEdit, MdSave, MdClose, MdEmail, MdPhone, MdLocationOn, MdWork, MdSchool } from 'react-icons/md'
import toast from 'react-hot-toast'
import './FacultyProfilePage.css'

const PERSONAL_FIELDS = [
  { key: 'name',        label: 'Full Name',      icon: MdEdit,        type: 'text' },
  { key: 'email',       label: 'Email',          icon: MdEmail,       type: 'email' },
  { key: 'phone',       label: 'Phone',          icon: MdPhone,       type: 'tel' },
  { key: 'address',     label: 'Address',        icon: MdLocationOn,  type: 'text' },
]

const ACADEMIC_INFO = [
  { label: 'Faculty ID',     key: 'id' },
  { label: 'Department',     key: 'department' },
  { label: 'Designation',    key: 'designation' },
  { label: 'Qualification',  key: 'qualification' },
  { label: 'Experience',     key: 'experience' },
]

export default function FacultyProfilePage() {
  const { user } = useAuth()
  const [editing, setEditing] = useState(false)
  const [activeTab, setActiveTab] = useState('personal')
  const [form, setForm] = useState({ ...user })

  const initials = user?.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  const handleSave = () => {
    toast.success('Profile updated successfully! ')
    setEditing(false)
  }

  const handleCancel = () => {
    setForm({ ...user })
    setEditing(false)
  }

  return (
    <div className="fac-profile-page animate-fade-in" id="faculty-profile-page">
      {/* Profile Banner */}
      <div className="fac-profile-banner animate-fade-in">
        <div className="fac-profile-banner-bg" />
        <div className="fac-profile-banner-content">
          <div className="fac-profile-avatar-wrap">
            <div className="fac-profile-avatar avatar-placeholder" style={{ background: 'var(--gradient-primary)', fontSize: '2rem' }}>
              {initials}
            </div>
            <div className="fac-profile-avatar-badge">‍</div>
          </div>
          <div className="fac-profile-banner-info">
            <h1 className="fac-profile-name">{user?.name}</h1>
            <p className="fac-profile-meta">{user?.designation} · {user?.department}</p>
          </div>
          <div className="fac-profile-actions">
            {!editing ? (
              <button className="btn btn-primary" onClick={() => setEditing(true)}>
                <MdEdit size={17} /> Edit Profile
              </button>
            ) : (
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-success" onClick={handleSave}>
                  <MdSave size={17} /> Save
                </button>
                <button className="btn btn-secondary" onClick={handleCancel}>
                  <MdClose size={17} /> Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="fac-profile-tabs animate-fade-in delay-1">
        {[
          { key: 'personal',  label: ' Personal Info' },
          { key: 'academic',  label: ' Academic Info' },
        ].map(tab => (
          <button
            key={tab.key}
            className={`fac-profile-tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'personal' && (
        <div className="card animate-fade-in">
          <div className="card-body">
            <div className="fac-profile-fields-grid">
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
                    />
                  ) : (
                    <div className="fac-profile-field-value">{user?.[field.key] || '—'}</div>
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
            <div className="fac-profile-fields-grid">
              {ACADEMIC_INFO.map(field => (
                <div key={field.key} className="form-group">
                  <label className="form-label">
                    <MdSchool size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                    {field.label}
                  </label>
                  <div className="fac-profile-field-value" style={{ fontWeight: 600, fontSize: '1rem' }}>
                    {user?.[field.key] || '—'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
