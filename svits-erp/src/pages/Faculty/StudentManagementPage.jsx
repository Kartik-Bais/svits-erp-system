import { useState } from 'react'
import { MdSearch, MdFilterList, MdMoreVert, MdMail, MdPhone } from 'react-icons/md'
import './StudentManagementPage.css'

const MOCK_STUDENTS = [
  { id: 1, name: 'Arjun Sharma', rollNo: '21IT001', branch: 'IT', sem: '6th', attendance: 86, cgpa: 8.74, phone: '+91 9876543210', email: 'arjun@svits.ac.in' },
  { id: 2, name: 'Priya Patel', rollNo: '21IT002', branch: 'IT', sem: '6th', attendance: 92, cgpa: 9.12, phone: '+91 9876543211', email: 'priya@svits.ac.in' },
  { id: 3, name: 'Rahul Verma', rollNo: '21IT003', branch: 'IT', sem: '6th', attendance: 71, cgpa: 6.80, phone: '+91 9876543212', email: 'rahul@svits.ac.in' },
  { id: 4, name: 'Neha Gupta', rollNo: '21IT004', branch: 'IT', sem: '6th', attendance: 88, cgpa: 8.45, phone: '+91 9876543213', email: 'neha@svits.ac.in' },
  { id: 5, name: 'Aakash Singh', rollNo: '21IT005', branch: 'IT', sem: '6th', attendance: 65, cgpa: 7.20, phone: '+91 9876543214', email: 'aakash@svits.ac.in' },
  { id: 6, name: 'Sneha Reddy', rollNo: '21CS001', branch: 'CS', sem: '6th', attendance: 95, cgpa: 9.50, phone: '+91 9876543215', email: 'sneha@svits.ac.in' },
  { id: 7, name: 'Vikram Joshi', rollNo: '21CS002', branch: 'CS', sem: '6th', attendance: 78, cgpa: 8.10, phone: '+91 9876543216', email: 'vikram@svits.ac.in' },
]

export default function StudentManagementPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterBranch, setFilterBranch] = useState('All')

  const filteredStudents = MOCK_STUDENTS.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesBranch = filterBranch === 'All' || s.branch === filterBranch
    return matchesSearch && matchesBranch
  })

  return (
    <div className="fac-student-mgt-page animate-fade-in" id="student-management-page">
      <div className="page-header">
        <div>
          <h1 className="page-title"> Student Management</h1>
          <p className="page-subtitle">View and manage student records</p>
        </div>
      </div>

      <div className="card">
        <div className="card-header fac-student-controls">
          <div className="fac-search-box">
            <MdSearch size={20} className="fac-search-icon" />
            <input 
              type="text" 
              placeholder="Search by name or roll number..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="fac-search-input"
            />
          </div>
          <div className="fac-filter-box">
            <MdFilterList size={20} />
            <select value={filterBranch} onChange={e => setFilterBranch(e.target.value)} className="fac-filter-select">
              <option value="All">All Branches</option>
              <option value="IT">IT</option>
              <option value="CS">CS</option>
            </select>
          </div>
        </div>

        <div className="fac-student-table-wrapper">
          <table className="fac-student-table">
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Name</th>
                <th>Branch / Sem</th>
                <th style={{ textAlign: 'center' }}>Attendance</th>
                <th style={{ textAlign: 'center' }}>CGPA</th>
                <th>Contact</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? filteredStudents.map((s, i) => (
                <tr key={s.id} className="fac-student-row">
                  <td className="fac-rollno">{s.rollNo}</td>
                  <td className="fac-name-cell">
                    <div className="fac-avatar">{s.name.charAt(0)}</div>
                    <div>
                      <div className="fac-student-name">{s.name}</div>
                      <div className="fac-student-email">{s.email}</div>
                    </div>
                  </td>
                  <td>
                    <span className="fac-branch-badge">{s.branch}</span>
                    <span className="fac-sem-text">{s.sem}</span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span className={`badge ${s.attendance >= 75 ? 'badge-success' : 'badge-danger'}`}>
                      {s.attendance}%
                    </span>
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: 600 }}>{s.cgpa}</td>
                  <td>
                    <div className="fac-contact-icons">
                      <a href={`mailto:${s.email}`} title="Email"><MdMail size={16} /></a>
                      <a href={`tel:${s.phone}`} title="Call"><MdPhone size={16} /></a>
                    </div>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button className="fac-action-btn" title="More options"><MdMoreVert size={20} /></button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                    No students found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
