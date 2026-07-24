import { useState } from 'react'
import { MdAccountBalanceWallet, MdTrendingUp, MdWarning, MdFileDownload, MdFilterList } from 'react-icons/md'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import './AdminFinance.css'

const CHART_DATA = [
  { month: 'Jan', collected: 4500000, pending: 1200000 },
  { month: 'Feb', collected: 5200000, pending: 900000 },
  { month: 'Mar', collected: 2100000, pending: 600000 },
  { month: 'Apr', collected: 1800000, pending: 450000 },
  { month: 'May', collected: 800000, pending: 200000 },
  { month: 'Jun', collected: 1500000, pending: 300000 },
]

const RECENT_TRANSACTIONS = [
  { id: 'TXN-901', name: 'Arjun Sharma', type: 'Tuition Fee', amount: 45000, date: '18 Jul 2026', status: 'Success' },
  { id: 'TXN-902', name: 'Priya Patel', type: 'Hostel Fee', amount: 25000, date: '18 Jul 2026', status: 'Success' },
  { id: 'TXN-903', name: 'Rahul Verma', type: 'Transport Fee', amount: 15000, date: '17 Jul 2026', status: 'Failed' },
  { id: 'TXN-904', name: 'Karan Singh', type: 'Tuition Fee', amount: 45000, date: '17 Jul 2026', status: 'Success' },
]

export default function AdminFinance() {
  return (
    <div className="admin-finance-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title"> Fee Management</h1>
          <p className="page-subtitle">Track college revenue, fee collections, and defaulters</p>
        </div>
        <button className="btn btn-outline">
          <MdFileDownload size={18} /> Export Report
        </button>
      </div>

      <div className="admin-finance-overview">
        <div className="card admin-fin-stat-card primary">
          <div className="admin-fin-stat-icon"><MdAccountBalanceWallet size={28} /></div>
          <div>
            <div className="admin-fin-stat-label">Total Collection (YTD)</div>
            <div className="admin-fin-stat-value">₹1,59,00,000</div>
          </div>
        </div>
        <div className="card admin-fin-stat-card success">
          <div className="admin-fin-stat-icon"><MdTrendingUp size={28} /></div>
          <div>
            <div className="admin-fin-stat-label">This Month</div>
            <div className="admin-fin-stat-value">₹32,50,000</div>
          </div>
        </div>
        <div className="card admin-fin-stat-card danger">
          <div className="admin-fin-stat-icon"><MdWarning size={28} /></div>
          <div>
            <div className="admin-fin-stat-label">Total Defaulters Due</div>
            <div className="admin-fin-stat-value">₹36,50,000</div>
          </div>
        </div>
      </div>

      <div className="admin-finance-grid">
        <div className="card">
          <div className="card-header">
            <h2 className="section-title">Collection vs Pending (Last 6 Months)</h2>
          </div>
          <div className="card-body" style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CHART_DATA} margin={{ top: 20, right: 20, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
                <YAxis 
                  tickFormatter={(val) => `₹${(val/100000).toFixed(0)}L`}
                  axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
                />
                <Tooltip 
                  formatter={(val) => `₹${val.toLocaleString()}`}
                  cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                />
                <Bar dataKey="collected" name="Collected" fill="var(--primary-500)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="pending" name="Pending" fill="var(--accent-red)" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h2 className="section-title">Recent Transactions</h2>
            <button className="icon-btn"><MdFilterList size={20} /></button>
          </div>
          <div className="admin-fin-tx-list">
            {RECENT_TRANSACTIONS.map((tx, i) => (
              <div key={tx.id} className="admin-fin-tx-item animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="admin-fin-tx-info">
                  <h4 className="admin-fin-tx-name">{tx.name}</h4>
                  <div className="admin-fin-tx-meta">{tx.id} • {tx.type} • {tx.date}</div>
                </div>
                <div className="admin-fin-tx-amount-wrap">
                  <div className="admin-fin-tx-amount">₹{tx.amount.toLocaleString()}</div>
                  <span className={`badge ${tx.status === 'Success' ? 'badge-success' : 'badge-danger'}`}>
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
