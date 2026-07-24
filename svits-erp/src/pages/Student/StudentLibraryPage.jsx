import { useState } from 'react'
import { MdSearch, MdBook, MdHistory, MdWarning, MdLibraryBooks } from 'react-icons/md'
import toast from 'react-hot-toast'
import './StudentLibraryPage.css'

const ISSUED_BOOKS = [
  { id: 'B101', title: 'Operating System Concepts', author: 'Silberschatz, Galvin', issued: '10 Jul 2026', due: '24 Jul 2026', fine: 0 },
  { id: 'B102', title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', issued: '01 Jul 2026', due: '15 Jul 2026', fine: 15 },
]

const CATALOG_BOOKS = [
  { id: 'C201', title: 'Clean Code', author: 'Robert C. Martin', availability: 'Available' },
  { id: 'C202', title: 'Design Patterns', author: 'Erich Gamma', availability: 'Checked Out' },
  { id: 'C203', title: 'Computer Networking', author: 'Kurose, Ross', availability: 'Available' },
]

export default function StudentLibraryPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const handleReserve = (title) => {
    toast.success(`Reserved '${title}' successfully!`)
  }

  const handleRenew = (title) => {
    toast.success(`Renewal requested for '${title}'.`)
  }

  return (
    <div className="student-library-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title"> Central Library</h1>
          <p className="page-subtitle">Access digital catalog, track issued books, and manage fines</p>
        </div>
      </div>

      <div className="library-stats">
        <div className="card library-stat-card">
          <div className="library-stat-icon"><MdBook size={28} /></div>
          <div>
            <div className="library-stat-label">Books Issued</div>
            <div className="library-stat-value">{ISSUED_BOOKS.length} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ 5</span></div>
          </div>
        </div>
        <div className="card library-stat-card">
          <div className="library-stat-icon" style={{ color: 'var(--accent-red)', background: '#fef2f2' }}><MdWarning size={28} /></div>
          <div>
            <div className="library-stat-label">Total Fine Due</div>
            <div className="library-stat-value" style={{ color: 'var(--accent-red)' }}>
              ₹{ISSUED_BOOKS.reduce((acc, curr) => acc + curr.fine, 0)}
            </div>
          </div>
        </div>
      </div>

      <div className="library-grid">
        <div className="card animate-fade-in delay-1">
          <div className="card-header">
            <h2 className="section-title">Currently Issued</h2>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            {ISSUED_BOOKS.map(book => (
              <div key={book.id} className="library-issued-book">
                <div className="library-book-info">
                  <div className="library-book-icon"><MdLibraryBooks size={24} /></div>
                  <div>
                    <h3 className="library-book-title">{book.title}</h3>
                    <p className="library-book-author">{book.author}</p>
                  </div>
                </div>
                <div className="library-book-dates">
                  <div><small>Issued:</small><br/>{book.issued}</div>
                  <div style={{ color: book.fine > 0 ? 'var(--accent-red)' : 'var(--text-primary)' }}>
                    <small>Due:</small><br/>{book.due}
                  </div>
                  <div><small>Fine:</small><br/><strong style={{ color: book.fine > 0 ? 'var(--accent-red)' : 'var(--accent-green)' }}>₹{book.fine}</strong></div>
                </div>
                <div className="library-book-actions">
                  <button className="btn btn-outline-primary btn-sm" onClick={() => handleRenew(book.title)}>Renew</button>
                  {book.fine > 0 && <button className="btn btn-primary btn-sm">Pay Fine</button>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card animate-fade-in delay-2">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <h2 className="section-title">Search Catalog</h2>
            <div className="library-search-box">
              <MdSearch size={20} color="var(--text-muted)" />
              <input 
                type="text" 
                placeholder="Search by title, author, or ISBN..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="card-body">
            <div className="library-catalog-list">
              {CATALOG_BOOKS.filter(b => b.title.toLowerCase().includes(searchTerm.toLowerCase())).map(book => (
                <div key={book.id} className="library-catalog-item">
                  <div className="library-catalog-info">
                    <h4>{book.title}</h4>
                    <p>{book.author}</p>
                  </div>
                  <div className="library-catalog-status">
                    <span className={`badge ${book.availability === 'Available' ? 'badge-success' : 'badge-warning'}`}>
                      {book.availability}
                    </span>
                    {book.availability === 'Available' && (
                      <button className="btn btn-outline btn-sm" onClick={() => handleReserve(book.title)}>Reserve</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
