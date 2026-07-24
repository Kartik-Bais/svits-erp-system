import { useState } from 'react'
import { MdMeetingRoom, MdRestaurantMenu, MdReportProblem, MdCheckCircle } from 'react-icons/md'
import toast from 'react-hot-toast'
import './StudentHostelPage.css'

const MESS_MENU = {
  Monday: { breakfast: 'Idli, Vada, Chutney', lunch: 'Rice, Dal, Paneer Curry', dinner: 'Chapati, Mixed Veg, Salad' },
  Tuesday: { breakfast: 'Poha, Jalebi', lunch: 'Rice, Rajma, Raita', dinner: 'Fried Rice, Manchurian' },
  Wednesday: { breakfast: 'Dosa, Sambar', lunch: 'Rice, Dal Makhani, Aloo Gobi', dinner: 'Chapati, Egg Curry / Dal Tadka' },
  Thursday: { breakfast: 'Aloo Paratha, Curd', lunch: 'Veg Biryani, Raita', dinner: 'Chapati, Bhindi Masala' },
  Friday: { breakfast: 'Upma, Kesari', lunch: 'Rice, Sambar, Cabbage Poriyal', dinner: 'Chapati, Chana Masala' },
  Saturday: { breakfast: 'Puri, Sabji', lunch: 'Lemon Rice, Curd Rice', dinner: 'Noodles, Soup' },
  Sunday: { breakfast: 'Chole Bhature', lunch: 'Special Meals (Chicken / Paneer Butter Masala)', dinner: 'Chapati, Dal' },
}

export default function StudentHostelPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [complaint, setComplaint] = useState('')
  const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' })
  const menuToday = MESS_MENU[currentDay] || MESS_MENU['Monday']

  const handleComplaintSubmit = (e) => {
    e.preventDefault()
    if (!complaint.trim()) return
    toast.success('Complaint logged successfully. Warden has been notified.')
    setComplaint('')
  }

  const handleGatePass = () => {
    toast.success('Gate pass request sent for approval.')
  }

  return (
    <div className="student-hostel-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title"> Hostel Management</h1>
          <p className="page-subtitle">Manage room details, mess menu, and requests</p>
        </div>
        <button className="btn btn-primary" onClick={handleGatePass}>
          Apply for Gate Pass
        </button>
      </div>

      <div className="hostel-tabs">
        <button className={`hostel-tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
          Room Overview
        </button>
        <button className={`hostel-tab ${activeTab === 'mess' ? 'active' : ''}`} onClick={() => setActiveTab('mess')}>
          Mess Menu
        </button>
        <button className={`hostel-tab ${activeTab === 'complaints' ? 'active' : ''}`} onClick={() => setActiveTab('complaints')}>
          Complaints
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="hostel-overview-grid animate-fade-in">
          <div className="card">
            <div className="card-header"><h2 className="section-title">My Room Details</h2></div>
            <div className="card-body">
              <div className="hostel-room-info">
                <div className="hostel-room-icon"><MdMeetingRoom size={40} color="var(--primary-600)" /></div>
                <div>
                  <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '4px' }}>Block A, Room 304</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>Triple Sharing (Non-AC)</p>
                </div>
              </div>
              <div className="hostel-roomies">
                <h4>Roommates</h4>
                <ul>
                  <li><MdCheckCircle size={14} color="var(--accent-green)" /> Amit Singh (B.Tech IT)</li>
                  <li><MdCheckCircle size={14} color="var(--accent-green)" /> Rahul Verma (B.Tech CSE)</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="card-header"><h2 className="section-title">Warden Info</h2></div>
            <div className="card-body">
              <p><strong>Name:</strong> Mr. Ramesh Kumar</p>
              <p><strong>Contact:</strong> +91 98765 12345</p>
              <p><strong>Office Hours:</strong> 4:00 PM - 7:00 PM</p>
              <button className="btn btn-outline btn-sm" style={{ marginTop: 16 }}>Contact Warden</button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'mess' && (
        <div className="card animate-fade-in">
          <div className="card-header" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <MdRestaurantMenu size={24} color="var(--accent-orange)" />
            <h2 className="section-title">Today's Menu ({currentDay})</h2>
          </div>
          <div className="card-body hostel-mess-grid">
            <div className="hostel-mess-card">
              <h4>Breakfast <span>(7:30 AM - 9:00 AM)</span></h4>
              <p>{menuToday.breakfast}</p>
            </div>
            <div className="hostel-mess-card">
              <h4>Lunch <span>(12:30 PM - 2:00 PM)</span></h4>
              <p>{menuToday.lunch}</p>
            </div>
            <div className="hostel-mess-card">
              <h4>Dinner <span>(7:30 PM - 9:00 PM)</span></h4>
              <p>{menuToday.dinner}</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'complaints' && (
        <div className="card animate-fade-in">
          <div className="card-header" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <MdReportProblem size={24} color="var(--accent-red)" />
            <h2 className="section-title">Register a Complaint</h2>
          </div>
          <div className="card-body">
            <form onSubmit={handleComplaintSubmit}>
              <div className="form-group">
                <label className="form-label">Issue Category</label>
                <select className="form-input">
                  <option>Electrical (Fan/Light)</option>
                  <option>Plumbing (Water/Tap)</option>
                  <option>Internet / Wi-Fi</option>
                  <option>Carpentry (Bed/Cupboard)</option>
                  <option>Housekeeping / Cleaning</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea 
                  className="form-input" 
                  rows="4" 
                  placeholder="Describe the issue in detail..."
                  value={complaint}
                  onChange={e => setComplaint(e.target.value)}
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary">Submit Complaint</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
