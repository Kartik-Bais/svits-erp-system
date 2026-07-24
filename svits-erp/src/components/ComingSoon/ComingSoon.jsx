import { useNavigate } from 'react-router-dom'
import { MdConstruction, MdArrowBack } from 'react-icons/md'

export default function ComingSoon({ title = 'Coming Soon', phase = 'Phase 2' }) {
  const navigate = useNavigate()
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '60vh', textAlign: 'center', gap: 16
    }}>
      <div style={{ fontSize: '4rem' }}></div>
      <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700 }}>{title}</h2>
      <p style={{ color: 'var(--text-secondary)', maxWidth: 360 }}>
        This section is under active development and will be available in <strong>{phase}</strong>.
        Stay tuned!
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span className="badge badge-primary">
          <MdConstruction size={12} /> {phase}
        </span>
      </div>
      <button className="btn btn-outline btn-sm" onClick={() => navigate(-1)} style={{ marginTop: 8 }}>
        <MdArrowBack size={16} /> Go Back
      </button>
    </div>
  )
}
