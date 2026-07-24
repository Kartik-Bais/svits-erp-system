const asyncHandler = require('../utils/asyncHandler')
const ApiResponse = require('../utils/ApiResponse')
const { HTTP_STATUS } = require('../constants/status')

const Event = require('../models/Event.model')
const Timetable = require('../models/Timetable.model')

const getUnifiedCalendar = asyncHandler(async (req, res) => {
  // Fetch events for the month (we can use startDate and endDate from query params, simplified here)
  const events = await Event.find({ isActive: true })

  // Optionally fetch timetables for the user if they are a student
  // const timetable = await Timetable.find({ department: userDept, semester: userSem, isActive: true })

  // Transform them into a unified format for a calendar UI (e.g. FullCalendar)
  const calendarFeed = []

  events.forEach(event => {
    calendarFeed.push({
      id: event._id,
      title: event.title,
      start: event.date,
      end: event.date,
      type: 'Event',
      allDay: true,
      url: `/events/${event._id}`,
      backgroundColor: '#3b82f6'
    })
  })

  res.status(HTTP_STATUS.OK).json(new ApiResponse(true, 'Calendar feed fetched', calendarFeed))
})

module.exports = {
  getUnifiedCalendar
}
