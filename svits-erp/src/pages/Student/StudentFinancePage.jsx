import { useState } from 'react'
import { MdPayment, MdReceipt, MdDownload, MdWarning, MdAccountBalanceWallet, MdClose, MdSecurity } from 'react-icons/md'
import toast from 'react-hot-toast'
import '../Parent/ParentFinancePage.css' // Reusing Parent's CSS as it's identical
import './StudentFinancePage.css' // Add list specific styling

const INITIAL_FEES = [
  { id: 1, term: 'Tuition Fee (Sem 6)', amount: 45000, status: 'Paid', date: '15 Jan 2026' },
  { id: 2, term: 'Hostel Fee (Sem 6)', amount: 25000, status: 'Paid', date: '15 Jan 2026' },
  { id: 3, term: 'Transport Fee (Sem 6)', amount: 15000, status: 'Pending', date: 'Due: 30 Jul 2026' },
  { id: 4, term: 'Library Fine', amount: 150, status: 'Pending', date: 'Due: 24 Jul 2026' },
]

export default function StudentFinancePage() {
  const [fees, setFees] = useState(INITIAL_FEES)
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false)
  const [selectedFee, setSelectedFee] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('upi')
  const [isProcessing, setIsProcessing] = useState(false)

  const totalPaid = fees.filter(f => f.status === 'Paid').reduce((sum, f) => sum + f.amount, 0)
  const totalPending = fees.filter(f => f.status === 'Pending').reduce((sum, f) => sum + f.amount, 0)

  const initiatePayment = (fee) => {
    setSelectedFee(fee)
    setPaymentModalOpen(true)
  }

  const processPayment = (e) => {
    e.preventDefault()
    setIsProcessing(true)
    
    const paymentPromise = new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, 2000)
    })

    toast.promise(paymentPromise, {
      loading: `Processing payment for ₹${selectedFee.amount}...`,
      success: () => {
        setFees(prev => prev.map(f => f.id === selectedFee.id ? { ...f, status: 'Paid', date: 'Paid Just Now' } : f))
        setPaymentModalOpen(false)
        setIsProcessing(false)
        return 'Payment Successful!'
      },
      error: () => {
        setIsProcessing(false)
        return 'Payment failed. Please try again.'
      }
    })
  }

  return (
    <div className="parent-fin-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title"> Finance Portal</h1>
          <p className="page-subtitle">Track your fee payments and pending dues</p>
        </div>
        <button className="btn btn-outline">
          <MdDownload size={18} /> Download Statement
        </button>
      </div>

      <div className="parent-fin-stats">
        <div className="card parent-fin-stat-card primary">
          <div className="parent-fin-stat-icon"><MdAccountBalanceWallet size={28} /></div>
          <div>
            <div className="parent-fin-stat-label">Total Paid (This Year)</div>
            <div className="parent-fin-stat-value">₹{totalPaid.toLocaleString()}</div>
          </div>
        </div>
        <div className="card parent-fin-stat-card danger">
          <div className="parent-fin-stat-icon"><MdWarning size={28} /></div>
          <div>
            <div className="parent-fin-stat-label">Total Pending Dues</div>
            <div className="parent-fin-stat-value">₹{totalPending.toLocaleString()}</div>
          </div>
        </div>
      </div>

      <div className="card animate-fade-in delay-1">
        <div className="card-header"><h2 className="section-title">Fee Breakdown (Semester 6)</h2></div>
        <div className="card-body" style={{ padding: 0 }}>
          <div className="parent-fin-list">
            {fees.map((fee) => (
              <div key={fee.id} className="parent-fin-item">
                <div className="parent-fin-info">
                  <div className="parent-fin-item-icon">
                    {fee.status === 'Paid' ? <MdReceipt size={24} color="var(--primary-500)"/> : <MdWarning size={24} color="var(--accent-red)"/>}
                  </div>
                  <div>
                    <h3 className="parent-fin-term">{fee.term}</h3>
                    <p className="parent-fin-date">{fee.date}</p>
                  </div>
                </div>
                <div className="parent-fin-action">
                  <div className="parent-fin-amount">₹{fee.amount.toLocaleString()}</div>
                  <span className={`badge ${fee.status === 'Paid' ? 'badge-success' : 'badge-danger'}`}>
                    {fee.status}
                  </span>
                  {fee.status === 'Pending' && (
                    <button className="btn btn-primary btn-sm" style={{ marginTop: 8 }} onClick={() => initiatePayment(fee)}>
                      Pay Now <MdPayment size={14} style={{ marginLeft: 4 }}/>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Gateway Modal */}
      {isPaymentModalOpen && selectedFee && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 420, width: '90%' }}>
            <div className="modal-header">
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-heading)' }}>
                <MdSecurity color="var(--primary-500)" />
                Secure Checkout
              </h3>
              <button className="modal-close" onClick={() => setPaymentModalOpen(false)}>
                <MdClose size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div style={{ background: 'var(--primary-50)', padding: '20px', borderRadius: 'var(--radius-md)', marginBottom: 24, textAlign: 'center' }}>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Paying for</p>
                <h4 style={{ margin: '8px 0', color: 'var(--primary-700)', fontSize: '1.25rem' }}>{selectedFee.term}</h4>
                <div style={{ fontSize: '2.5rem', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--primary-700)' }}>
                  ₹{selectedFee.amount.toLocaleString()}
                </div>
              </div>

              <form onSubmit={processPayment}>
                <p style={{ fontWeight: 600, marginBottom: 12 }}>Select Payment Method</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, border: `1px solid ${paymentMethod === 'upi' ? 'var(--primary-500)' : 'var(--border-color)'}`, borderRadius: 'var(--radius-md)', cursor: 'pointer', background: paymentMethod === 'upi' ? 'var(--primary-50)' : 'transparent' }}>
                    <input type="radio" name="payment" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} style={{ width: 18, height: 18 }} />
                    <span style={{ fontWeight: 500 }}>UPI (GPay, PhonePe, Paytm)</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, border: `1px solid ${paymentMethod === 'card' ? 'var(--primary-500)' : 'var(--border-color)'}`, borderRadius: 'var(--radius-md)', cursor: 'pointer', background: paymentMethod === 'card' ? 'var(--primary-50)' : 'transparent' }}>
                    <input type="radio" name="payment" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} style={{ width: 18, height: 18 }} />
                    <span style={{ fontWeight: 500 }}>Credit / Debit Card</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, border: `1px solid ${paymentMethod === 'netbanking' ? 'var(--primary-500)' : 'var(--border-color)'}`, borderRadius: 'var(--radius-md)', cursor: 'pointer', background: paymentMethod === 'netbanking' ? 'var(--primary-50)' : 'transparent' }}>
                    <input type="radio" name="payment" checked={paymentMethod === 'netbanking'} onChange={() => setPaymentMethod('netbanking')} style={{ width: 18, height: 18 }} />
                    <span style={{ fontWeight: 500 }}>Net Banking</span>
                  </label>
                </div>
                
                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', fontSize: '1.05rem' }} disabled={isProcessing}>
                  {isProcessing ? 'Processing Securely...' : `Pay ₹${selectedFee.amount.toLocaleString()}`}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
