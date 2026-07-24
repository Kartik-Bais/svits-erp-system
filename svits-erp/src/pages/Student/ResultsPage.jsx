import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis
} from 'recharts'
import { MdStar, MdTrendingUp, MdEmojiEvents, MdTimeline, MdClose } from 'react-icons/md'
import './ResultsPage.css'

const SEMESTERS = [
  {
    sem: 'Semester 1', year: '2023', sgpa: 7.8, credits: 22,
    subjects: [
      { code: 'MA101', name: 'Engineering Mathematics I',   credits: 4, internal: 38, external: 65, total: 103, grade: 'B+', gradePoint: 8 },
      { code: 'PH101', name: 'Engineering Physics',         credits: 3, internal: 35, external: 58, total: 93,  grade: 'B',  gradePoint: 7 },
      { code: 'CS101', name: 'Programming Fundamentals',    credits: 4, internal: 42, external: 72, total: 114, grade: 'A',  gradePoint: 9 },
      { code: 'EE101', name: 'Basic Electrical Engineering',credits: 3, internal: 30, external: 50, total: 80,  grade: 'C+', gradePoint: 6 },
      { code: 'ME101', name: 'Engineering Drawing',         credits: 2, internal: 36, external: 60, total: 96,  grade: 'B+', gradePoint: 8 },
    ]
  },
  {
    sem: 'Semester 2', year: '2023', sgpa: 8.1, credits: 22,
    subjects: [
      { code: 'MA102', name: 'Engineering Mathematics II',  credits: 4, internal: 40, external: 68, total: 108, grade: 'A',  gradePoint: 9 },
      { code: 'CS102', name: 'Data Structures',              credits: 4, internal: 44, external: 74, total: 118, grade: 'A+', gradePoint: 10 },
      { code: 'CS103', name: 'Computer Organization',        credits: 3, internal: 36, external: 60, total: 96,  grade: 'B+', gradePoint: 8 },
      { code: 'EC101', name: 'Digital Electronics',          credits: 3, internal: 32, external: 55, total: 87,  grade: 'B',  gradePoint: 7 },
      { code: 'HS101', name: 'Communication Skills',         credits: 2, internal: 38, external: 62, total: 100, grade: 'A',  gradePoint: 9 },
    ]
  },
  {
    sem: 'Semester 3', year: '2024', sgpa: 8.3, credits: 24,
    subjects: [
      { code: 'CS201', name: 'Algorithm Design',             credits: 4, internal: 42, external: 70, total: 112, grade: 'A',  gradePoint: 9 },
      { code: 'CS202', name: 'Object-Oriented Programming',  credits: 4, internal: 45, external: 76, total: 121, grade: 'A+', gradePoint: 10 },
      { code: 'CS203', name: 'Database Systems',              credits: 4, internal: 38, external: 65, total: 103, grade: 'B+', gradePoint: 8 },
      { code: 'CS204', name: 'Operating Systems',             credits: 4, internal: 40, external: 68, total: 108, grade: 'A',  gradePoint: 9 },
      { code: 'MA201', name: 'Discrete Mathematics',          credits: 4, internal: 35, external: 58, total: 93,  grade: 'B',  gradePoint: 7 },
    ]
  },
  {
    sem: 'Semester 4', year: '2024', sgpa: 8.5, credits: 24,
    subjects: [
      { code: 'CS205', name: 'Computer Networks',             credits: 4, internal: 44, external: 72, total: 116, grade: 'A',  gradePoint: 9 },
      { code: 'CS206', name: 'Software Engineering',          credits: 4, internal: 42, external: 70, total: 112, grade: 'A',  gradePoint: 9 },
      { code: 'CS207', name: 'Theory of Computation',         credits: 4, internal: 36, external: 62, total: 98,  grade: 'B+', gradePoint: 8 },
      { code: 'CS208', name: 'Microprocessors',               credits: 4, internal: 38, external: 65, total: 103, grade: 'B+', gradePoint: 8 },
      { code: 'HS201', name: 'Professional Ethics',           credits: 2, internal: 43, external: 74, total: 117, grade: 'A+', gradePoint: 10 },
    ]
  },
  {
    sem: 'Semester 5', year: '2025', sgpa: 8.6, credits: 24,
    subjects: [
      { code: 'CS301', name: 'Compiler Design',               credits: 4, internal: 44, external: 74, total: 118, grade: 'A+', gradePoint: 10 },
      { code: 'CS302', name: 'Machine Learning',               credits: 4, internal: 42, external: 70, total: 112, grade: 'A',  gradePoint: 9 },
      { code: 'CS303', name: 'Web Development',                credits: 4, internal: 46, external: 78, total: 124, grade: 'A+', gradePoint: 10 },
      { code: 'CS304', name: 'Cloud Computing',                credits: 4, internal: 40, external: 68, total: 108, grade: 'A',  gradePoint: 9 },
      { code: 'CS305', name: 'Cryptography',                   credits: 4, internal: 36, external: 62, total: 98,  grade: 'B+', gradePoint: 8 },
    ]
  },
]

const CGPA_CHART = SEMESTERS.map(s => ({ sem: s.sem.replace('Semester ', 'S'), sgpa: s.sgpa }))

const RADAR_DATA = [
  { subject: 'Programming', score: 9.2 },
  { subject: 'Maths',       score: 7.8 },
  { subject: 'Systems',     score: 8.5 },
  { subject: 'Networks',    score: 8.8 },
  { subject: 'Web Dev',     score: 9.5 },
  { subject: 'AI/ML',       score: 8.2 },
]

const GRADE_COLORS = {
  'A+': { bg: '#d1fae5', color: '#065f46' },
  'A':  { bg: '#e0f2fe', color: '#0c4a6e' },
  'B+': { bg: 'var(--primary-50)', color: 'var(--primary-700)' },
  'B':  { bg: '#fef3c7', color: '#92400e' },
  'C+': { bg: '#fee2e2', color: '#991b1b' },
  'C':  { bg: '#fee2e2', color: '#991b1b' },
}

export default function ResultsPage() {
  const [activeSem, setActiveSem] = useState(SEMESTERS.length - 1)
  const sem = SEMESTERS[activeSem]

  // Predictor State
  const [isPredictorOpen, setIsPredictorOpen] = useState(false)
  const [targetCGPA, setTargetCGPA] = useState('')
  const [predictedSGPA, setPredictedSGPA] = useState(null)
  
  // Calculate Predictor
  const currentTotalCredits = SEMESTERS.reduce((sum, s) => sum + s.credits, 0)
  const currentTotalPoints = SEMESTERS.reduce((sum, s) => sum + (s.sgpa * s.credits), 0)
  const currentCGPA = (currentTotalPoints / currentTotalCredits).toFixed(2)
  const upcomingSemCredits = 24 // Assumption for next sem

  const calculateRequiredSGPA = (e) => {
    e.preventDefault()
    const target = parseFloat(targetCGPA)
    if (isNaN(target)) return

    const newTotalCredits = currentTotalCredits + upcomingSemCredits
    const requiredTotalPoints = target * newTotalCredits
    let requiredPointsNextSem = requiredTotalPoints - currentTotalPoints
    let requiredSGPA = requiredPointsNextSem / upcomingSemCredits
    setPredictedSGPA(requiredSGPA)
  }

  return (
    <div className="results-page" id="results-page">
      <div className="page-header">
        <div>
          <h1 className="page-title"> Academic Results</h1>
          <p className="page-subtitle">Comprehensive performance report — B.Tech IT</p>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button className="btn btn-outline" onClick={() => setIsPredictorOpen(true)}>
            <MdTimeline size={18} style={{ marginRight: 6, verticalAlign: 'middle' }} />
            Predict CGPA
          </button>
          <div className="res-cgpa-badge">
            <MdEmojiEvents size={20} color="var(--accent-orange)" />
            <span>CGPA <strong>{currentCGPA}</strong></span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/ 10</span>
          </div>
        </div>
      </div>

      {/* Top stats */}
      <div className="res-top-stats animate-fade-in">
        {[
          { label: 'Current CGPA',    value: '8.74', icon: '', color: 'var(--primary-500)', bg: 'var(--primary-50)' },
          { label: 'Credits Earned',  value: '116',  icon: '', color: 'var(--accent-green)', bg: '#d1fae5' },
          { label: 'Semesters Done',  value: '5',    icon: '', color: 'var(--accent-purple)', bg: '#ede9fe' },
          { label: 'A+ Grades',       value: '8',    icon: '', color: 'var(--accent-orange)', bg: '#fef3c7' },
        ].map((s, i) => (
          <div key={i} className="sd-stat-card" style={{ '--accent': s.color }}>
            <div className="sd-stat-icon" style={{ background: s.bg, color: s.color }}>
              <span style={{ fontSize: '1.4rem' }}>{s.icon}</span>
            </div>
            <div className="sd-stat-body">
              <p className="sd-stat-value" style={{ color: s.color }}>{s.value}</p>
              <p className="sd-stat-label">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="res-charts-row animate-fade-in delay-1">
        {/* CGPA Trend */}
        <div className="card">
          <div className="card-header">
            <h2 className="section-title"><MdTrendingUp size={17} style={{ verticalAlign: 'middle', color: 'var(--primary-500)', marginRight: 6 }} /> CGPA Progression</h2>
          </div>
          <div className="card-body" style={{ paddingTop: 8 }}>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={CGPA_CHART} margin={{ top: 5, right: 10, left: -20, bottom: 5 }} barSize={36}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="sem" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis domain={[6, 10]} tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v) => [`${v}`, 'SGPA']} />
                <Bar dataKey="sgpa" radius={[8, 8, 0, 0]} fill="url(#barGrad)" />
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4F8EF7" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Skill Radar */}
        <div className="card">
          <div className="card-header">
            <h2 className="section-title"><MdStar size={17} style={{ verticalAlign: 'middle', color: 'var(--accent-orange)', marginRight: 6 }} /> Skill Radar</h2>
          </div>
          <div className="card-body" style={{ paddingTop: 8 }}>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={RADAR_DATA}>
                <PolarGrid stroke="var(--border-color)" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} />
                <Radar name="Score" dataKey="score" stroke="var(--primary-500)" fill="var(--primary-500)" fillOpacity={0.2} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Semester Tabs + Table */}
      <div className="card animate-fade-in delay-2">
        <div className="card-header">
          <h2 className="section-title"> Semester-wise Results</h2>
        </div>
        {/* Sem tabs */}
        <div className="res-sem-tabs">
          {SEMESTERS.map((s, i) => (
            <button
              key={i}
              className={`res-sem-tab ${activeSem === i ? 'active' : ''}`}
              onClick={() => setActiveSem(i)}
              id={`sem-tab-${i + 1}`}
            >
              <span>Sem {i + 1}</span>
              <span className={`res-sgpa-chip ${activeSem === i ? 'active' : ''}`}>{s.sgpa}</span>
            </button>
          ))}
        </div>

        {/* Result table */}
        <div className="at-table-wrapper">
          <table className="at-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Subject Name</th>
                <th style={{ textAlign: 'center' }}>Credits</th>
                <th style={{ textAlign: 'center' }}>Internal (50)</th>
                <th style={{ textAlign: 'center' }}>External (100)</th>
                <th style={{ textAlign: 'center' }}>Total</th>
                <th style={{ textAlign: 'center' }}>Grade</th>
                <th style={{ textAlign: 'center' }}>Grade Point</th>
              </tr>
            </thead>
            <tbody>
              {sem.subjects.map((s, i) => (
                <tr key={i} className="at-row" style={{ cursor: 'default' }}>
                  <td style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--primary-600)' }}>{s.code}</td>
                  <td style={{ fontWeight: 500 }}>{s.name}</td>
                  <td style={{ textAlign: 'center' }}>{s.credits}</td>
                  <td style={{ textAlign: 'center' }}>{s.internal}</td>
                  <td style={{ textAlign: 'center' }}>{s.external}</td>
                  <td style={{ textAlign: 'center', fontWeight: 700 }}>{s.total}</td>
                  <td style={{ textAlign: 'center' }}>
                    <span className="badge" style={{ background: GRADE_COLORS[s.grade]?.bg, color: GRADE_COLORS[s.grade]?.color }}>
                      {s.grade}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center', fontWeight: 700, color: 'var(--primary-600)', fontFamily: 'var(--font-heading)' }}>{s.gradePoint}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ background: 'var(--neutral-50)', fontWeight: 700 }}>
                <td colSpan={2} style={{ padding: '12px 16px', fontFamily: 'var(--font-heading)' }}>SGPA</td>
                <td style={{ textAlign: 'center', padding: '12px 16px' }}>{sem.credits}</td>
                <td colSpan={4} />
                <td style={{ textAlign: 'center', padding: '12px 16px', color: 'var(--primary-600)', fontSize: '1.125rem', fontFamily: 'var(--font-heading)' }}>{sem.sgpa}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* CGPA Predictor Modal */}
      {isPredictorOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 450, width: '90%' }}>
            <div className="modal-header">
              <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <MdTimeline color="var(--primary-500)" />
                Target CGPA Predictor
              </h3>
              <button className="modal-close" onClick={() => { setIsPredictorOpen(false); setPredictedSGPA(null); setTargetCGPA('') }}>
                <MdClose size={20} />
              </button>
            </div>
            <div className="modal-body" style={{ padding: 24 }}>
              <div style={{ background: 'var(--bg-main)', padding: 16, borderRadius: 'var(--radius-md)', marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Current CGPA:</span>
                  <strong style={{ color: 'var(--primary-600)' }}>{currentCGPA}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Credits Earned:</span>
                  <strong>{currentTotalCredits}</strong>
                </div>
              </div>

              <form onSubmit={calculateRequiredSGPA}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Target CGPA (out of 10):</label>
                <input 
                  type="number" 
                  step="0.01" 
                  min="0" max="10" 
                  required
                  value={targetCGPA}
                  onChange={(e) => setTargetCGPA(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: 20 }}
                  placeholder="e.g. 9.0"
                />
                
                {predictedSGPA !== null && (
                  <div style={{ padding: 16, borderRadius: 'var(--radius-md)', background: predictedSGPA > 10 ? 'var(--bg-card)' : 'var(--primary-50)', color: predictedSGPA > 10 ? 'var(--accent-red)' : 'var(--primary-700)', border: `1px solid ${predictedSGPA > 10 ? 'var(--accent-red)' : 'var(--primary-300)'}`, marginBottom: 20, textAlign: 'center' }}>
                    <p style={{ margin: 0, fontSize: '0.9rem' }}>Required SGPA for next semester:</p>
                    <p style={{ margin: '8px 0 0', fontSize: '1.75rem', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
                      {predictedSGPA > 10 ? 'Impossible (>10)' : predictedSGPA <= 0 ? '0.00 (Relax!)' : predictedSGPA.toFixed(2)}
                    </p>
                  </div>
                )}

                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  Calculate Required SGPA
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
