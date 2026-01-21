const jwt = require('jsonwebtoken')

module.exports = function auth(req, res, next) {
  const secret = process.env.JWT_SECRET || 'change-me'
  const h = req.headers.authorization || ''
  const token = h.startsWith('Bearer ') ? h.slice(7) : ''
  if (!token) { res.status(401).json({ error: 'Unauthorized' }); return }
  try {
    const payload = jwt.verify(token, secret)
    req.user = payload || {}
    next()
  } catch (_) {
    res.status(401).json({ error: 'Unauthorized' })
  }
}
