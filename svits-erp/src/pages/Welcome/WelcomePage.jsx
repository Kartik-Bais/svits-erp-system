import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  MdSchool, MdPeople, MdAdminPanelSettings, MdFamilyRestroom,
  MdArrowForward, MdLaptop, MdWork, MdWifi, MdPerson,
  MdMenu, MdClose, MdEventNote, MdEmail, MdPhone,
  MdVerified, MdStar, MdDownload, MdCalendarMonth, MdChat
} from 'react-icons/md'
import Skeleton from '../../components/Skeleton/Skeleton'
import CampusAssistant from '../../components/AIAssistant/CampusAssistant'
import './WelcomePage.css'

const PORTALS = [
  { icon: MdSchool, title: 'Student Portal', desc: 'Check results, attendance, pay fees, and access library.', color: 'var(--primary-500)', bg: 'var(--primary-50)' },
  { icon: MdPeople, title: 'Faculty Module', desc: 'Mark attendance, upload grades, and manage assignments.', color: 'var(--accent-green)', bg: '#d1fae5' },
  { icon: MdFamilyRestroom, title: 'Parent Dashboard', desc: "Monitor your ward's academic performance and activities.", color: 'var(--accent-purple)', bg: '#ede9fe' },
  { icon: MdAdminPanelSettings, title: 'Admin Control', desc: 'Manage users, courses, fees, and system settings.', color: 'var(--accent-orange)', bg: '#fef3c7' },
]

const FEATURES = [
  { icon: MdLaptop, title: 'Advanced Labs', desc: 'High-tech computer labs with AI/ML workstations.' },
  { icon: MdWork, title: 'Top Placements', desc: 'Consistent record of 95% placement in MNCs.' },
  { icon: MdWifi, title: 'Smart Campus', desc: 'Fully Wi-Fi enabled campus with digital classrooms.' },
  { icon: MdPerson, title: 'Expert Faculty', desc: 'Mentorship from PhD holders and Industry experts.' },
]

const CAMPUS_UPDATES = [
  { category: 'Exams', tag: 'New', text: 'Mid-Sem Exam Schedule Released for B.Tech CSE.', date: 'July 20, 2026' },
  { category: 'Events', tag: 'Event', text: 'Hackathon 2026 Registration is now open.', date: 'July 15, 2026' },
  { category: 'Placements', tag: 'Update', text: 'TCS Ninja Hiring Drive - Apply before 20th.', date: 'July 12, 2026' },
  { category: 'Exams', tag: 'Urgent', text: 'Last Date for Semester Fee Payment is July 31st.', date: 'July 18, 2026' },
]

const RECRUITERS = ['TCS', 'Infosys', 'Wipro', 'Cognizant', 'Capgemini', 'Amazon', 'Microsoft', 'Accenture', 'Tech Mahindra', 'IBM']

const TESTIMONIALS = [
  { quote: "The portal made my life so much easier. I can check attendance and grades instantly.", name: "Priya S.", role: "B.Tech CSE" },
  { quote: "Parents can track their child's progress transparently. It's an excellent digital initiative.", name: "Mr. R. Sharma", role: "Parent" },
  { quote: "Managing assignments and grading is now seamless thanks to the Faculty Module.", name: "Dr. A. Gupta", role: "Professor" }
]

const ACADEMIC_PROGRAMS = [
  { type: 'B.Tech', title: 'Computer Science & Engineering', duration: '4 Years' },
  { type: 'B.Tech', title: 'Artificial Intelligence & ML', duration: '4 Years' },
  { type: 'B.Tech', title: 'Data Science', duration: '4 Years' },
  { type: 'M.Tech', title: 'Software Engineering', duration: '2 Years' },
  { type: 'MBA', title: 'Finance & Marketing', duration: '2 Years' },
  { type: 'MBA', title: 'Human Resources', duration: '2 Years' }
]

export default function WelcomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isAdmissionModalOpen, setAdmissionModalOpen] = useState(false)
  const [activeProgramTab, setActiveProgramTab] = useState('All')
  const [activeEventTab, setActiveEventTab] = useState('All')
  const [isNoticesLoading, setIsNoticesLoading] = useState(true)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Simulate notice fetching
  useEffect(() => {
    setIsNoticesLoading(true)
    const timer = setTimeout(() => setIsNoticesLoading(false), 2500)
    return () => clearTimeout(timer)
  }, [activeEventTab])

  return (
    <div className="welcome-page">
      {/* Navbar that exactly matches the Dashboard Navbar UI */}
      <header className={`wp-navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="wp-nav-container">
          <div className="wp-nav-logo">
            <div className="wp-logo-icon">
              <MdSchool size={22} color="#fff" />
            </div>
            <span className="wp-logo-text">SVITS erp</span>
          </div>

          <nav className={`wp-nav-links ${mobileMenuOpen ? 'open' : ''}`}>
            <a href="#home" onClick={() => setMobileMenuOpen(false)}>Home</a>
            <a href="#features" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="#admissions" onClick={() => setMobileMenuOpen(false)}>Admissions</a>
            <Link to="/login" className="btn btn-primary btn-sm wp-login-btn">
              Login to Portals <MdArrowForward />
            </Link>
          </nav>

          <button className="wp-mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
          </button>
        </div>
      </header>

      <main className="wp-main">
        {/* Hero Section */}
        <section id="home" className="wp-hero animate-fade-in">
          <div className="wp-hero-content">
            <span className="badge badge-primary" style={{ marginBottom: 16 }}>Welcome to the Future of Education</span>
            <h1 className="wp-hero-title">The Centralized Digital Campus Management System</h1>
            <p className="wp-hero-subtitle">
              Seamlessly connecting students, faculty, and parents in one unified, intelligent platform. 
              Experience the next generation of academic administration.
            </p>
            <div className="wp-hero-actions">
              <Link to="/login" className="btn btn-primary btn-lg">
                Access Portals <MdArrowForward />
              </Link>
              <a href="#features" className="btn btn-outline btn-lg">
                Explore Features
              </a>
            </div>
          </div>
        </section>

        {/* 1. Accreditation Bar */}
        <section className="wp-accreditation animate-fade-in delay-1">
          <div className="wp-accreditation-container">
            <div className="wp-badge"><MdVerified size={18} /> NAAC A+ Grade</div>
            <div className="wp-badge"><MdVerified size={18} /> AICTE Approved</div>
            <div className="wp-badge"><MdVerified size={18} /> NBA Accredited</div>
            <div className="wp-badge"><MdStar size={18} /> NIRF Top 100</div>
          </div>
        </section>

        {/* 2. Academic Programs Finder */}
        <section id="programs" className="wp-section animate-fade-in delay-1">
          <div className="wp-section-header">
            <h2>Academic Programs</h2>
            <p>Explore our diverse range of undergraduate and postgraduate courses.</p>
          </div>
          <div className="wp-programs-tabs">
            {['All', 'B.Tech', 'M.Tech', 'MBA'].map(tab => (
              <button 
                key={tab} 
                className={`wp-tab-btn ${activeProgramTab === tab ? 'active' : ''}`}
                onClick={() => setActiveProgramTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="wp-programs-grid">
            {ACADEMIC_PROGRAMS.filter(p => activeProgramTab === 'All' || p.type === activeProgramTab).map((prog, i) => (
              <div key={i} className="card wp-program-card">
                <span className="badge badge-primary">{prog.type}</span>
                <h3>{prog.title}</h3>
                <p className="wp-program-dur"><MdEventNote size={14} style={{verticalAlign: 'middle', marginRight: 4}}/> {prog.duration}</p>
                <button className="btn btn-outline btn-sm wp-program-btn" onClick={() => setAdmissionModalOpen(true)}>View Details</button>
              </div>
            ))}
          </div>
        </section>

        {/* Portals Section */}
        <section className="wp-section animate-fade-in delay-1">
          <div className="wp-section-header">
            <h2>Select Your Portal</h2>
            <p>Log in to your dedicated dashboard to access personalized features and information.</p>
          </div>
          
          <div className="wp-portals-grid">
            {PORTALS.map((p, i) => {
              const Icon = p.icon
              return (
                <Link key={i} to="/login" className="card wp-portal-card" style={{ '--accent': p.color }}>
                  <div className="wp-portal-icon" style={{ background: p.bg, color: p.color }}>
                    <Icon size={28} />
                  </div>
                  <div className="wp-portal-info">
                    <h3>{p.title}</h3>
                    <p>{p.desc}</p>
                  </div>
                  <div className="wp-portal-arrow" style={{ color: p.color }}>
                    <MdArrowForward size={20} />
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* 4. Interactive Campus Events */}
        <section className="wp-section animate-fade-in delay-2">
          <div className="wp-section-header">
            <h2>Campus Updates & Events</h2>
            <p>Stay updated with the latest announcements, exams, and activities.</p>
          </div>
          <div className="wp-programs-tabs">
            {['All', 'Exams', 'Placements', 'Events'].map(tab => (
              <button 
                key={tab} 
                className={`wp-tab-btn ${activeEventTab === tab ? 'active' : ''}`}
                onClick={() => setActiveEventTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="wp-notices-container" style={{ maxWidth: 800, margin: '0 auto' }}>
            <div className="card" style={{ padding: '8px 24px 24px' }}>
              {isNoticesLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="wp-event-row">
                    <Skeleton width="80px" height="28px" borderRadius="20px" />
                    <div className="wp-event-info" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <Skeleton width="70%" height="20px" />
                      <Skeleton width="40%" height="16px" />
                    </div>
                  </div>
                ))
              ) : (
                CAMPUS_UPDATES.filter(u => activeEventTab === 'All' || u.category === activeEventTab).map((item, i) => (
                  <div key={i} className="wp-event-row">
                    <div className="wp-event-tag" data-tag={item.tag}>
                      {item.tag}
                    </div>
                    <div className="wp-event-info">
                      <p className="wp-event-text">{item.text}</p>
                      <p className="wp-event-date"><MdCalendarMonth size={14} style={{verticalAlign: 'middle', marginRight: 4}}/> {item.date}</p>
                    </div>
                    <button className="wp-event-add" title="Add to Calendar">
                      <MdEventNote size={20} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* 3. Placements & Industry Linkages Hub */}
        <section className="wp-section animate-fade-in delay-3">
          <div className="wp-section-header">
            <h2>Placements & Careers</h2>
            <p>Empowering students to achieve their dream careers with top global companies.</p>
          </div>
          
          <div className="wp-placement-stats">
            <div className="wp-p-stat"><h3>45 LPA</h3><p>Highest Package</p></div>
            <div className="wp-p-stat"><h3>8.5 LPA</h3><p>Average Package</p></div>
            <div className="wp-p-stat"><h3>95%</h3><p>Placement Record</p></div>
          </div>

          <div className="wp-marquee-container">
            <div className="wp-marquee">
              {[...RECRUITERS, ...RECRUITERS].map((r, i) => (
                <div key={i} className="wp-marquee-item">{r}</div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="wp-section animate-fade-in delay-2">
           <div className="wp-section-header">
            <h2>Why Choose SVITS?</h2>
            <p>Discover the advantages of our state-of-the-art campus and academic excellence.</p>
          </div>

          <div className="wp-features-grid">
            {FEATURES.map((f, i) => {
              const Icon = f.icon
              return (
                <div key={i} className="card wp-feature-card">
                  <div className="wp-feature-icon">
                    <Icon size={24} color="var(--primary-500)" />
                  </div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              )
            })}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="wp-section animate-fade-in delay-3">
          <div className="wp-section-header">
            <h2>What People Say</h2>
            <p>Hear from our students, parents, and faculty about their experience.</p>
          </div>
          <div className="wp-testimonials-grid">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="card wp-testimonial-card">
                <p className="wp-quote">"{t.quote}"</p>
                <div className="wp-author">
                  <div className="wp-author-avatar">
                    {t.name.split(' ').map(n=>n[0]).join('')}
                  </div>
                  <div>
                    <h4>{t.name}</h4>
                    <p>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Admissions CTA */}
        <section id="admissions" className="wp-section animate-fade-in delay-3">
          <div className="card wp-cta-card">
            <div className="wp-cta-content">
              <div className="wp-cta-icon">
                <MdEventNote size={32} />
              </div>
              <div>
                <h2>Admissions Open for 2026</h2>
                <p>Join SVITS and accelerate your career. Apply now for B.Tech, M.Tech, and MBA programs.</p>
              </div>
            </div>
            <button className="btn btn-primary btn-lg" onClick={() => setAdmissionModalOpen(true)}>Apply Now</button>
          </div>
        </section>
      </main>

      {/* 5. Download Center */}
      <section className="wp-download-center wp-section" style={{ background: 'var(--bg-main)' }}>
        <div className="wp-section-header">
          <h2>Download Center</h2>
          <p>Quick access to essential campus documents and forms.</p>
        </div>
        <div className="wp-download-grid">
          <div className="wp-download-card">
            <MdDownload size={24} className="wp-dl-icon" />
            <span>Academic Calendar</span>
          </div>
          <div className="wp-download-card">
            <MdDownload size={24} className="wp-dl-icon" />
            <span>Exam Timetable</span>
          </div>
          <div className="wp-download-card">
            <MdDownload size={24} className="wp-dl-icon" />
            <span>Fee Structure</span>
          </div>
          <div className="wp-download-card">
            <MdDownload size={24} className="wp-dl-icon" />
            <span>Bus Routes</span>
          </div>
        </div>
      </section>

      <footer className="wp-footer">
        <div className="wp-footer-grid">
          <div className="wp-footer-col brand-col">
            <div className="wp-footer-brand">
              <div className="wp-logo-icon" style={{ background: 'var(--primary-500)' }}>
                <MdSchool size={20} color="#fff" />
              </div>
              <span>SVITS erp</span>
            </div>
            <p className="wp-footer-desc">Empowering education through digital transformation. A unified platform for students, faculty, and administration.</p>
          </div>
          <div className="wp-footer-col">
            <h4>Quick Links</h4>
            <a href="#home">Home</a>
            <a href="#features">Features</a>
            <a href="#admissions">Admissions</a>
            <Link to="/login">Login Portal</Link>
          </div>
          <div className="wp-footer-col">
            <h4>Compliance & Grievances</h4>
            <a href="#">Anti-Ragging</a>
            <a href="#">Women Cell</a>
            <a href="#">IQAC</a>
          </div>
          <div className="wp-footer-col">
            <h4>Contact Us</h4>
            <p>123 Education Boulevard</p>
            <p>Indore, MP 452001</p>
            <p>Email: contact@svits.ac.in</p>
            <p>Phone: +91 98765 43210</p>
          </div>
        </div>
        <div className="wp-footer-bottom">
          <p className="wp-footer-text">© 2026 Shri Vaishnav Institute of Technology & Science. All rights reserved.</p>
        </div>
      </footer>

      {isAdmissionModalOpen && (
        <div className="wp-modal-overlay">
          <div className="wp-modal animate-fade-in">
            <div className="wp-modal-header">
              <h2>Admission Enquiry</h2>
              <button className="wp-modal-close" onClick={() => setAdmissionModalOpen(false)}>
                <MdClose size={24} />
              </button>
            </div>
            <form className="wp-modal-form" onSubmit={(e) => { 
              e.preventDefault(); 
              alert('Application submitted successfully!'); 
              setAdmissionModalOpen(false); 
            }}>
              <div className="wp-form-grid">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <div className="input-wrapper wp-input-wrap">
                    <MdPerson size={18} className="input-icon-left" />
                    <input type="text" className="form-control wp-input" required placeholder="Enter your full name" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <div className="input-wrapper wp-input-wrap">
                    <MdPhone size={18} className="input-icon-left" />
                    <input type="tel" className="form-control wp-input" required placeholder="Enter your mobile number" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <div className="input-wrapper wp-input-wrap">
                    <MdEmail size={18} className="input-icon-left" />
                    <input type="email" className="form-control wp-input" required placeholder="Enter your email" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Program of Interest</label>
                  <div className="input-wrapper wp-input-wrap">
                    <MdSchool size={18} className="input-icon-left" />
                    <select className="form-control wp-input" required>
                      <option value="">Select a program</option>
                      <option value="B.Tech">B.Tech (Bachelor of Technology)</option>
                      <option value="M.Tech">M.Tech (Master of Technology)</option>
                      <option value="MBA">MBA (Master of Business Administration)</option>
                    </select>
                  </div>
                </div>
              </div>
              <button type="submit" className="btn btn-primary wp-submit-btn">
                Submit Application
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 6. Floating AI Assistant Widget */}
      <CampusAssistant />
    </div>
  )
}
