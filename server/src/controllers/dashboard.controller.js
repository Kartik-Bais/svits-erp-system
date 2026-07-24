const asyncHandler = require('../utils/asyncHandler')
const ApiResponse = require('../utils/ApiResponse')
const { HTTP_STATUS } = require('../constants/status')

// Models
const StudentProfile = require('../models/StudentProfile.model')
const FacultyProfile = require('../models/FacultyProfile.model')
const Course = require('../models/Course.model')
const Book = require('../models/Book.model')
const BookIssue = require('../models/BookIssue.model')
const BusRoute = require('../models/BusRoute.model')
const HostelRoom = require('../models/HostelRoom.model')
const Complaint = require('../models/Complaint.model')
const LeaveRequest = require('../models/LeaveRequest.model')
const CanteenOrder = require('../models/CanteenOrder.model')

const getAdminDashboardStats = asyncHandler(async (req, res) => {
  const [
    totalStudents,
    totalFaculty,
    totalCourses,
    totalBooks,
    activeBookIssues,
    totalBusRoutes,
    totalHostelRooms,
    pendingComplaints,
    pendingLeaveRequests,
    todaysCanteenOrders
  ] = await Promise.all([
    StudentProfile.countDocuments({ isActive: true }),
    FacultyProfile.countDocuments({ isActive: true }),
    Course.countDocuments({ isActive: true }),
    Book.aggregate([{ $match: { isActive: true } }, { $group: { _id: null, total: { $sum: '$totalCopies' } } }]),
    BookIssue.countDocuments({ isActive: true, status: 'Issued' }),
    BusRoute.countDocuments({ isActive: true }),
    HostelRoom.countDocuments({ isActive: true }),
    Complaint.countDocuments({ isActive: true, status: 'Pending' }),
    LeaveRequest.countDocuments({ isActive: true, status: 'Pending' }),
    CanteenOrder.countDocuments({ 
      isActive: true, 
      createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } 
    })
  ])

  const stats = {
    students: totalStudents,
    faculty: totalFaculty,
    courses: totalCourses,
    library: {
      totalBooks: totalBooks.length > 0 ? totalBooks[0].total : 0,
      activeIssues: activeBookIssues
    },
    transport: { totalRoutes: totalBusRoutes },
    hostel: { totalRooms: totalHostelRooms },
    operations: {
      pendingComplaints,
      pendingLeaveRequests
    },
    canteen: { todaysOrders: todaysCanteenOrders }
  }

  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, 'Dashboard stats fetched successfully', stats))
})

const getChartsData = asyncHandler(async (req, res) => {
  // Aggregate complaints by status
  const complaintStats = await Complaint.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ])

  // Aggregate canteen orders by date (last 7 days)
  const last7Days = new Date()
  last7Days.setDate(last7Days.getDate() - 7)

  const canteenTrends = await CanteenOrder.aggregate([
    { $match: { isActive: true, createdAt: { $gte: last7Days } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        totalAmount: { $sum: '$totalAmount' },
        orders: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ])

  // Aggregate leave requests by type
  const leaveStats = await LeaveRequest.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: '$leaveType', count: { $sum: 1 } } }
  ])

  const charts = {
    complaints: complaintStats,
    canteenTrends,
    leaves: leaveStats
  }

  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, 'Charts data fetched successfully', charts))
})

module.exports = {
  getAdminDashboardStats,
  getChartsData
}
