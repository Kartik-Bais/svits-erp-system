import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import './SplashPage.css'

export default function SplashPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    const timer = setTimeout(() => {
      if (user) {
        navigate(`/${user.role}/dashboard`, { replace: true })
      } else {
        navigate('/welcome', { replace: true })
      }
    }, 2800)
    return () => clearTimeout(timer)
  }, [user, navigate])

  return (
    <div className="splash-page" id="splash-screen">
      {/* Animated background orbs */}
      <div className="splash-orb splash-orb-1" />
      <div className="splash-orb splash-orb-2" />
      <div className="splash-orb splash-orb-3" />

      <div className="splash-content">
        {/* Logo animation */}
        <div className="splash-logo-ring">
          <div className="splash-logo-inner">
            <span className="splash-logo-text">SVITS</span>
          </div>
        </div>

        <h1 className="splash-title">ERP<span className="splash-plus">+</span></h1>
        <p className="splash-subtitle">AI-Powered College Management Platform</p>

        {/* Loading dots */}
        <div className="splash-dots">
          <span className="splash-dot" style={{ animationDelay: '0s' }} />
          <span className="splash-dot" style={{ animationDelay: '0.2s' }} />
          <span className="splash-dot" style={{ animationDelay: '0.4s' }} />
        </div>

        <p className="splash-institute">
          Sri Vaishnavi Institute of Technology and Science
        </p>
      </div>

      {/* Bottom tagline */}
      <p className="splash-tagline">Shaping Tomorrow's Leaders Today</p>
    </div>
  )
}
