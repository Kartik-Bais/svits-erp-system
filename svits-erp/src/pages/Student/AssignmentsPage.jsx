import { useState, useRef } from 'react'
import { MdAdd, MdDragIndicator, MdCalendarToday, MdPerson, MdAttachFile,
         MdCheck, MdClose, MdViewKanban, MdList, MdUpload } from 'react-icons/md'
import './AssignmentsPage.css'

const ASSIGNMENTS = [
  { id: 'a1', title: 'DSA - Sorting Algorithms Analysis', subject: 'CS301', faculty: 'Dr. Rao',
    due: '2026-07-19', submitted: false, marks: null, maxMarks: 20, urgent: true,
    description: 'Implement and compare Merge Sort, Quick Sort, and Heap Sort. Plot time complexity graphs.',
    files: ['DSA_Assignment2.pdf'], color: '#8b5cf6' },
  { id: 'a2', title: 'OS - Process Scheduling Simulation', subject: 'CS302', faculty: 'Prof. Meena',
    due: '2026-07-22', submitted: false, marks: null, maxMarks: 20, urgent: true,
    description: 'Simulate Round Robin, SJF, and FCFS scheduling algorithms with Gantt charts.',
    files: [], color: '#4F8EF7' },
  { id: 'a3', title: 'DBMS - SQL Mini Project', subject: 'CS303', faculty: 'Dr. Anand',
    due: '2026-07-28', submitted: true, marks: 18, maxMarks: 20, urgent: false,
    description: 'Design and implement a Library Management System using MySQL.',
    files: ['DBMS_Project.sql', 'report.pdf'], color: '#06b6d4' },
  { id: 'a4', title: 'Web Tech - React Portfolio Website', subject: 'CS304', faculty: 'Prof. Ravi',
    due: '2026-07-30', submitted: false, marks: null, maxMarks: 25, urgent: false,
    description: 'Build a personal portfolio using React.js with at least 4 sections.',
    files: [], color: '#10b981' },
  { id: 'a5', title: 'Soft Skills - Resume Writing', subject: 'HS301', faculty: 'Ms. Lakshmi',
    due: '2026-07-15', submitted: true, marks: 10, maxMarks: 10, urgent: false,
    description: 'Write a professional resume following ATS-friendly format.',
    files: ['Resume_ArjunSharma.pdf'], color: '#f59e0b' },
]

const KANBAN_INITIAL = {
  todo:        [
    { id: 'k1', text: 'Research sorting algorithms', tag: 'DSA' },
    { id: 'k2', text: 'Draw ER diagram for DBMS project', tag: 'DBMS' },
    { id: 'k3', text: 'Setup React development environment', tag: 'Web' },
  ],
  inProgress:  [
    { id: 'k4', text: 'Implement Merge Sort in Python', tag: 'DSA' },
    { id: 'k5', text: 'Write Gantt charts for OS simulation', tag: 'OS' },
  ],
  review:      [
    { id: 'k6', text: 'Get DSA report reviewed by friend', tag: 'DSA' },
  ],
  done:        [
    { id: 'k7', text: 'Submit Resume Writing assignment', tag: 'Soft Skills' },
    { id: 'k8', text: 'Push DBMS project to GitHub', tag: 'DBMS' },
  ],
}

const KANBAN_COLS = [
  { key: 'todo',       label: ' To Do',       color: 'var(--neutral-400)', bg: 'var(--neutral-50)' },
  { key: 'inProgress', label: ' In Progress',  color: 'var(--accent-orange)', bg: '#fff7ed' },
  { key: 'review',     label: ' Review',        color: 'var(--primary-500)', bg: 'var(--primary-50)' },
  { key: 'done',       label: ' Done',           color: 'var(--accent-green)', bg: '#f0fdf4' },
]

const TAG_COLORS = {
  DSA: { bg: '#ede9fe', color: '#7c3aed' },
  DBMS: { bg: '#cffafe', color: '#0e7490' },
  OS: { bg: 'var(--primary-50)', color: 'var(--primary-700)' },
  Web: { bg: '#d1fae5', color: '#065f46' },
  'Soft Skills': { bg: '#fef3c7', color: '#92400e' },
}

export default function AssignmentsPage() {
  const [view, setView] = useState('list')
  const [filter, setFilter] = useState('all')
  const [kanban, setKanban] = useState(KANBAN_INITIAL)
  const [newTask, setNewTask] = useState({ col: null, text: '' })
  const [dragging, setDragging] = useState(null)
  const [uploadModal, setUploadModal] = useState(null)

  // Drag-and-drop
  const onDragStart = (item, fromCol) => setDragging({ item, fromCol })
  const onDrop = (toCol) => {
    if (!dragging || dragging.fromCol === toCol) return
    setKanban(prev => {
      const from = prev[dragging.fromCol].filter(i => i.id !== dragging.item.id)
      const to = [...prev[toCol], dragging.item]
      return { ...prev, [dragging.fromCol]: from, [toCol]: to }
    })
    setDragging(null)
  }

  const addTask = (col) => {
    if (!newTask.text.trim()) return
    const task = { id: `k${Date.now()}`, text: newTask.text, tag: 'General' }
    setKanban(prev => ({ ...prev, [col]: [...prev[col], task] }))
    setNewTask({ col: null, text: '' })
  }

  const removeKanbanTask = (col, id) => {
    setKanban(prev => ({ ...prev, [col]: prev[col].filter(i => i.id !== id) }))
  }

  const filtered = filter === 'all' ? ASSIGNMENTS
    : filter === 'pending' ? ASSIGNMENTS.filter(a => !a.submitted)
    : filter === 'submitted' ? ASSIGNMENTS.filter(a => a.submitted)
    : ASSIGNMENTS.filter(a => !a.submitted && new Date(a.due) < new Date(Date.now() + 3 * 86400000))

  return (
    <div className="assignments-page" id="assignments-page">
      <div className="page-header">
        <div>
          <h1 className="page-title"> Assignments</h1>
          <p className="page-subtitle">Track, submit, and manage your academic tasks</p>
        </div>
        <div className="asgn-controls">
          <div className="asgn-view-toggle">
            <button className={`tt-toggle-btn ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')} id="asgn-list-btn">
              <MdList size={16} /> List
            </button>
            <button className={`tt-toggle-btn ${view === 'kanban' ? 'active' : ''}`} onClick={() => setView('kanban')} id="asgn-kanban-btn">
              <MdViewKanban size={16} /> Kanban
            </button>
          </div>
        </div>
      </div>

      {view === 'list' ? (
        <>
          {/* Filter tabs */}
          <div className="asgn-filter-tabs animate-fade-in">
            {[['all','All Assignments'],['pending','Pending'],['submitted','Submitted'],['urgent','Due Soon']].map(([k, l]) => (
              <button key={k} className={`asgn-filter-tab ${filter === k ? 'active' : ''}`} onClick={() => setFilter(k)} id={`filter-${k}`}>
                {l}
                <span className="asgn-filter-count">
                  {k === 'all' ? ASSIGNMENTS.length
                    : k === 'pending' ? ASSIGNMENTS.filter(a => !a.submitted).length
                    : k === 'submitted' ? ASSIGNMENTS.filter(a => a.submitted).length
                    : ASSIGNMENTS.filter(a => !a.submitted && new Date(a.due) < new Date(Date.now() + 3 * 86400000)).length}
                </span>
              </button>
            ))}
          </div>

          {/* Assignment cards */}
          <div className="asgn-list animate-fade-in delay-1">
            {filtered.map((a, i) => (
              <div key={a.id} className={`asgn-card animate-fade-in ${a.submitted ? 'submitted' : ''}`}
                style={{ animationDelay: `${i * 0.07}s`, borderLeft: `4px solid ${a.color}` }}>
                <div className="asgn-card-header">
                  <div className="asgn-title-row">
                    <h3 className="asgn-title">{a.title}</h3>
                    {a.urgent && !a.submitted && <span className="badge badge-danger"> Urgent</span>}
                    {a.submitted && <span className="badge badge-success"><MdCheck size={12} /> Submitted</span>}
                  </div>
                  <div className="asgn-meta">
                    <span><MdPerson size={14} /> {a.faculty}</span>
                    <span style={{ background: `${a.color}18`, color: a.color, padding: '2px 10px', borderRadius: 99, fontSize: '0.75rem', fontWeight: 600 }}>{a.subject}</span>
                    <span><MdCalendarToday size={14} /> Due: {new Date(a.due).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Max: {a.maxMarks} marks</span>
                  </div>
                </div>
                <p className="asgn-desc">{a.description}</p>

                <div className="asgn-footer">
                  <div className="asgn-files">
                    {a.files.map((f, fi) => (
                      <span key={fi} className="asgn-file-chip">
                        <MdAttachFile size={13} /> {f}
                      </span>
                    ))}
                  </div>
                  <div className="asgn-actions">
                    {a.submitted ? (
                      <div className="asgn-marks">
                        <span style={{ color: 'var(--accent-green)', fontWeight: 700, fontSize: '1rem' }}>{a.marks}/{a.maxMarks}</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>marks obtained</span>
                      </div>
                    ) : (
                      <button className="btn btn-primary btn-sm" onClick={() => setUploadModal(a)} id={`submit-${a.id}`}>
                        <MdUpload size={15} /> Submit Assignment
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* Kanban View */
        <div className="kanban-board animate-fade-in">
          {KANBAN_COLS.map(col => (
            <div
              key={col.key}
              className={`kanban-col ${dragging ? 'drop-target' : ''}`}
              onDragOver={e => e.preventDefault()}
              onDrop={() => onDrop(col.key)}
            >
              <div className="kanban-col-header" style={{ borderBottom: `3px solid ${col.color}` }}>
                <span className="kanban-col-title">{col.label}</span>
                <span className="kanban-col-count">{kanban[col.key].length}</span>
              </div>
              <div className="kanban-cards">
                {kanban[col.key].map(task => (
                  <div
                    key={task.id}
                    className="kanban-card"
                    draggable
                    onDragStart={() => onDragStart(task, col.key)}
                  >
                    <div className="kanban-card-top">
                      <MdDragIndicator size={16} style={{ color: 'var(--text-muted)', cursor: 'grab' }} />
                      <span className="kanban-card-text">{task.text}</span>
                      <button className="kanban-remove" onClick={() => removeKanbanTask(col.key, task.id)} aria-label="Remove">
                        <MdClose size={14} />
                      </button>
                    </div>
                    {task.tag && (
                      <span className="kanban-tag" style={{ background: TAG_COLORS[task.tag]?.bg || 'var(--neutral-100)', color: TAG_COLORS[task.tag]?.color || 'var(--text-secondary)' }}>
                        {task.tag}
                      </span>
                    )}
                  </div>
                ))}
              </div>
              {/* Add task */}
              {newTask.col === col.key ? (
                <div className="kanban-add-form">
                  <input
                    autoFocus
                    className="form-input"
                    placeholder="Task description..."
                    value={newTask.text}
                    onChange={e => setNewTask({ col: col.key, text: e.target.value })}
                    onKeyDown={e => { if (e.key === 'Enter') addTask(col.key); if (e.key === 'Escape') setNewTask({ col: null, text: '' }) }}
                    style={{ fontSize: '0.875rem', padding: '8px 12px' }}
                  />
                  <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                    <button className="btn btn-primary btn-sm" onClick={() => addTask(col.key)}>Add</button>
                    <button className="btn btn-secondary btn-sm" onClick={() => setNewTask({ col: null, text: '' })}>Cancel</button>
                  </div>
                </div>
              ) : (
                <button className="kanban-add-btn" onClick={() => setNewTask({ col: col.key, text: '' })} id={`kanban-add-${col.key}`}>
                  <MdAdd size={16} /> Add Task
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {uploadModal && (
        <div className="modal-backdrop" onClick={() => setUploadModal(null)}>
          <div className="modal-card animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Submit Assignment</h3>
              <button className="modal-close" onClick={() => setUploadModal(null)}><MdClose size={20} /></button>
            </div>
            <div className="modal-body">
              <p style={{ fontWeight: 600, marginBottom: 4 }}>{uploadModal.title}</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 20 }}>{uploadModal.subject} · Due: {new Date(uploadModal.due).toLocaleDateString('en-IN')}</p>
              <div className="upload-drop-zone">
                <MdUpload size={32} style={{ color: 'var(--primary-400)', marginBottom: 8 }} />
                <p style={{ fontWeight: 600 }}>Drop files here or click to upload</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 4 }}>PDF, DOCX, ZIP up to 25MB</p>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
                <button className="btn btn-secondary" onClick={() => setUploadModal(null)}>Cancel</button>
                <button className="btn btn-success" onClick={() => { alert('Assignment submitted! (Mock)'); setUploadModal(null) }}>
                  <MdCheck size={16} /> Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
