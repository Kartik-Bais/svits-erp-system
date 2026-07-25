import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useTranslation } from 'react-i18next'
import { FcGoogle } from 'react-icons/fc'
import toast from 'react-hot-toast'
import {
  MdEmail, MdLock, MdVisibility, MdVisibilityOff,
  MdArrowBack, MdSchool, MdPeople, MdAdminPanelSettings, MdFamilyRestroom
} from 'react-icons/md'
import './LoginPage.css'

const ROLES = [
  { key: 'student', label: 'Student', icon: MdSchool, color: 'var(--primary-500)' },
  { key: 'faculty', label: 'Faculty', icon: MdPeople, color: 'var(--accent-green)' },
  { key: 'admin', label: 'Admin', icon: MdAdminPanelSettings, color: 'var(--accent-orange)' },
  { key: 'parent', label: 'Parent', icon: MdFamilyRestroom, color: 'var(--accent-purple)' },
]

export default function LoginPage() {
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [selectedRole, setSelectedRole] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)



  const handleRoleSelect = (roleKey) => {
    setSelectedRole(roleKey)
    setEmail('')
    setPassword('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedRole) {
      toast.error('Please select a role first!')
      return
    }
    if (!email || !password) {
      toast.error('Please fill in all fields.')
      return
    }
    const result = await login(email, password, selectedRole)
    if (result.success) {
      toast.success(`Welcome back!`)
      navigate(`/${selectedRole}/dashboard`)
    } else {
      toast.error(result.error)
    }
  }

  return (
    <div className="login-page" id="login-page">
      {/* Background */}
      <div className="login-bg">
        <div className="login-orb login-orb-1" />
        <div className="login-orb login-orb-2" />
        <div className="login-grid" />
      </div>

      {/* Back button */}
      <Link to="/welcome" className="login-back-btn" id="login-back-btn">
        <MdArrowBack size={18} /> Back
      </Link>

      <div className="login-container">
        {/* Left panel: branding */}
        <div className="login-left animate-fade-in">
          <div className="login-brand">
            <div className="login-brand-badge">
              <span>SVITS erp</span>
            </div>
            <h2 className="login-brand-headline">One Portal.<br />Every Campus Need.</h2>
            <p className="login-brand-sub">
              Manage your academics, attendance, placements, and campus life with the power of AI.
            </p>
          </div>

          {/* Role cards on left */}
          <div className="login-role-showcase">
            {ROLES.map((r, i) => (
              <div key={r.key} className={`login-role-pill animate-fade-in delay-${i + 1}`} style={{ '--role-color': r.color }}>
                <r.icon size={16} />
                {r.label} Portal
              </div>
            ))}
          </div>

          {/* Decorative stats */}
          <div className="login-stats animate-fade-in delay-5">
            <div className="login-stat">
              <span className="login-stat-val">4200+</span>
              <span className="login-stat-lbl">Students</span>
            </div>
            <div className="login-stat-div" />
            <div className="login-stat">
              <span className="login-stat-val">180+</span>
              <span className="login-stat-lbl">Faculty</span>
            </div>
            <div className="login-stat-div" />
            <div className="login-stat">
              <span className="login-stat-val">24+</span>
              <span className="login-stat-lbl">Departments</span>
            </div>
          </div>
        </div>

        {/* Right panel: Form */}
        <div className="login-right animate-slide-left">
          <div className="login-card">
            <div className="login-card-header">
              <h1 className="login-title">{t('sign_in')}</h1>
              <p className="login-subtitle">Select your role and enter your credentials</p>
            </div>

            {/* Role selector */}
            <div className="login-role-grid" id="role-selector">
              {ROLES.map(role => (
                <button
                  key={role.key}
                  className={`login-role-card ${selectedRole === role.key ? 'selected' : ''}`}
                  style={{ '--role-color': role.color }}
                  onClick={() => handleRoleSelect(role.key)}
                  type="button"
                  id={`role-${role.key}`}
                >
                  <span className="login-role-icon">
                    <role.icon size={22} />
                  </span>
                  <span className="login-role-name">{role.label}</span>
                  {selectedRole === role.key && (
                    <span className="login-role-check"></span>
                  )}
                </button>
              ))}
            </div>



            <form onSubmit={handleSubmit} className="login-form" autoComplete="off">
              {/* Email */}
              <div className="form-group">
                <label className="form-label" htmlFor="login-email">{t('email')}</label>
                <div className="input-wrapper">
                  <MdEmail size={18} className="input-icon-left" />
                  <input
                    id="login-email"
                    type="email"
                    className="form-input has-icon-left"
                    placeholder="your.email@svits.ac.in"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    autoComplete="off"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="form-group">
                <label className="form-label" htmlFor="login-password">{t('password')}</label>
                <div className="input-wrapper">
                  <MdLock size={18} className="input-icon-left" />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    className="form-input has-icon-left has-icon-right"
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    className="input-icon-right login-eye-btn"
                    onClick={() => setShowPassword(v => !v)}
                    aria-label="Toggle password"
                  >
                    {showPassword ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
                  </button>
                </div>
              </div>

              {/* Options row */}
              <div className="login-options">
                <label className="login-remember" id="login-remember">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={e => setRemember(e.target.checked)}
                  />
                  <span>{t('remember_me')}</span>
                </label>
                <Link to="/forgot-password" className="login-forgot" id="login-forgot">{t('forgot_password')}</Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="btn btn-primary w-full login-submit"
                disabled={loading}
                id="login-submit-btn"
              >
                {loading ? (
                  <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Signing in...</>
                ) : (
                  t('sign_in')
                )}
              </button>
            </form>

            <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <div style={{ margin: '1rem 0', display: 'flex', alignItems: 'center', color: 'var(--text-tertiary)' }}>
                <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
                <span style={{ padding: '0 10px' }}>OR</span>
                <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
              </div>
              <a 
                href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'}/auth/google`} 
                className="btn w-full" 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '8px', 
                  background: '#fff', 
                  color: '#333', 
                  border: '1px solid #ccc',
                  marginBottom: '1rem'
                }}
              >
                <FcGoogle size={20} />
                Continue with Google
              </a>
              Don't have an account? <Link to="/signup" style={{ color: 'var(--primary-600)', fontWeight: '600', textDecoration: 'none' }}>Sign up</Link>
            </div>

            <p className="login-card-footer">
              SVITS erp
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
