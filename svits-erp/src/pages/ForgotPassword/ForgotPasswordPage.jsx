import { useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { MdEmail, MdArrowBack } from 'react-icons/md'
import '../Login/LoginPage.css'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) {
      toast.error('Please enter your email address.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('http://localhost:5000/api/v1/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const data = await res.json()
      
      if (res.ok && data.success) {
        setSubmitted(true)
        toast.success('Password reset link sent to your email!')
      } else {
        toast.error(data.error || 'Failed to send reset link.')
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

      <Link to="/login" className="login-back-btn">
        <MdArrowBack size={18} /> Back to Login
      </Link>

      <div className="login-container" style={{ maxWidth: '500px', margin: '0 auto' }}>
        <div className="login-right animate-slide-left" style={{ width: '100%', flex: 'none' }}>
          <div className="login-card">
            <div className="login-card-header">
              <h1 className="login-title">Forgot Password?</h1>
              <p className="login-subtitle">
                Enter your registered email address and we'll send you a link to reset your password.
              </p>
            </div>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <div style={{ width: 64, height: 64, background: 'rgba(79, 142, 247, 0.1)', color: 'var(--primary-500)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                  <MdEmail size={32} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Check your email</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                  We've sent a password reset link to <strong>{email}</strong>.
                </p>
                <Link to="/login" className="btn btn-primary w-full">Return to Login</Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                  <label className="form-label" htmlFor="reset-email">Email Address</label>
                  <div className="input-wrapper">
                    <MdEmail size={18} className="input-icon-left" />
                    <input
                      id="reset-email"
                      type="email"
                      className="form-input has-icon-left"
                      placeholder="your.email@svits.ac.in"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-full login-submit"
                  disabled={loading}
                >
                  {loading ? (
                    <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Sending Link...</>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </form>
            )}

            <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Remember your password? <Link to="/login" style={{ color: 'var(--primary-600)', fontWeight: '600', textDecoration: 'none' }}>Sign in</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
