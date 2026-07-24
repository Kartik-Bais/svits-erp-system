import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { Toaster } from 'react-hot-toast'
import ProtectedRoute from './router/ProtectedRoute'
import DashboardLayout from './components/DashboardLayout/DashboardLayout'
import ComingSoon from './components/ComingSoon/ComingSoon'

// Public Pages
import SplashPage       from './pages/Splash/SplashPage'
import WelcomePage      from './pages/Welcome/WelcomePage'
import LoginPage        from './pages/Login/LoginPage'
import SignupPage       from './pages/Signup/SignupPage'
import ForgotPasswordPage from './pages/ForgotPassword/ForgotPasswordPage'
import ResetPasswordPage  from './pages/ResetPassword/ResetPasswordPage'

// Role Dashboards
import StudentDashboard from './pages/Student/StudentDashboard'
import FacultyDashboard from './pages/Faculty/FacultyDashboard'
import AdminDashboard   from './pages/Admin/AdminDashboard'
import ParentDashboard  from './pages/Parent/ParentDashboard'

// Phase 2: Student Academic Pages
import TimetablePage    from './pages/Student/TimetablePage'
import AttendancePage   from './pages/Student/AttendancePage'
import AssignmentsPage  from './pages/Student/AssignmentsPage'
import ResultsPage      from './pages/Student/ResultsPage'
import ProfilePage      from './pages/Student/ProfilePage'

import StudentLibraryPage from './pages/Student/StudentLibraryPage'
import StudentHostelPage from './pages/Student/StudentHostelPage'
import StudentTransportPage from './pages/Student/StudentTransportPage'
import StudentCanteenPage from './pages/Student/StudentCanteenPage'
import StudentPlacementPage from './pages/Student/StudentPlacementPage'
import StudentFinancePage from './pages/Student/StudentFinancePage'
import CampusAssistantPage from './pages/Shared/CampusAssistantPage'

function StudentRoutes() {
  return (
    <ProtectedRoute allowedRoles={['student']}>
      <DashboardLayout>
        <Routes>
          <Route path="dashboard"   element={<StudentDashboard />} />
          <Route path="timetable"   element={<TimetablePage />} />
          <Route path="attendance"  element={<AttendancePage />} />
          <Route path="assignments" element={<AssignmentsPage />} />
          <Route path="results"     element={<ResultsPage />} />
          <Route path="profile"     element={<ProfilePage />} />
          <Route path="placement"   element={<StudentPlacementPage />} />
          <Route path="finance"     element={<StudentFinancePage />} />
          <Route path="library"     element={<StudentLibraryPage />} />
          <Route path="hostel"      element={<StudentHostelPage />} />
          <Route path="transport"   element={<StudentTransportPage />} />
          <Route path="canteen"     element={<StudentCanteenPage />} />
          <Route path="ai"          element={<CampusAssistantPage />} />
          <Route path="*"           element={<Navigate to="dashboard" replace />} />
        </Routes>
      </DashboardLayout>
    </ProtectedRoute>
  )
}

// Phase 3: Faculty Pages
import StudentManagementPage from './pages/Faculty/StudentManagementPage'
import FacultyTimetablePage from './pages/Faculty/FacultyTimetablePage'
import AttendanceManagementPage from './pages/Faculty/AttendanceManagementPage'
import MarksEntryPage from './pages/Faculty/MarksEntryPage'
import LeaveManagementPage from './pages/Faculty/LeaveManagementPage'
import FacultyProfilePage from './pages/Faculty/FacultyProfilePage'

function FacultyRoutes() {
  return (
    <ProtectedRoute allowedRoles={['faculty']}>
      <DashboardLayout>
        <Routes>
          <Route path="dashboard"   element={<FacultyDashboard />} />
          <Route path="students"    element={<StudentManagementPage />} />
          <Route path="timetable"   element={<FacultyTimetablePage />} />
          <Route path="attendance"  element={<AttendanceManagementPage />} />
          <Route path="results"     element={<MarksEntryPage />} />
          <Route path="leave"       element={<LeaveManagementPage />} />
          <Route path="profile"     element={<FacultyProfilePage />} />
          <Route path="ai"          element={<CampusAssistantPage />} />
          <Route path="*"           element={<Navigate to="dashboard" replace />} />
        </Routes>
      </DashboardLayout>
    </ProtectedRoute>
  )
}

import AdminStudentManagement from './pages/Admin/AdminStudentManagement'
import AdminFacultyManagement from './pages/Admin/AdminFacultyManagement'
import AdminAdmissions from './pages/Admin/AdminAdmissions'
import AdminFinance from './pages/Admin/AdminFinance'
import AdminSettings from './pages/Admin/AdminSettings'
import AdminProfile from './pages/Admin/AdminProfile'

function AdminRoutes() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <DashboardLayout>
        <Routes>
          <Route path="dashboard"   element={<AdminDashboard />} />
          <Route path="students"    element={<AdminStudentManagement />} />
          <Route path="faculty"     element={<AdminFacultyManagement />} />
          <Route path="admissions"  element={<AdminAdmissions />} />
          <Route path="finance"     element={<AdminFinance />} />
          <Route path="settings"    element={<AdminSettings />} />
          <Route path="profile"     element={<AdminProfile />} />
          <Route path="ai"          element={<CampusAssistantPage />} />
          <Route path="*"           element={<Navigate to="dashboard" replace />} />
        </Routes>
      </DashboardLayout>
    </ProtectedRoute>
  )
}

// Phase 3: Parent Pages
import ParentAttendancePage from './pages/Parent/ParentAttendancePage'
import ParentResultsPage from './pages/Parent/ParentResultsPage'
import ParentFinancePage from './pages/Parent/ParentFinancePage'
import ParentPTMPage from './pages/Parent/ParentPTMPage'
import ParentProfilePage from './pages/Parent/ParentProfilePage'

function ParentRoutes() {
  return (
    <ProtectedRoute allowedRoles={['parent']}>
      <DashboardLayout>
        <Routes>
          <Route path="dashboard"   element={<ParentDashboard />} />
          <Route path="attendance"  element={<ParentAttendancePage />} />
          <Route path="results"     element={<ParentResultsPage />} />
          <Route path="finance"     element={<ParentFinancePage />} />
          <Route path="ptm"         element={<ParentPTMPage />} />
          <Route path="profile"     element={<ParentProfilePage />} />
          <Route path="ai"          element={<CampusAssistantPage />} />
          <Route path="*"           element={<Navigate to="dashboard" replace />} />
        </Routes>
      </DashboardLayout>
    </ProtectedRoute>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Toaster 
        position="top-right" 
        toastOptions={{
          duration: 3000,
          style: {
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--border-color)',
            fontWeight: 500,
            padding: '12px 20px',
          },
          success: {
            iconTheme: { primary: 'var(--accent-green)', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: 'var(--accent-red)', secondary: '#fff' },
          }
        }}
      />
      <Routes>
        {/* Public */}
        <Route path="/"        element={<SplashPage />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/login"   element={<LoginPage />} />
        <Route path="/signup"  element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Protected role routes */}
        <Route path="/student/*" element={<StudentRoutes />} />
        <Route path="/faculty/*" element={<FacultyRoutes />} />
        <Route path="/admin/*"   element={<AdminRoutes />} />
        <Route path="/parent/*"  element={<ParentRoutes />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}
