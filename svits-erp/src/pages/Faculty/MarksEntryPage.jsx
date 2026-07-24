import { useState } from 'react'
import { MdSave, MdTrendingUp, MdTrendingFlat, MdTrendingDown } from 'react-icons/md'
import toast from 'react-hot-toast'
import './MarksEntryPage.css'

const BATCHES = ['IT-3A (Data Structures)', 'IT-3B (Data Structures)', 'CS-3B (Algorithms)']
const EXAM_TYPES = ['Mid Term 1', 'Mid Term 2', 'Assignments', 'Final Internal']

const MOCK_MARKS = [
  { id: 1, rollNo: '21IT001', name: 'Arjun Sharma', marks: 18, maxMarks: 20 },
  { id: 2, rollNo: '21IT002', name: 'Priya Patel', marks: 19, maxMarks: 20 },
  { id: 3, rollNo: '21IT003', name: 'Rahul Verma', marks: 14, maxMarks: 20 },
  { id: 4, rollNo: '21IT004', name: 'Neha Gupta', marks: 16, maxMarks: 20 },
  { id: 5, rollNo: '21IT005', name: 'Aakash Singh', marks: 12, maxMarks: 20 },
]

export default function MarksEntryPage() {
  const [selectedBatch, setSelectedBatch] = useState(BATCHES[0])
  const [selectedExam, setSelectedExam] = useState(EXAM_TYPES[0])
  const [marksData, setMarksData] = useState(MOCK_MARKS)

  const handleMarkChange = (id, val) => {
    const num = parseInt(val, 10)
    setMarksData(prev => prev.map(s => {
      if (s.id === id) {
        return { ...s, marks: isNaN(num) ? '' : Math.min(num, s.maxMarks) }
      }
      return s
    }))
  }

  const saveMarks = () => {
    toast.success('Marks saved successfully!')
  }

  const calculateStats = () => {
    const validMarks = marksData.filter(s => s.marks !== '').map(s => Number(s.marks))
    if (validMarks.length === 0) return { avg: 0, highest: 0, lowest: 0 }
    
    const sum = validMarks.reduce((a, b) => a + b, 0)
    const avg = (sum / validMarks.length).toFixed(1)
    const highest = Math.max(...validMarks)
    const lowest = Math.min(...validMarks)
    
    return { avg, highest, lowest }
  }

  const stats = calculateStats()

  return (
    <div className="fac-marks-page animate-fade-in" id="marks-entry-page">
      <div className="page-header">
        <div>
          <h1 className="page-title"> Marks Entry</h1>
          <p className="page-subtitle">Update and publish student grades</p>
        </div>
      </div>

      <div className="fac-marks-controls">
        <div className="card fac-marks-control-card">
          <label>Select Batch & Subject</label>
          <select value={selectedBatch} onChange={e => setSelectedBatch(e.target.value)}>
            {BATCHES.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        
        <div className="card fac-marks-control-card">
          <label>Select Assessment Type</label>
          <select value={selectedExam} onChange={e => setSelectedExam(e.target.value)}>
            {EXAM_TYPES.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>
      </div>

      <div className="fac-marks-stats">
        <div className="card fac-marks-stat-card">
          <div className="fac-marks-stat-icon" style={{ background: '#e0f2fe', color: '#0284c7' }}>
            <MdTrendingFlat size={24} />
          </div>
          <div>
            <div className="fac-marks-stat-label">Class Average</div>
            <div className="fac-marks-stat-value">{stats.avg} <span className="fac-marks-stat-max">/ 20</span></div>
          </div>
        </div>
        <div className="card fac-marks-stat-card">
          <div className="fac-marks-stat-icon" style={{ background: '#d1fae5', color: '#059669' }}>
            <MdTrendingUp size={24} />
          </div>
          <div>
            <div className="fac-marks-stat-label">Highest Score</div>
            <div className="fac-marks-stat-value">{stats.highest} <span className="fac-marks-stat-max">/ 20</span></div>
          </div>
        </div>
        <div className="card fac-marks-stat-card">
          <div className="fac-marks-stat-icon" style={{ background: '#fee2e2', color: '#dc2626' }}>
            <MdTrendingDown size={24} />
          </div>
          <div>
            <div className="fac-marks-stat-label">Lowest Score</div>
            <div className="fac-marks-stat-value">{stats.lowest} <span className="fac-marks-stat-max">/ 20</span></div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="section-title">Enter Marks</h2>
        </div>
        <div className="fac-marks-table-wrapper">
          <table className="fac-marks-table">
            <thead>
              <tr>
                <th width="15%">Roll No</th>
                <th width="50%">Student Name</th>
                <th width="35%">Marks Obtained (Max: 20)</th>
              </tr>
            </thead>
            <tbody>
              {marksData.map((s, i) => (
                <tr key={s.id} className="fac-marks-row animate-fade-in" style={{ animationDelay: `${i * 0.04}s` }}>
                  <td className="fac-marks-roll">{s.rollNo}</td>
                  <td className="fac-marks-name">{s.name}</td>
                  <td>
                    <div className="fac-marks-input-group">
                      <input 
                        type="number" 
                        value={s.marks} 
                        onChange={(e) => handleMarkChange(s.id, e.target.value)}
                        className="fac-marks-input"
                        min="0"
                        max={s.maxMarks}
                      />
                      <span className="fac-marks-max-suffix">/ {s.maxMarks}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="fac-marks-footer">
          <button className="btn btn-primary" onClick={saveMarks}>
            <MdSave size={20} /> Save Marks
          </button>
        </div>
      </div>
    </div>
  )
}
