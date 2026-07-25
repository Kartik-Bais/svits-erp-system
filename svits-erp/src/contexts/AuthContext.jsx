import { createContext, useContext, useState, useCallback } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)



export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('svits-user')
      return saved ? JSON.parse(saved) : null
    } catch { return null }
  })
  const [loading, setLoading] = useState(false)

  const signup = useCallback(async (name, email, password, role) => {
    setLoading(true)
    // Simulate async API call
    await new Promise(r => setTimeout(r, 900))
    
    // Store name in mock db so it persists for login
    const mockUsers = JSON.parse(localStorage.getItem('svits-mock-users') || '{}')
    mockUsers[email] = name
    localStorage.setItem('svits-mock-users', JSON.stringify(mockUsers))

    const userData = {
      id: `${role.charAt(0).toUpperCase()}${Date.now().toString().slice(-6)}`,
      name: name,
      email: email,
      role: role,
      avatar: null,
      isFirstLogin: true, 
    }
    
    if (role === 'student') {
      Object.assign(userData, {
        rollNo: '21IT001', branch: 'Information Technology', semester: '6th', cgpa: '8.74', year: '3rd Year', department: 'IT', phone: '+91 98765 43210', address: 'Indore, MP', fatherName: 'Father Name', motherName: 'Mother Name', dob: '2004-01-01', bloodGroup: 'O+',
      })
    } else if (role === 'faculty') {
       Object.assign(userData, { department: 'Computer Science', designation: 'Professor', qualification: 'Ph.D', experience: '5 years', phone: '+91 87654 32109' })
    } else if (role === 'admin') {
       Object.assign(userData, { designation: 'System Administrator' })
    } else if (role === 'parent') {
       Object.assign(userData, { ward: 'Arjun Sharma', wardRollNo: '21IT001' })
    }

    setUser(userData)
    localStorage.setItem('svits-user', JSON.stringify(userData))

    setLoading(false)
    return { success: true }
  }, [])

  const login = useCallback(async (email, password, role) => {
    setLoading(true)
    // Simulate async API call
    await new Promise(r => setTimeout(r, 900))
    
    // Check if user signed up and has a saved name
    const mockUsers = JSON.parse(localStorage.getItem('svits-mock-users') || '{}')
    let formattedName = mockUsers[email]
    
    if (!formattedName) {
      // Fallback: Parse name from email (e.g. john.doe@... -> John Doe)
      const namePart = email.split('@')[0]
      formattedName = namePart.split(/[\.\-_]/).map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ')
    }
    
    // Base user object dynamically created
    const userData = {
      id: `${role.charAt(0).toUpperCase()}${Date.now().toString().slice(-6)}`,
      name: formattedName,
      email: email,
      role: role,
      avatar: null,
      isFirstLogin: true, // Show onboarding on first login
    }
    
    // Hydrate required dashboard fields so the UI doesn't break
    if (role === 'student') {
      Object.assign(userData, {
        rollNo: '21IT001',
        branch: 'Information Technology',
        semester: '6th',
        cgpa: '8.74',
        year: '3rd Year',
        department: 'IT',
        phone: '+91 98765 43210',
        address: 'Indore, MP',
        fatherName: 'Father Name',
        motherName: 'Mother Name',
        dob: '2004-01-01',
        bloodGroup: 'O+',
      })
    } else if (role === 'faculty') {
       Object.assign(userData, {
        department: 'Computer Science',
        designation: 'Professor',
        qualification: 'Ph.D',
        experience: '5 years',
        phone: '+91 87654 32109',
       })
    } else if (role === 'admin') {
       Object.assign(userData, {
        designation: 'System Administrator',
       })
    } else if (role === 'parent') {
       Object.assign(userData, {
        ward: 'Arjun Sharma',
        wardRollNo: '21IT001',
       })
    }

    setUser(userData)
    localStorage.setItem('svits-user', JSON.stringify(userData))
    setLoading(false)
    return { success: true }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('svits-user')
  }, [])

  const markOnboardingDone = useCallback(() => {
    setUser(prev => {
      if (!prev) return prev
      const updated = { ...prev, isFirstLogin: false }
      localStorage.setItem('svits-user', JSON.stringify(updated))
      return updated
    })
  }, [])

  const googleLogin = useCallback(async (idToken) => {
    setLoading(true)
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'}/auth/google`, { idToken })
      
      const { user: backendUser, accessToken } = response.data.data
      
      // Store token securely
      localStorage.setItem('svits-access-token', accessToken)
      
      // We will map the backend user to the frontend format for now
      // Or just save it directly if it matches
      const userData = {
        ...backendUser,
        isFirstLogin: false
      }
      
      setUser(userData)
      localStorage.setItem('svits-user', JSON.stringify(userData))
      setLoading(false)
      return { success: true }
    } catch (error) {
      setLoading(false)
      console.error('Google login failed:', error)
      return { success: false, error: error.response?.data?.message || 'Google Login Failed' }
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, googleLogin, markOnboardingDone }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
