const NodeCache = require('node-cache')
const cache = new NodeCache({ stdTTL: 300, checkperiod: 120 }) // default 5 minutes

const cacheMiddleware = (duration) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next()
    }

    const key = req.originalUrl
    const cachedResponse = cache.get(key)

    if (cachedResponse) {
      return res.status(200).json(cachedResponse)
    }

    // Override res.json to cache the response
    const originalJson = res.json.bind(res)
    res.json = (body) => {
      // Only cache successful responses
      if (res.statusCode >= 200 && res.statusCode < 300) {
        cache.set(key, body, duration)
      }
      return originalJson(body)
    }

    next()
  }
}

const clearCache = (pattern) => {
  const keys = cache.keys()
  const matchingKeys = keys.filter(k => k.includes(pattern))
  cache.del(matchingKeys)
}

module.exports = {
  cache,
  cacheMiddleware,
  clearCache,
}
