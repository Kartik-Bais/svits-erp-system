import { useState } from 'react'
import { MdDirectionsBus, MdLocationOn, MdAccessTime, MdPhone, MdCreditCard } from 'react-icons/md'
import toast from 'react-hot-toast'
import './StudentTransportPage.css'

export default function StudentTransportPage() {
  const [passActive, setPassActive] = useState(true)

  const handleRenew = () => {
    toast.success('Pass renewal request initiated. Redirecting to payment portal...')
  }

  return (
    <div className="student-transport-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title"> Transport Services</h1>
          <p className="page-subtitle">Track your bus, view routes, and manage your pass</p>
        </div>
      </div>

      <div className="transport-grid">
        <div className="card animate-fade-in delay-1">
          <div className="card-header">
            <h2 className="section-title">My Bus Pass</h2>
          </div>
          <div className="card-body">
            <div className={`transport-pass-card ${passActive ? 'active' : 'expired'}`}>
              <div className="transport-pass-header">
                <h3>SVITS Transport Pass</h3>
                <MdDirectionsBus size={24} />
              </div>
              <div className="transport-pass-body">
                <div className="transport-pass-row">
                  <span>Name:</span> <strong>Arjun Sharma</strong>
                </div>
                <div className="transport-pass-row">
                  <span>Route:</span> <strong>R-04 (Vizianagaram to Campus)</strong>
                </div>
                <div className="transport-pass-row">
                  <span>Valid Until:</span> <strong>31 Dec 2026</strong>
                </div>
                <div className="transport-pass-status">
                  Status: {passActive ? <span style={{ color: '#4ade80' }}>Active</span> : <span style={{ color: '#f87171' }}>Expired</span>}
                </div>
              </div>
            </div>
            <button className="btn btn-primary" style={{ width: '100%', marginTop: 16 }} onClick={handleRenew}>
              <MdCreditCard size={18} /> Renew Pass
            </button>
          </div>
        </div>

        <div className="card animate-fade-in delay-2">
          <div className="card-header">
            <h2 className="section-title">Live Tracking & Details</h2>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="transport-tracking-map">
              <div className="transport-map-placeholder">
                <MdLocationOn size={48} color="var(--primary-400)" />
                <p>Live Tracking Map (Mock)</p>
                <div className="transport-bus-marker"> Route 04 is 2.5km away</div>
              </div>
            </div>

            <div className="transport-route-details">
              <div className="transport-detail-item">
                <div className="transport-detail-icon"><MdDirectionsBus size={20} /></div>
                <div>
                  <small>Bus Number</small>
                  <p>AP 35 X 1234</p>
                </div>
              </div>
              <div className="transport-detail-item">
                <div className="transport-detail-icon"><MdPhone size={20} /></div>
                <div>
                  <small>Driver Contact</small>
                  <p>Mr. Suresh (+91 98765 43210)</p>
                </div>
              </div>
              <div className="transport-detail-item">
                <div className="transport-detail-icon"><MdAccessTime size={20} /></div>
                <div>
                  <small>Est. Arrival Time</small>
                  <p>08:15 AM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
