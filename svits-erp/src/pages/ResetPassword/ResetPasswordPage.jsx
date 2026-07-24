import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { MdLock, MdVisibility, MdVisibilityOff } from 'react-icons/md'
import '../Login/LoginPage.css'

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!token) {
      toast.error('Invalid or missing reset token.')
      return
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match!')
      return
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters long.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`http://localhost:5000/api/v1/auth/reset-password/${token}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })
      const data = await res.json()
      
      if (res.ok && data.success) {
        toast.success('Password reset successfully! Please login with your new password.')
        navigate('/login')
      } else {
        toast.error(data.error || 'Failed to reset password. The link might be expired.')
      }
    } catch (err) {
      toast.error('Network error. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-bg">
        <div className="login-orb login-orb-1" />
        <div className="login-orb login-orb-2" />
        <div className="login-grid" />
      </div>

      <div className="login-container" style={{ maxWidth: '500px', margin: '0 auto' }}>
        <div className="login-right animate-slide-left" style={{ width: '100%', flex: 'none' }}>
          <div className="login-card">
            <div className="login-card-header">
              <h1 className="login-title">Create New Password</h1>
              <p className="login-subtitle">
                Please enter your new password below.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              {/* New Password */}
              <div className="form-group">
                <label className="form-label" htmlFor="new-password">New Password</label>
                <div className="input-wrapper">
                  <MdLock size={18} className="input-icon-left" />
                  <input
                    id="new-password"
                    type={showPassword ? 'text' : 'password'}
                    className="form-input has-icon-left has-icon-right"
                    placeholder="Enter new password"
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

              {/* Confirm Password */}
              <div className="form-group">
                <label className="form-label" htmlFor="confirm-password">Confirm Password</label>
                <div className="input-wrapper">
                  <MdLock size={18} className="input-icon-left" />
                  <input
                    id="confirm-password"
                    type={showConfirm ? 'text' : 'password'}
                    className="form-input has-icon-left has-icon-right"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="input-icon-right login-eye-btn"
                    onClick={() => setShowConfirm(v => !v)}
                  >
                    {showConfirm ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full login-submit"
                disabled={loading}
              >
                {loading ? (
                  <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Resetting...</>
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>

            <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Return to <Link to="/login" style={{ color: 'var(--primary-600)', fontWeight: '600', textDecoration: 'none' }}>Login</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
