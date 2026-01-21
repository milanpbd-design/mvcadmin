module.exports = function requireRole(roles = []) {
  return function (req, res, next) {
    const role = (req.user && req.user.role) || 'viewer'
    if (!roles.length || roles.includes(role)) { next(); return }
    res.status(403).json({ error: 'Forbidden' })
  }
}

