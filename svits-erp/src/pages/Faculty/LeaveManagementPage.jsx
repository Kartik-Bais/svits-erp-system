import { useState } from 'react'
import { MdAdd, MdClose, MdCheckCircle, MdAccessTime, MdCancel } from 'react-icons/md'
import toast from 'react-hot-toast'
import './LeaveManagementPage.css'

const LEAVE_TYPES = ['Casual Leave (CL)', 'Sick Leave (SL)', 'Earned Leave (EL)', 'On Duty (OD)']

const INITIAL_HISTORY = [
  { id: 1, type: 'Casual Leave (CL)', from: '2026-06-15', to: '2026-06-16', days: 2, reason: 'Personal work', status: 'Approved' },
  { id: 2, type: 'Sick Leave (SL)', from: '2026-05-10', to: '2026-05-10', days: 1, reason: 'Fever', status: 'Approved' },
  { id: 3, type: 'On Duty (OD)', from: '2026-07-20', to: '2026-07-21', days: 2, reason: 'Conference at IIT Bombay', status: 'Pending' },
]

export default function LeaveManagementPage() {
  const [showModal, setShowModal] = useState(false)
  const [history, setHistory] = useState(INITIAL_HISTORY)
  const [formData, setFormData] = useState({
    type: LEAVE_TYPES[0],
    from: '',
    to: '',
    reason: ''
  })

  const handleApply = (e) => {
    e.preventDefault()
    
    // Basic validation
    if (!formData.from || !formData.to || !formData.reason) {
      toast.error('Please fill all fields')
      return
    }

    const fromDate = new Date(formData.from)
    const toDate = new Date(formData.to)
    
    if (toDate < fromDate) {
      toast.error('End date cannot be before start date')
      return
    }

    const diffTime = Math.abs(toDate - fromDate)
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1

    const newLeave = {
      id: Date.now(),
      ...formData,
      days,
      status: 'Pending'
    }

    setHistory([newLeave, ...history])
    setShowModal(false)
    setFormData({ type: LEAVE_TYPES[0], from: '', to: '', reason: '' })
    toast.success('Leave application submitted successfully')
  }

  return (
    <div className="fac-leave-page animate-fade-in" id="leave-management-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">️ Leave Management</h1>
          <p className="page-subtitle">Apply for leave and track status</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <MdAdd size={20} /> Apply Leave
        </button>
      </div>

      <div className="fac-leave-stats animate-fade-in">
        <div className="card fac-leave-stat-card">
          <div className="fac-leave-stat-value cl">12</div>
          <div className="fac-leave-stat-label">Casual Leaves (CL)</div>
          <div className="fac-leave-stat-sub">Remaining out of 15</div>
        </div>
        <div className="card fac-leave-stat-card">
          <div className="fac-leave-stat-value sl">8</div>
          <div className="fac-leave-stat-label">Sick Leaves (SL)</div>
          <div className="fac-leave-stat-sub">Remaining out of 10</div>
        </div>
        <div className="card fac-leave-stat-card">
          <div className="fac-leave-stat-value el">5</div>
          <div className="fac-leave-stat-label">Earned Leaves (EL)</div>
          <div className="fac-leave-stat-sub">Accrued balance</div>
        </div>
      </div>

      <div className="card fac-leave-history animate-fade-in delay-1">
        <div className="card-header">
          <h2 className="section-title">Leave History</h2>
        </div>
        <div className="fac-leave-table-wrapper">
          <table className="fac-leave-table">
            <thead>
              <tr>
                <th>Leave Type</th>
                <th>Duration</th>
                <th>Days</th>
                <th>Reason</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map((l, i) => (
                <tr key={l.id} className="fac-leave-row">
                  <td className="fac-leave-type">{l.type}</td>
                  <td className="fac-leave-dates">
                    {new Date(l.from).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                    {l.from !== l.to && ` - ${new Date(l.to).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}`}
                  </td>
                  <td>{l.days}</td>
                  <td className="fac-leave-reason">{l.reason}</td>
                  <td>
                    {l.status === 'Approved' && <span className="badge badge-success"><MdCheckCircle size={14} style={{ marginRight: 4 }}/> Approved</span>}
                    {l.status === 'Pending' && <span className="badge badge-warning"><MdAccessTime size={14} style={{ marginRight: 4 }}/> Pending</span>}
                    {l.status === 'Rejected' && <span className="badge badge-danger"><MdCancel size={14} style={{ marginRight: 4 }}/> Rejected</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fac-leave-modal-overlay">
          <div className="fac-leave-modal card animate-scale-in">
            <div className="fac-leave-modal-header">
              <h3>Apply for Leave</h3>
              <button className="fac-leave-modal-close" onClick={() => setShowModal(false)}>
                <MdClose size={24} />
              </button>
            </div>
            <form onSubmit={handleApply} className="fac-leave-form">
              <div className="form-group">
                <label>Leave Type</label>
                <select 
                  value={formData.type} 
                  onChange={e => setFormData({...formData, type: e.target.value})}
                  className="form-input"
                >
                  {LEAVE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="fac-leave-form-row">
                <div className="form-group">
                  <label>From Date</label>
                  <input 
                    type="date" 
                    value={formData.from} 
                    onChange={e => setFormData({...formData, from: e.target.value})}
                    className="form-input"
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>To Date</label>
                  <input 
                    type="date" 
                    value={formData.to} 
                    onChange={e => setFormData({...formData, to: e.target.value})}
                    className="form-input"
                    min={formData.from || new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Reason</label>
                <textarea 
                  value={formData.reason} 
                  onChange={e => setFormData({...formData, reason: e.target.value})}
                  className="form-input"
                  rows="3"
                  placeholder="Please state your reason for leave..."
                  required
                ></textarea>
              </div>
              <div className="fac-leave-form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit Application</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
