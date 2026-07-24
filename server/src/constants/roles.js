const ROLES = Object.freeze({
  STUDENT:           'student',
  FACULTY:           'faculty',
  ADMIN:             'admin',
  HOD:               'hod',
  PLACEMENT_OFFICER: 'placement_officer',
  PARENT:            'parent',
  LIBRARIAN:         'librarian',
  TRANSPORT:         'transport',
  HOSTEL:            'hostel',
  FINANCE:           'finance',
})

const ALL_ROLES = Object.values(ROLES)

module.exports = { ROLES, ALL_ROLES }
