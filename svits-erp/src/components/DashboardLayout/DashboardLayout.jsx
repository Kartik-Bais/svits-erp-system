import { useState } from 'react'
import Sidebar from '../Sidebar/Sidebar'
import Navbar from '../Navbar/Navbar'

import CampusAssistant from '../AIAssistant/CampusAssistant'
import { useAuth } from '../../contexts/AuthContext'
import './DashboardLayout.css'

export default function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user } = useAuth()

  const handleSidebarToggle = () => setCollapsed(c => !c)
  const handleMobileMenu = () => setMobileOpen(o => !o)

  return (
    <div className="app-layout">
      <Sidebar
        collapsed={collapsed}
        onToggle={handleSidebarToggle}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />
      )}

      <main className={`app-main ${collapsed ? 'sidebar-collapsed' : ''}`}>
        <Navbar
          onMenuToggle={handleMobileMenu}
          sidebarCollapsed={collapsed}
          className={collapsed ? 'sidebar-collapsed' : ''}
        />
        <div className="page-content">
          {children}
        </div>
      </main>



      <CampusAssistant />
    </div>
  )
}
