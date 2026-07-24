import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useTranslation } from 'react-i18next'
import {
  MdDashboard, MdPeople, MdSchedule, MdAssignment,
  MdBarChart, MdPerson, MdLogout, MdChevronLeft,
  MdChevronRight, MdLibraryBooks, MdDirectionsBus,
  MdRestaurant, MdHotel, MdWork, MdAccountBalance,
  MdSmartToy, MdNotifications, MdEventNote, MdGrade,
  MdGroups, MdBeachAccess, MdAdminPanelSettings,
  MdFamilyRestroom, MdMenuBook
} from 'react-icons/md'
import './Sidebar.css'

const NAV_ITEMS = {
  student: [
    { icon: MdDashboard, label: 'dashboard', path: '/student/dashboard' },
    { icon: MdSchedule,  label: 'timetable',   path: '/student/timetable' },
    { icon: MdBarChart,  label: 'attendance',   path: '/student/attendance' },
    { icon: MdAssignment,label: 'assignments',  path: '/student/assignments' },
    { icon: MdGrade,     label: 'results',      path: '/student/results' },
    { icon: MdWork,      label: 'placement',    path: '/student/placement' },
    { icon: MdAccountBalance, label: 'finance', path: '/student/finance' },
    { divider: true },
    { icon: MdLibraryBooks,label: 'library',   path: '/student/library' },
    { icon: MdHotel,     label: 'hostel',       path: '/student/hostel' },
    { icon: MdDirectionsBus,label: 'transport', path: '/student/transport' },
    { icon: MdRestaurant,label: 'canteen',      path: '/student/canteen' },
    { divider: true },
    { icon: MdSmartToy,  label: 'campus_assistant', path: '/student/ai' },
    { icon: MdPerson,    label: 'profile',      path: '/student/profile' },
  ],
  faculty: [
    { icon: MdDashboard, label: 'dashboard',    path: '/faculty/dashboard' },
    { icon: MdPeople,    label: 'students',     path: '/faculty/students' },
    { icon: MdSchedule,  label: 'timetable',    path: '/faculty/timetable' },
    { icon: MdBarChart,  label: 'attendance',   path: '/faculty/attendance' },
    { icon: MdGrade,     label: 'results',      path: '/faculty/results' },
    { icon: MdBeachAccess,label: 'Leave',       path: '/faculty/leave' },
    { divider: true },
    { icon: MdSmartToy,  label: 'campus_assistant', path: '/faculty/ai' },
    { icon: MdPerson,    label: 'profile',      path: '/faculty/profile' },
  ],
  admin: [
    { icon: MdDashboard,        label: 'dashboard', path: '/admin/dashboard' },
    { icon: MdPeople,           label: 'students',  path: '/admin/students' },
    { icon: MdGroups,           label: 'faculty',   path: '/admin/faculty' },
    { icon: MdEventNote,        label: 'admissions',path: '/admin/admissions' },
    { icon: MdAccountBalance,   label: 'finance',   path: '/admin/finance' },
    { icon: MdAdminPanelSettings,label:'settings',  path: '/admin/settings' },
    { divider: true },
    { icon: MdSmartToy,         label: 'campus_assistant',path: '/admin/ai' },
    { icon: MdPerson,           label: 'profile',   path: '/admin/profile' },
  ],
  parent: [
    { icon: MdDashboard,  label: 'dashboard',  path: '/parent/dashboard' },
    { icon: MdBarChart,   label: 'attendance', path: '/parent/attendance' },
    { icon: MdGrade,      label: 'results',    path: '/parent/results' },
    { icon: MdAccountBalance,label:'finance',  path: '/parent/finance' },
    { icon: MdFamilyRestroom,label: 'Parent-Teacher', path: '/parent/ptm' },
    { divider: true },
    { icon: MdPerson,     label: 'profile',    path: '/parent/profile' },
  ],
}

const ROLE_COLORS = {
  student: 'var(--primary-500)',
  faculty: 'var(--accent-green)',
  admin:   'var(--accent-orange)',
  parent:  'var(--accent-purple)',
}

const ROLE_ICONS = {
  student: MdMenuBook,
  faculty: MdGroups,
  admin:   MdAdminPanelSettings,
  parent:  MdFamilyRestroom,
}

export default function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }) {
  const { user, logout } = useAuth()
  const { t } = useTranslation()
  const navigate = useNavigate()

  if (!user) return null

  const items = NAV_ITEMS[user.role] || []
  const roleColor = ROLE_COLORS[user.role]
  const RoleIcon = ROLE_ICONS[user.role]
  const initials = user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside
      className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}
      id="sidebar"
    >
      {/* Logo as toggle */}
      <div className="sidebar-logo">
        <div 
          className="sidebar-logo-icon" 
          style={{ background: roleColor, cursor: 'pointer' }}
          onClick={onToggle}
          title={collapsed ? t('expand_sidebar', 'Expand') : t('collapse_sidebar', 'Collapse')}
        >
          <RoleIcon size={20} color="#fff" />
        </div>
        {!collapsed && (
          <div className="sidebar-logo-text">
            <span className="sidebar-logo-name">SVITS erp</span>
            <span className="sidebar-logo-role" style={{ color: roleColor }}>
              {t(`role_${user.role}`, user.role)}
            </span>
          </div>
        )}
      </div>

      {/* User info */}
      {!collapsed && (
        <div className="sidebar-user animate-fade-in">
          <div className="avatar-placeholder avatar-md" style={{ background: roleColor }}>
            {initials}
          </div>
          <div className="sidebar-user-info">
            <p className="sidebar-user-name">{user.name}</p>
            <p className="sidebar-user-meta">{user.rollNo || user.designation || user.role}</p>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="sidebar-nav" role="navigation" aria-label="Main navigation">
        {items.map((item, i) => {
          if (item.divider) return <div key={`d-${i}`} className="sidebar-divider" />
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
              title={collapsed ? t(item.label, item.label) : undefined}
              id={`nav-${item.label}`}
            >
              <span className="sidebar-item-icon">
                <Icon size={20} />
              </span>
              {!collapsed && (
                <span className="sidebar-item-label">{t(item.label, item.label)}</span>
              )}
              {!collapsed && <span className="sidebar-item-indicator" />}
            </NavLink>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="sidebar-footer">
        <button
          className={`sidebar-item sidebar-logout ${collapsed ? 'collapsed' : ''}`}
          onClick={handleLogout}
          title={collapsed ? t('logout') : undefined}
          id="sidebar-logout-btn"
        >
          <span className="sidebar-item-icon"><MdLogout size={20} /></span>
          {!collapsed && <span className="sidebar-item-label">{t('logout')}</span>}
        </button>
      </div>
    </aside>
  )
}
