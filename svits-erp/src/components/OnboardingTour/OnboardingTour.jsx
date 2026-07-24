import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { MdLightbulb, MdClose, MdArrowForward } from 'react-icons/md'

const STEPS = [
  {
    title: 'Welcome to SVITS erp',
    desc: 'Your all-in-one campus management platform. Let\'s take a quick tour of the key features.',
  },
  {
    title: 'Navigate with the Sidebar',
    desc: 'Use the sidebar on the left to switch between Dashboard, Attendance, Results, and more.',
  },
  {
    title: 'AI Assistant',
    desc: 'Click "AI Assistant" in the sidebar anytime to get instant answers about your academic data.',
  },
]

export default function OnboardingTour() {
  const { updateUser } = useAuth()
  const [step, setStep] = useState(0)

  const finish = () => {
    updateUser({ isFirstLogin: false })
  }

  const next = () => {
    if (step < STEPS.length - 1) {
      setStep(s => s + 1)
    } else {
      finish()
    }
  }

  const current = STEPS[step]

  return (
    <div style={{
      position: 'fixed',
      bottom: '88px',
      left: '220px',
      zIndex: 1200,
      background: 'var(--card-bg, #fff)',
      border: '1px solid var(--border-color, #e2e8f0)',
      borderRadius: '16px',
      padding: '20px',
      maxWidth: '300px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
      animation: 'fadeIn 0.3s ease',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
        <div style={{ background: 'var(--primary-50, #eff6ff)', borderRadius: '8px', padding: '6px', display: 'flex' }}>
          <MdLightbulb size={20} color="var(--primary-600, #2563eb)" />
        </div>
        <span style={{ fontWeight: 600, color: 'var(--primary-600, #2563eb)', fontSize: '0.875rem' }}>Welcome to SVITS erp</span>
        <button
          onClick={finish}
          style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary, #64748b)', display: 'flex' }}
          aria-label="Close"
        >
          <MdClose size={20} />
        </button>
      </div>

      <h4 style={{ margin: '0 0 6px', fontSize: '0.95rem', color: 'var(--text-primary, #1e293b)' }}>{current.title}</h4>
      <p style={{ margin: '0 0 16px', fontSize: '0.82rem', color: 'var(--text-secondary, #64748b)', lineHeight: 1.5 }}>{current.desc}</p>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary, #94a3b8)' }}>
          {step + 1} / {STEPS.length}
        </span>
        <button
          onClick={next}
          style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            background: 'var(--primary-500, #3b82f6)', color: '#fff',
            border: 'none', borderRadius: '8px', padding: '6px 14px',
            fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
          }}
        >
          {step < STEPS.length - 1 ? 'Next' : 'Get Started'} <MdArrowForward size={16} />
        </button>
      </div>
    </div>
  )
}
