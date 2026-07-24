const asyncHandler = require('../utils/asyncHandler')
const ApiResponse = require('../utils/ApiResponse')
const { HTTP_STATUS } = require('../constants/status')

const StudentProfile = require('../models/StudentProfile.model')
const FacultyProfile = require('../models/FacultyProfile.model')
const Book = require('../models/Book.model')
const Course = require('../models/Course.model')

const globalSearch = asyncHandler(async (req, res) => {
  const query = req.query.q
  if (!query) {
    return res.status(HTTP_STATUS.OK).json(new ApiResponse(true, 'Empty query', { students: [], faculty: [], books: [], courses: [] }))
  }

  const regex = new RegExp(query, 'i')

  // Parallel search across collections
  const [students, faculty, books, courses] = await Promise.all([
    StudentProfile.find({ isActive: true, $or: [{ enrollmentNo: regex }, { 'user.name': regex }] })
      .populate('user', 'name email')
      .limit(5),
    FacultyProfile.find({ isActive: true, $or: [{ employeeId: regex }, { 'user.name': regex }] })
      .populate('user', 'name email')
      .limit(5),
    Book.find({ isActive: true, $or: [{ title: regex }, { author: regex }, { isbn: regex }] })
      .limit(5),
    Course.find({ isActive: true, $or: [{ name: regex }, { code: regex }] })
      .limit(5)
  ])

  // Depending on the schema, mapping 'user.name' might not work directly in find() if 'user' is just an ObjectId ref without denormalization.
  // Actually, we can't regex match a populated field inside the parent's find() directly in MongoDB unless we use aggregate or denormalize.
  // For a basic enterprise global search without ElasticSearch or aggregation `$lookup`, we might just search by direct fields (enrollmentNo, code, title).

  const results = {
    students,
    faculty,
    books,
    courses
  }

  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, 'Global search results', results))
})

module.exports = {
  globalSearch
}
