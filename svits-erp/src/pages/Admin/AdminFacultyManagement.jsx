import { useState } from 'react'
import { MdSearch, MdFilterList, MdAdd, MdDownload, MdMoreVert, MdEdit, MdDelete } from 'react-icons/md'
import toast from 'react-hot-toast'
import './AdminStudentManagement.css' // Reusing CSS

const MOCK_FACULTY = [
  { id: 'F001', name: 'Dr. Meena Kumari', dept: 'Computer Science', role: 'Associate Professor', experience: '12 Yrs', status: 'Active' },
  { id: 'F002', name: 'Prof. Ravi', dept: 'Information Technology', role: 'Assistant Professor', experience: '8 Yrs', status: 'Active' },
  { id: 'F003', name: 'Dr. Ramesh', dept: 'Electronics', role: 'Professor', experience: '15 Yrs', status: 'Active' },
  { id: 'F004', name: 'Mrs. Anjali', dept: 'Mathematics', role: 'Lecturer', experience: '5 Yrs', status: 'On Leave' },
  { id: 'F005', name: 'Dr. Satish', dept: 'Mechanical', role: 'HOD', experience: '20 Yrs', status: 'Active' },
]

export default function AdminFacultyManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [deptFilter, setDeptFilter] = useState('All')
  
  const filteredFaculty = MOCK_FACULTY.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase()) || f.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDept = deptFilter === 'All' || f.dept === deptFilter
    return matchesSearch && matchesDept
  })

  const handleExport = () => {
    toast.success('Faculty data exported successfully!')
  }

  const handleDelete = (id) => {
    toast.success(`Faculty ${id} removed (Mock)`)
  }

  return (
    <div className="admin-students-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">‍ Faculty Management</h1>
          <p className="page-subtitle">Manage teaching staff, roles, and departments</p>
        </div>
        <div className="admin-students-header-actions">
          <button className="btn btn-outline" onClick={handleExport}>
            <MdDownload size={18} /> Export
          </button>
          <button className="btn btn-primary">
            <MdAdd size={18} /> Add Faculty
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
            <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)}>
              <option value="All">All Departments</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Electronics">Electronics</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Mathematics">Mathematics</option>
            </select>
          </div>
        </div>

        <div className="admin-students-table-wrap">
          <table className="admin-students-table">
            <thead>
              <tr>
                <th>Faculty ID</th>
                <th>Name</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Experience</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFaculty.map((faculty, i) => (
                <tr key={faculty.id} className="animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                  <td style={{ fontWeight: 600, color: 'var(--primary-600)' }}>{faculty.id}</td>
                  <td style={{ fontWeight: 600 }}>{faculty.name}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{faculty.dept}</td>
                  <td>{faculty.role}</td>
                  <td style={{ fontWeight: 600 }}>{faculty.experience}</td>
                  <td>
                    <span className={`badge ${faculty.status === 'Active' ? 'badge-success' : 'badge-warning'}`}>
                      {faculty.status}
                    </span>
                  </td>
                  <td>
                    <div className="admin-students-actions">
                      <button className="icon-btn edit-btn" title="Edit"><MdEdit size={18} /></button>
                      <button className="icon-btn delete-btn" title="Delete" onClick={() => handleDelete(faculty.id)}><MdDelete size={18} /></button>
                      <button className="icon-btn" title="More"><MdMoreVert size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredFaculty.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No faculty found matching your criteria.
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
