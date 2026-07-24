import { useState } from 'react'
import { MdCheckCircle, MdCancel, MdDateRange, MdSave } from 'react-icons/md'
import toast from 'react-hot-toast'
import './AttendanceManagementPage.css'

const BATCHES = ['IT-3A (Data Structures)', 'IT-3B (Data Structures)', 'CS-3B (Algorithms)']

const MOCK_STUDENTS = [
  { id: 1, rollNo: '21IT001', name: 'Arjun Sharma', present: true },
  { id: 2, rollNo: '21IT002', name: 'Priya Patel', present: true },
  { id: 3, rollNo: '21IT003', name: 'Rahul Verma', present: false },
  { id: 4, rollNo: '21IT004', name: 'Neha Gupta', present: true },
  { id: 5, rollNo: '21IT005', name: 'Aakash Singh', present: false },
  { id: 6, rollNo: '21IT006', name: 'Karan Mehra', present: true },
  { id: 7, rollNo: '21IT007', name: 'Anjali Desai', present: true },
  { id: 8, rollNo: '21IT008', name: 'Rohan Joshi', present: true },
]

export default function AttendanceManagementPage() {
  const [selectedBatch, setSelectedBatch] = useState(BATCHES[0])
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [students, setStudents] = useState(MOCK_STUDENTS)

  const handleToggle = (id) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, present: !s.present } : s))
  }

  const markAll = (status) => {
    setStudents(prev => prev.map(s => ({ ...s, present: status })))
  }

  const saveAttendance = () => {
    toast.success('Attendance saved successfully!')
  }

  const presentCount = students.filter(s => s.present).length
  const absentCount = students.length - presentCount

  return (
    <div className="fac-attendance-page animate-fade-in" id="attendance-management-page">
      <div className="page-header">
        <div>
          <h1 className="page-title"> Attendance Management</h1>
          <p className="page-subtitle">Mark and track daily attendance</p>
        </div>
      </div>

      <div className="fac-att-controls">
        <div className="card fac-att-control-card">
          <label>Select Batch & Subject</label>
          <select value={selectedBatch} onChange={e => setSelectedBatch(e.target.value)}>
            {BATCHES.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        
        <div className="card fac-att-control-card">
          <label>Date</label>
          <div className="fac-date-input-wrap">
            <MdDateRange size={18} className="fac-date-icon" />
            <input 
              type="date" 
              value={date} 
              onChange={e => setDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header fac-att-header">
          <div className="fac-att-summary">
            <div className="fac-att-stat">
              <span>Total:</span> <strong>{students.length}</strong>
            </div>
            <div className="fac-att-stat success">
              <span>Present:</span> <strong>{presentCount}</strong>
            </div>
            <div className="fac-att-stat danger">
              <span>Absent:</span> <strong>{absentCount}</strong>
            </div>
          </div>
          
          <div className="fac-att-bulk-actions">
            <button className="btn btn-outline-success btn-sm" onClick={() => markAll(true)}>
              <MdCheckCircle size={16} /> Mark All Present
            </button>
            <button className="btn btn-outline-danger btn-sm" onClick={() => markAll(false)}>
              <MdCancel size={16} /> Mark All Absent
            </button>
          </div>
        </div>

        <div className="fac-att-list-wrapper">
          <table className="fac-att-table">
            <thead>
              <tr>
                <th width="15%">Roll No</th>
                <th width="40%">Student Name</th>
                <th width="45%" style={{ textAlign: 'right' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, i) => (
                <tr key={s.id} className="fac-att-row animate-fade-in" style={{ animationDelay: `${i * 0.03}s` }}>
                  <td className="fac-att-roll">{s.rollNo}</td>
                  <td className="fac-att-name">{s.name}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="fac-att-toggle-group">
                      <button 
                        className={`fac-att-btn present ${s.present ? 'active' : ''}`}
                        onClick={() => handleToggle(s.id)}
                      >
                        Present
                      </button>
                      <button 
                        className={`fac-att-btn absent ${!s.present ? 'active' : ''}`}
                        onClick={() => handleToggle(s.id)}
                      >
                        Absent
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="fac-att-footer">
          <button className="btn btn-primary" onClick={saveAttendance}>
            <MdSave size={20} /> Save Attendance
          </button>
        </div>
      </div>
    </div>
  )
}
