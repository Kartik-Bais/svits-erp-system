import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import {
  MdNotifications, MdSearch, MdMenu, MdClose,
  MdLanguage, MdSunny, MdDarkMode, MdOutlineKeyboardArrowDown,
  MdPerson, MdSettings, MdLogout
} from 'react-icons/md'
import { useTheme } from '../../hooks/useTheme'
import './Navbar.css'

const NOTIFICATION_MOCK = [
  { id: 1, title: 'Assignment Due', msg: 'DSA Assignment due tomorrow', time: '2h ago', unread: true, color: 'var(--accent-orange)' },
  { id: 2, title: 'Attendance Alert', msg: 'Your attendance dropped below 75%', time: '5h ago', unread: true, color: 'var(--accent-red)' },
  { id: 3, title: 'Result Published', msg: 'Semester 5 results are now available', time: '1d ago', unread: false, color: 'var(--accent-green)' },
  { id: 4, title: 'Fee Reminder', msg: 'Semester fee due on July 31st', time: '2d ago', unread: false, color: 'var(--primary-500)' },
]

export default function Navbar({ onMenuToggle, sidebarCollapsed, className }) {
  const { user } = useAuth()
  const { t, i18n } = useTranslation()
  const { theme, toggleTheme } = useTheme()
  const [notifOpen, setNotifOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const navigate = useNavigate()
  
  const { logout } = useAuth()

  const unreadCount = NOTIFICATION_MOCK.filter(n => n.unread).length
  const initials = user?.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  const toggleLang = (lng) => {
    i18n.changeLanguage(lng)
    localStorage.setItem('svits-lang', lng)
    setLangOpen(false)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const getGreeting = () => {
    const h = new Date().getHours()
    if (h < 12) return t('good_morning')
    if (h < 17) return t('good_afternoon')
    return t('good_evening')
  }

  return (
    <header className={`navbar ${className || ''}`} id="main-navbar">
      <div className="navbar-left">
        <button className="navbar-menu-btn" onClick={onMenuToggle} aria-label="Toggle menu" id="navbar-menu-btn">
          <MdMenu size={22} />
        </button>
        <div className="navbar-greeting">
          <span className="navbar-greeting-text">{getGreeting()}, </span>
          <span className="navbar-greeting-name">{user?.name.split(' ')[0]}!</span>
        </div>
      </div>

      <div className="navbar-right">
        {/* Search */}
        <div className={`navbar-search-wrapper ${searchOpen ? 'open' : ''}`} id="navbar-search">
          <button className="navbar-icon-btn" onClick={() => setSearchOpen(o => !o)} aria-label="Search">
            {searchOpen ? <MdClose size={20} /> : <MdSearch size={20} />}
          </button>
          {searchOpen && (
            <input
              className="navbar-search-input"
              placeholder="Search anything..."
              autoFocus
            />
          )}
        </div>

        {/* Theme Toggle */}
        <button 
          className="navbar-icon-btn" 
          onClick={toggleTheme} 
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <MdSunny size={20} /> : <MdDarkMode size={20} />}
        </button>

        {/* Language */}
        <div className="navbar-dropdown-wrapper" id="navbar-language">
          <button
            className="navbar-icon-btn"
            onClick={() => { setLangOpen(o => !o); setNotifOpen(false) }}
            aria-label="Language"
          >
            <MdLanguage size={20} />
          </button>
          {langOpen && (
            <div className="navbar-dropdown animate-scale-in">
              <p className="navbar-dropdown-title">{t('language')}</p>
              <button
                className={`navbar-lang-item ${i18n.language === 'en' ? 'active' : ''}`}
                onClick={() => toggleLang('en')}
              >English</button>
              <button
                className={`navbar-lang-item ${i18n.language === 'hi' ? 'active' : ''}`}
                onClick={() => toggleLang('hi')}
              >हिन्दी</button>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="navbar-dropdown-wrapper" id="navbar-notifications">
          <button
            className="navbar-icon-btn notif-btn"
            onClick={() => { setNotifOpen(o => !o); setLangOpen(false) }}
            aria-label="Notifications"
          >
            <MdNotifications size={22} />
            {unreadCount > 0 && (
              <span className="notif-badge">{unreadCount}</span>
            )}
          </button>
          {notifOpen && (
            <div className="navbar-dropdown notif-dropdown animate-scale-in">
              <div className="notif-header">
                <p className="navbar-dropdown-title">{t('notifications')}</p>
                <span className="badge badge-primary">{unreadCount} New</span>
              </div>
              <div className="notif-list">
                {NOTIFICATION_MOCK.map(n => (
                  <div key={n.id} className={`notif-item ${n.unread ? 'unread' : ''}`}>
                    <div className="notif-dot" style={{ background: n.color }} />
                    <div className="notif-content">
                      <p className="notif-title">{n.title}</p>
                      <p className="notif-msg">{n.msg}</p>
                      <p className="notif-time">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="notif-footer">
                <button className="btn btn-outline btn-sm w-full">{t('view_all')}</button>
              </div>
            </div>
          )}
        </div>

        {/* Profile chip */}
        <div className="navbar-dropdown-wrapper" id="navbar-profile-dropdown">
          <div 
            className="navbar-profile" 
            id="navbar-profile"
            onClick={() => { setProfileOpen(o => !o); setNotifOpen(false); setLangOpen(false); }}
          >
            <div className="avatar-placeholder avatar-sm" style={{
              background: 'var(--gradient-primary)',
              fontSize: '0.75rem'
            }}>
              {initials}
            </div>
            <div className="navbar-profile-info">
              <p className="navbar-profile-name">{user?.name.split(' ')[0]}</p>
              <p className="navbar-profile-role">{t(`role_${user?.role}`, user?.role)}</p>
            </div>
            <MdOutlineKeyboardArrowDown size={16} color="var(--text-muted)" style={{ transform: profileOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'all 0.2s' }} />
          </div>

          {profileOpen && (
            <div className="navbar-dropdown profile-dropdown animate-scale-in">
              <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid var(--border-color)', marginBottom: 8 }}>
                <p style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{user?.name}</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{user?.email || `${user?.name.split(' ')[0].toLowerCase()}@svits.edu`}</p>
              </div>
              <button className="profile-item" onClick={() => { setProfileOpen(false); navigate(`/${user?.role}/profile`); }}>
                <MdPerson size={18} /> My Profile
              </button>
              <button className="profile-item" onClick={() => { setProfileOpen(false); }}>
                <MdSettings size={18} /> Settings
              </button>
              <div style={{ height: 1, background: 'var(--border-color)', margin: '8px 0' }} />
              <button className="profile-item danger" onClick={handleLogout}>
                <MdLogout size={18} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
