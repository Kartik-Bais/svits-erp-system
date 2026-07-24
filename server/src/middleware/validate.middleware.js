const ApiError = require('../utils/ApiError')
const { HTTP_STATUS } = require('../constants/status')
const { MESSAGES }    = require('../constants/messages')

/**
 * Joi schema validation middleware factory.
 * target: 'body' | 'query' | 'params'
 */
const validate = (schema, target = 'body') => (req, _res, next) => {
  const { error, value } = schema.validate(req[target], {
    abortEarly: false,
    stripUnknown: true,
  })

  if (error) {
    const errors = error.details.map((d) => d.message.replace(/["]/g, ''))
    return next(new ApiError(HTTP_STATUS.UNPROCESSABLE_ENTITY, MESSAGES.VALIDATION_ERROR, errors))
  }

  req[target] = value
  next()
}

module.exports = { validate }
