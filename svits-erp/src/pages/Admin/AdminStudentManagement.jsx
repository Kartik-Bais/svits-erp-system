import { useState } from 'react'
import { MdSearch, MdFilterList, MdAdd, MdDownload, MdUpload, MdMoreVert, MdEdit, MdDelete } from 'react-icons/md'
import toast from 'react-hot-toast'
import './AdminStudentManagement.css'

const MOCK_STUDENTS = [
  { id: 'S2024001', name: 'Arjun Sharma', branch: 'Information Technology', sem: '6th', cgpa: 8.74, status: 'Active' },
  { id: 'S2024002', name: 'Priya Patel', branch: 'Computer Science', sem: '6th', cgpa: 9.12, status: 'Active' },
  { id: 'S2024003', name: 'Rahul Verma', branch: 'Electronics', sem: '4th', cgpa: 7.85, status: 'Active' },
  { id: 'S2024004', name: 'Sneha Reddy', branch: 'Information Technology', sem: '2nd', cgpa: 8.20, status: 'Inactive' },
  { id: 'S2024005', name: 'Vikram Singh', branch: 'Mechanical', sem: '8th', cgpa: 8.90, status: 'Active' },
]

export default function AdminStudentManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [branchFilter, setBranchFilter] = useState('All')
  
  const filteredStudents = MOCK_STUDENTS.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesBranch = branchFilter === 'All' || s.branch === branchFilter
    return matchesSearch && matchesBranch
  })

  const handleExport = () => {
    toast.success('Student data exported successfully!')
  }

  const handleDelete = (id) => {
    toast.success(`Student ${id} deleted (Mock)`)
  }

  return (
    <div className="admin-students-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">‍ Student Management</h1>
          <p className="page-subtitle">Manage all student records, admissions, and status</p>
        </div>
        <div className="admin-students-header-actions">
          <button className="btn btn-outline" onClick={handleExport}>
            <MdDownload size={18} /> Export
          </button>
          <button className="btn btn-outline">
            <MdUpload size={18} /> Import CSV
          </button>
          <button className="btn btn-primary">
            <MdAdd size={18} /> Add Student
          </button>
        </div>
      </div>

      <div className="card">
        <div className="admin-students-controls">
          <div className="admin-search-box">
            <MdSearch size={20} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Search by ID or Name..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="admin-filter-box">
            <MdFilterList size={20} color="var(--text-muted)" />
            <select value={branchFilter} onChange={e => setBranchFilter(e.target.value)}>
              <option value="All">All Branches</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Electronics">Electronics</option>
              <option value="Mechanical">Mechanical</option>
            </select>
          </div>
        </div>

        <div className="admin-students-table-wrap">
          <table className="admin-students-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Branch</th>
                <th>Semester</th>
                <th>CGPA</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, i) => (
                <tr key={student.id} className="animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                  <td style={{ fontWeight: 600, color: 'var(--primary-600)' }}>{student.id}</td>
                  <td style={{ fontWeight: 600 }}>{student.name}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{student.branch}</td>
                  <td>{student.sem}</td>
                  <td style={{ fontWeight: 600 }}>{student.cgpa}</td>
                  <td>
                    <span className={`badge ${student.status === 'Active' ? 'badge-success' : 'badge-warning'}`}>
                      {student.status}
                    </span>
                  </td>
                  <td>
                    <div className="admin-students-actions">
                      <button className="icon-btn edit-btn" title="Edit"><MdEdit size={18} /></button>
                      <button className="icon-btn delete-btn" title="Delete" onClick={() => handleDelete(student.id)}><MdDelete size={18} /></button>
                      <button className="icon-btn" title="More"><MdMoreVert size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No students found matching your criteria.
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
