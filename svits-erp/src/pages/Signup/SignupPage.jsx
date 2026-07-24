import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'
import {
  MdEmail, MdLock, MdVisibility, MdVisibilityOff, MdPerson,
  MdArrowBack, MdSchool, MdPeople, MdAdminPanelSettings, MdFamilyRestroom
} from 'react-icons/md'
import '../Login/LoginPage.css' // Reusing LoginPage styles to keep it identical

const ROLES = [
  { key: 'student', label: 'Student', icon: MdSchool, color: 'var(--primary-500)' },
  { key: 'faculty', label: 'Faculty', icon: MdPeople, color: 'var(--accent-green)' },
  { key: 'admin', label: 'Admin', icon: MdAdminPanelSettings, color: 'var(--accent-orange)' },
  { key: 'parent', label: 'Parent', icon: MdFamilyRestroom, color: 'var(--accent-purple)' },
]

export default function SignupPage() {
  const { signup, loading } = useAuth()
  const navigate = useNavigate()

  const [selectedRole, setSelectedRole] = useState(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleRoleSelect = (roleKey) => {
    setSelectedRole(roleKey)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedRole) {
      toast.error('Please select a role first!')
      return
    }
    if (!name || !email || !password) {
      toast.error('Please fill in all fields.')
      return
    }

    const result = await signup(name, email, password, selectedRole)
    if (result.success) {
      toast.success('Account created successfully!')
      navigate(`/${selectedRole}/dashboard`)
    } else {
      toast.error(result.error || 'Failed to sign up.')
    }
  }

  return (
    <div className="login-page" id="signup-page">
      {/* Background */}
      <div className="login-bg">
        <div className="login-orb login-orb-1" />
        <div className="login-orb login-orb-2" />
        <div className="login-grid" />
      </div>

      {/* Back button */}
      <Link to="/login" className="login-back-btn" id="signup-back-btn">
        <MdArrowBack size={18} /> Back to Login
      </Link>

      <div className="login-container">
        {/* Left panel: branding */}
        <div className="login-left animate-fade-in">
          <div className="login-brand">
            <div className="login-brand-badge">
              <span>SVITS erp</span>
            </div>
            <h2 className="login-brand-headline">Join the Campus<br />Digital Hub.</h2>
            <p className="login-brand-sub">
              Create an account to access academics, attendance, placements, and more.
            </p>
          </div>

          <div className="login-role-showcase">
            {ROLES.map((r, i) => (
              <div key={r.key} className={`login-role-pill animate-fade-in delay-${i + 1}`} style={{ '--role-color': r.color }}>
                <r.icon size={16} />
                {r.label} Portal
              </div>
            ))}
          </div>

          <div className="login-stats animate-fade-in delay-5">
            <div className="login-stat">
              <span className="login-stat-val">Fast</span>
              <span className="login-stat-lbl">Setup</span>
            </div>
            <div className="login-stat-div" />
            <div className="login-stat">
              <span className="login-stat-val">Secure</span>
              <span className="login-stat-lbl">Data</span>
            </div>
            <div className="login-stat-div" />
            <div className="login-stat">
              <span className="login-stat-val">24/7</span>
              <span className="login-stat-lbl">Access</span>
            </div>
          </div>
        </div>

        {/* Right panel: Form */}
        <div className="login-right animate-slide-left">
          <div className="login-card">
            <div className="login-card-header">
              <h1 className="login-title">Create Account</h1>
              <p className="login-subtitle">Select your role and enter your details</p>
            </div>

            {/* Role selector */}
            <div className="login-role-grid" id="signup-role-selector">
              {ROLES.map(role => (
                <button
                  key={role.key}
                  className={`login-role-card ${selectedRole === role.key ? 'selected' : ''}`}
                  style={{ '--role-color': role.color }}
                  onClick={() => handleRoleSelect(role.key)}
                  type="button"
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
              {/* Full Name */}
              <div className="form-group">
                <label className="form-label" htmlFor="signup-name">Full Name</label>
                <div className="input-wrapper">
                  <MdPerson size={18} className="input-icon-left" />
                  <input
                    id="signup-name"
                    type="text"
                    className="form-input has-icon-left"
                    placeholder="John Doe"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="form-group">
                <label className="form-label" htmlFor="signup-email">Email Address</label>
                <div className="input-wrapper">
                  <MdEmail size={18} className="input-icon-left" />
                  <input
                    id="signup-email"
                    type="email"
                    className="form-input has-icon-left"
                    placeholder="your.email@svits.ac.in"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="form-group">
                <label className="form-label" htmlFor="signup-password">Password</label>
                <div className="input-wrapper">
                  <MdLock size={18} className="input-icon-left" />
                  <input
                    id="signup-password"
                    type={showPassword ? 'text' : 'password'}
                    className="form-input has-icon-left has-icon-right"
                    placeholder="Create a password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="input-icon-right login-eye-btn"
                    onClick={() => setShowPassword(v => !v)}
                  >
                    {showPassword ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full login-submit"
                disabled={loading}
              >
                {loading ? (
                  <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Creating account...</>
                ) : (
                  'Sign Up'
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
                href="http://localhost:5000/api/v1/auth/google" 
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
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" style={{ width: 18, height: 18 }} />
                Sign up with Google
              </a>
              Already have an account? <Link to="/login" style={{ color: 'var(--primary-600)', fontWeight: '600', textDecoration: 'none' }}>Sign in</Link>
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
