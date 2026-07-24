import { MdPayment, MdReceipt, MdDownload, MdWarning } from 'react-icons/md'
import './ParentFinancePage.css'

const FEE_STRUCTURE = [
  { term: 'Tuition Fee (Sem 6)', amount: 45000, status: 'Paid', date: '15 Jan 2026' },
  { term: 'Hostel Fee (Sem 6)', amount: 25000, status: 'Paid', date: '20 Jan 2026' },
  { term: 'Transport Fee (Sem 6)', amount: 15000, status: 'Pending', date: '-' },
  { term: 'Library Dues', amount: 500, status: 'Pending', date: '-' },
]

export default function ParentFinancePage() {
  const totalDue = FEE_STRUCTURE.filter(f => f.status === 'Pending').reduce((acc, curr) => acc + curr.amount, 0)
  const totalPaid = FEE_STRUCTURE.filter(f => f.status === 'Paid').reduce((acc, curr) => acc + curr.amount, 0)

  return (
    <div className="parent-fin-page animate-fade-in" id="parent-finance-page">
      <div className="page-header">
        <div>
          <h1 className="page-title"> Fee Details</h1>
          <p className="page-subtitle">Track payments and pending dues</p>
        </div>
      </div>

      <div className="parent-fin-stats">
        <div className="card parent-fin-stat-card due">
          <div className="parent-fin-stat-icon">
            <MdWarning size={32} />
          </div>
          <div>
            <div className="parent-fin-stat-label">Total Dues Pending</div>
            <div className="parent-fin-stat-value">₹{totalDue.toLocaleString()}</div>
          </div>
          <button className="btn btn-primary" style={{ marginLeft: 'auto' }}>
            <MdPayment size={18} /> Pay Now
          </button>
        </div>
        
        <div className="card parent-fin-stat-card paid">
          <div className="parent-fin-stat-icon">
            <MdReceipt size={32} />
          </div>
          <div>
            <div className="parent-fin-stat-label">Total Paid (This Sem)</div>
            <div className="parent-fin-stat-value">₹{totalPaid.toLocaleString()}</div>
          </div>
        </div>
      </div>

      <div className="card animate-fade-in delay-1">
        <div className="card-header">
          <h2 className="section-title">Fee Breakdown</h2>
        </div>
        <div className="parent-fin-table-wrapper">
          <table className="parent-fin-table">
            <thead>
              <tr>
                <th>Fee Particulars</th>
                <th>Amount</th>
                <th>Payment Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {FEE_STRUCTURE.map((fee, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{fee.term}</td>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>₹{fee.amount.toLocaleString()}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{fee.date}</td>
                  <td>
                    <span className={`badge ${fee.status === 'Paid' ? 'badge-success' : 'badge-danger'}`}>
                      {fee.status}
                    </span>
                  </td>
                  <td>
                    {fee.status === 'Paid' ? (
                      <button className="btn btn-outline btn-sm">
                        <MdDownload size={16} /> Receipt
                      </button>
                    ) : (
                      <button className="btn btn-primary btn-sm">Pay</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
