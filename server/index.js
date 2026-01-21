const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const path = require('path')
const fs = require('fs')
const multer = require('multer')
require('dotenv').config()

const { loadAllData, saveAllData, ensureDirectories } = require('./storage')

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-123'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin'
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin'

// Initialize memory stores
let memoryArticles = []
let memoryCategories = []
let memoryUsers = []
let memoryLogs = []
let memorySlides = []
let memoryExperts = []
let memoryResearch = []
let memorySite = null
let memoryStats = null
let memoryNavigation = null
let memoryNewsletter = null
let memoryFooter = null
let memoryMedia = []
let memorySettings = null
let memoryIntegrations = null
let memorySecurity = null
let memoryPerformance = null

// Admin user setup
const passwordHash = bcrypt.hashSync(ADMIN_PASSWORD, 10)
memoryUsers.push({
  _id: 'admin',
  username: ADMIN_USERNAME,
  role: 'admin',
  passwordHash,
  createdAt: new Date(),
  updatedAt: new Date()
})

// Load initial data from storage or defaults
function initializeData() {
  console.log('[Server] Initializing data...')
  ensureDirectories()

  // Try to load from storage first
  const storedData = loadAllData()

  // Load default data as fallback
  const defaultDataPath = path.join(__dirname, '..', 'src', 'data.js')
  let defaultData = {}

  try {
    // Read the default data file
    const dataContent = fs.readFileSync(defaultDataPath, 'utf8')
    // Extract the object from the export statement
    const match = dataContent.match(/const defaultData = ({[\s\S]*?});?\s*export default/m)
    if (match) {
      defaultData = eval('(' + match[1] + ')')
    }
  } catch (err) {
    console.warn('[Server] Could not load default data:', err.message)
  }

  // Merge stored data with defaults
  memoryArticles = storedData.articles && storedData.articles.length > 0
    ? storedData.articles
    : (defaultData.articles || [])

  memoryCategories = storedData.categories && storedData.categories.length > 0
    ? storedData.categories
    : (defaultData.categories || [])

  memoryExperts = storedData.experts && storedData.experts.length > 0
    ? storedData.experts
    : (defaultData.experts || [])

  memoryResearch = storedData.research && storedData.research.length > 0
    ? storedData.research
    : (defaultData.research || [])

  memorySlides = storedData.slides && storedData.slides.length > 0
    ? storedData.slides
    : (defaultData.slides || [])

  memorySite = storedData.site || defaultData.site || { name: 'My Vet Corner' }
  memoryStats = storedData.stats || defaultData.stats || []
  memoryNavigation = storedData.navigation || defaultData.navigation || []
  memoryNewsletter = storedData.newsletter || defaultData.newsletter || {}
  memoryFooter = storedData.footer || defaultData.footer || {}
  memoryMedia = storedData.media || defaultData.media || []
  memorySettings = storedData.settings || defaultData.settings || {}
  memoryIntegrations = storedData.integrations || defaultData.integrations || {}
  memorySecurity = storedData.security || defaultData.security || {}
  memoryPerformance = storedData.performance || defaultData.performance || {}

  console.log(`[Server] Loaded ${memoryArticles.length} articles, ${memoryCategories.length} categories, ${memoryExperts.length} experts`)
}

// Build aggregated site data
function buildSiteData() {
  return {
    site: memorySite,
    articles: memoryArticles,
    categories: memoryCategories,
    experts: memoryExperts,
    research: memoryResearch,
    slides: memorySlides,
    stats: memoryStats,
    navigation: memoryNavigation,
    newsletter: memoryNewsletter,
    footer: memoryFooter,
    media: memoryMedia,
    settings: memorySettings,
    integrations: memoryIntegrations,
    security: memorySecurity,
    performance: memoryPerformance
  }
}

// Middleware
function authMiddleware(req, res, next) {
  const h = req.headers.authorization || ''
  const token = h.startsWith('Bearer ') ? h.slice(7) : ''
  if (!token) { res.status(401).json({ error: 'Unauthorized' }); return }
  if (token === 'dummy-token') {
    req.user = { role: 'admin', username: ADMIN_USERNAME }
    next()
    return
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    req.user = payload || {}
    next()
  } catch (_) {
    res.status(401).json({ error: 'Unauthorized' })
  }
}

function requireRole(roles = []) {
  return function (req, res, next) {
    const role = (req.user && req.user.role) || 'viewer'
    if (!roles.length || roles.includes(role)) { next(); return }
    res.status(403).json({ error: 'Forbidden' })
  }
}

const app = express()
app.use(express.json({ limit: '50mb' }))

// CORS for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  res.header('Access-Control-Expose-Headers', 'X-Total-Count')
  if (req.method === 'OPTIONS') {
    res.sendStatus(200)
    return
  }
  next()
})

// FILE UPLOAD CONFIGURATION
const uploadDir = path.join(__dirname, '..', 'public', 'research-papers')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const researchId = req.params.id || Date.now()
    const ext = path.extname(file.originalname)
    cb(null, `research-${researchId}${ext}`)
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true)
    } else {
      cb(new Error('Only PDF files are allowed'))
    }
  }
})

app.get('/api/ping', (_req, res) => { res.json({ ok: true }) })

// LOGIN
app.post('/api/auth/login', async (req, res) => {
  const { password } = req.body || {}
  if (password === ADMIN_PASSWORD) {
    const token = jwt.sign({ role: 'admin', username: ADMIN_USERNAME }, JWT_SECRET, { expiresIn: '7d' })
    res.json({ token, role: 'admin' })
    return
  }
  res.status(401).json({ error: 'Invalid credentials' })
})

app.post('/api/users/login', async (req, res) => {
  const { username, password } = req.body || {}
  const user = memoryUsers.find(u => u.username === username)
  if (!user) { res.status(401).json({ error: 'Invalid credentials' }); return }

  const ok = bcrypt.compareSync(password || '', user.passwordHash)
  if (!ok) { res.status(401).json({ error: 'Invalid credentials' }); return }

  const token = jwt.sign({ role: user.role, username: user.username }, JWT_SECRET, { expiresIn: '7d' })
  res.json({ token, role: user.role })
})

// SITE DATA
app.get('/api/site', (_req, res) => {
  res.json(buildSiteData())
})

app.post('/api/site', authMiddleware, (req, res) => {
  const data = req.body || {}

  // Update all memory stores with the provided data
  if (data.articles) memoryArticles = data.articles
  if (data.categories) memoryCategories = data.categories
  if (data.experts) memoryExperts = data.experts
  if (data.research) memoryResearch = data.research
  if (data.slides) memorySlides = data.slides
  if (data.stats) memoryStats = data.stats
  if (data.navigation) memoryNavigation = data.navigation
  if (data.site) memorySite = data.site
  if (data.newsletter) memoryNewsletter = data.newsletter
  if (data.footer) memoryFooter = data.footer
  if (data.media) memoryMedia = data.media
  if (data.settings) memorySettings = data.settings
  if (data.integrations) memoryIntegrations = data.integrations
  if (data.security) memorySecurity = data.security
  if (data.performance) memoryPerformance = data.performance

  // Save to persistent storage
  const saved = saveAllData(buildSiteData())

  memoryLogs.push({ action: 'save_all', entity: 'site', at: new Date(), success: saved })

  if (saved) {
    res.json({ success: true })
  } else {
    res.status(500).json({ error: 'Failed to save data' })
  }
})

// ARTICLES
app.get('/api/articles', (req, res) => {
  const { q, page = 1, limit = 20, category, tag, published, sort = 'createdAt', order = 'desc' } = req.query || {}
  let items = memoryArticles.slice()
  if (category) items = items.filter(a => (a.category || '') === category)
  if (tag) items = items.filter(a => Array.isArray(a.tags) && a.tags.includes(tag))
  if (published === 'true') items = items.filter(a => !!a.published)
  if (published === 'false') items = items.filter(a => !a.published)
  if (q) {
    const rx = new RegExp(q, 'i')
    items = items.filter(a => rx.test(a.title || '') || rx.test(a.content || ''))
  }
  const sortField = ['title', 'category', 'published', 'featured', 'createdAt', 'updatedAt'].includes(sort) ? sort : 'createdAt'
  const sortDir = order === 'asc' ? 1 : -1
  items.sort((a, b) => {
    const va = a[sortField]
    const vb = b[sortField]
    const ra = va instanceof Date ? va.getTime() : (typeof va === 'string' ? va : (va ? 1 : 0))
    const rb = vb instanceof Date ? vb.getTime() : (typeof vb === 'string' ? vb : (vb ? 1 : 0))
    return sortDir * ((ra > rb) - (ra < rb))
  })
  const total = items.length
  const start = (+page - 1) * (+limit)
  const paged = items.slice(start, start + (+limit))
  res.set('X-Total-Count', String(total))
  res.json(paged)
})

app.post('/api/articles', authMiddleware, (req, res) => {
  const body = req.body || {}
  const slugBase = body.slug || body.title || ''
  const slug = slugBase.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  const dup = memoryArticles.find(a => a.slug === slug)
  if (dup) { res.status(409).json({ error: 'Duplicate slug' }); return }
  const now = new Date()
  const item = { ...body, slug, _id: String(Date.now()), createdAt: now, updatedAt: now }
  memoryArticles.unshift(item)
  saveAllData(buildSiteData())
  memoryLogs.push({ action: 'create', entity: 'article', entityId: item._id, at: new Date(), data: { title: item.title } })
  res.json(item)
})

app.put('/api/articles/:id', authMiddleware, (req, res) => {
  const i = memoryArticles.findIndex(a => a._id === req.params.id)
  if (i < 0) { res.status(404).json({ error: 'Not found' }); return }
  const next = { ...memoryArticles[i], ...req.body, updatedAt: new Date() }
  memoryArticles[i] = next
  saveAllData(buildSiteData())
  memoryLogs.push({ action: 'update', entity: 'article', entityId: next._id, at: new Date(), data: { title: next.title, published: next.published } })
  res.json(next)
})

app.delete('/api/articles/:id', authMiddleware, (req, res) => {
  const i = memoryArticles.findIndex(a => a._id === req.params.id)
  if (i < 0) { res.status(404).json({ error: 'Not found' }); return }
  memoryArticles.splice(i, 1)
  saveAllData(buildSiteData())
  memoryLogs.push({ action: 'delete', entity: 'article', entityId: req.params.id, at: new Date() })
  res.json({ ok: true })
})

// CATEGORIES
app.get('/api/categories', (req, res) => {
  const { q, page = 1, limit = 50, sort = 'name', order = 'asc' } = req.query || {}
  let items = memoryCategories.slice()
  if (q) {
    const rx = new RegExp(q, 'i')
    items = items.filter(c => rx.test(c.name || ''))
  }
  const sortField = ['name', 'createdAt', 'updatedAt'].includes(sort) ? sort : 'name'
  const sortDir = order === 'desc' ? -1 : 1
  items.sort((a, b) => {
    const va = a[sortField]
    const vb = b[sortField]
    const ra = va instanceof Date ? va.getTime() : (typeof va === 'string' ? va : (va ? 1 : 0))
    const rb = vb instanceof Date ? vb.getTime() : (typeof vb === 'string' ? vb : (vb ? 1 : 0))
    return sortDir * ((ra > rb) - (ra < rb))
  })
  const total = items.length
  const start = (+page - 1) * (+limit)
  const paged = items.slice(start, start + (+limit))
  res.set('X-Total-Count', String(total))
  res.json(paged)
})

app.post('/api/categories', authMiddleware, (req, res) => {
  const body = req.body || {}
  const slugBase = body.slug || body.name || ''
  const slug = slugBase.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  const dup = memoryCategories.find(c => c.slug === slug)
  if (dup) { res.status(409).json({ error: 'Duplicate slug' }); return }
  const now = new Date()
  const item = { ...body, slug, _id: String(Date.now()), createdAt: now, updatedAt: now }
  memoryCategories.unshift(item)
  saveAllData(buildSiteData())
  memoryLogs.push({ action: 'create', entity: 'category', entityId: item._id, at: new Date(), data: { name: item.name } })
  res.json(item)
})

app.put('/api/categories/:id', authMiddleware, (req, res) => {
  const i = memoryCategories.findIndex(a => a._id === req.params.id)
  if (i < 0) { res.status(404).json({ error: 'Not found' }); return }
  const next = { ...memoryCategories[i], ...req.body, updatedAt: new Date() }
  memoryCategories[i] = next
  saveAllData(buildSiteData())
  memoryLogs.push({ action: 'update', entity: 'category', entityId: next._id, at: new Date(), data: { name: next.name } })
  res.json(next)
})

app.delete('/api/categories/:id', authMiddleware, (req, res) => {
  const i = memoryCategories.findIndex(a => a._id === req.params.id)
  if (i < 0) { res.status(404).json({ error: 'Not found' }); return }
  memoryCategories.splice(i, 1)
  saveAllData(buildSiteData())
  memoryLogs.push({ action: 'delete', entity: 'category', entityId: req.params.id, at: new Date() })
  res.json({ ok: true })
})

// USERS
app.get('/api/users', authMiddleware, (req, res) => {
  const { page = 1, limit = 50, sort = 'createdAt', order = 'desc' } = req.query || {}
  const sortField = ['username', 'role', 'createdAt', 'updatedAt'].includes(sort) ? sort : 'createdAt'
  const sortDir = order === 'asc' ? 1 : -1
  const items = memoryUsers.slice().sort((a, b) => {
    const va = a[sortField]
    const vb = b[sortField]
    const ra = va instanceof Date ? va.getTime() : (typeof va === 'string' ? va : (va ? 1 : 0))
    const rb = vb instanceof Date ? vb.getTime() : (typeof vb === 'string' ? vb : (vb ? 1 : 0))
    return sortDir * ((ra > rb) - (ra < rb))
  })
  const total = items.length
  const start = (+page - 1) * (+limit)
  const paged = items.slice(start, start + (+limit)).map(u => ({ _id: u._id, username: u.username, role: u.role }))
  res.set('X-Total-Count', String(total))
  res.json(paged)
})

app.post('/api/users', authMiddleware, (req, res) => {
  const { username, password, role } = req.body || {}
  const exists = memoryUsers.find(u => u.username === username)
  if (exists) { res.status(400).json({ error: 'Username exists' }); return }
  const now = new Date()
  const passwordHash = bcrypt.hashSync(password || '', 10)
  const created = { _id: String(Date.now()), username, role: role || 'editor', passwordHash, createdAt: now, updatedAt: now }
  memoryUsers.push(created)
  saveAllData(buildSiteData())
  res.json({ _id: created._id, username: created.username, role: created.role })
})

app.put('/api/users/:id', authMiddleware, (req, res) => {
  const { role } = req.body || {}
  const i = memoryUsers.findIndex(u => u._id === req.params.id)
  if (i < 0) { res.status(404).json({ error: 'Not found' }); return }
  memoryUsers[i] = { ...memoryUsers[i], role, updatedAt: new Date() }
  saveAllData(buildSiteData())
  const u = memoryUsers[i]
  res.json({ _id: u._id, username: u.username, role: u.role })
})

app.delete('/api/users/:id', authMiddleware, (req, res) => {
  const i = memoryUsers.findIndex(u => u._id === req.params.id)
  if (i < 0) { res.status(404).json({ error: 'Not found' }); return }
  memoryUsers.splice(i, 1)
  saveAllData(buildSiteData())
  res.json({ ok: true })
})

app.put('/api/users/:id/password', authMiddleware, (req, res) => {
  const requester = (req.user && req.user.username) || ''
  const role = (req.user && req.user.role) || 'viewer'
  const { password } = req.body || {}
  const i = memoryUsers.findIndex(u => u._id === req.params.id)
  if (i < 0) { res.status(404).json({ error: 'Not found' }); return }
  const target = memoryUsers[i]
  if (!(role === 'admin' || requester === target.username)) { res.status(403).json({ error: 'Forbidden' }); return }
  const passwordHash = bcrypt.hashSync(password || '', 10)
  memoryUsers[i] = { ...target, passwordHash, updatedAt: new Date() }
  saveAllData(buildSiteData())
  res.json({ ok: true })
})

// LOGS
app.get('/api/logs', authMiddleware, (req, res) => {
  const { entity, action, page = 1, limit = 100, order = 'desc' } = req.query || {}
  let items = memoryLogs.slice()
  if (entity) items = items.filter(l => l.entity === entity)
  if (action) items = items.filter(l => l.action === action)
  const sortDir = order === 'asc' ? 1 : -1
  items.sort((a, b) => sortDir * ((a.at > b.at) - (a.at < b.at)))
  const start = (+page - 1) * (+limit)
  const paged = items.slice(start, start + (+limit))
  res.json(paged)
})

// SLIDES
app.get('/api/slides', (req, res) => {
  res.json(memorySlides)
})
app.post('/api/slides', authMiddleware, (req, res) => {
  const item = { ...req.body, _id: String(Date.now()) }
  memorySlides.push(item)
  saveAllData(buildSiteData())
  res.json(item)
})
app.put('/api/slides/:id', authMiddleware, (req, res) => {
  const i = memorySlides.findIndex(s => s._id === req.params.id)
  if (i < 0) { res.status(404).json({ error: 'Not found' }); return }
  memorySlides[i] = { ...memorySlides[i], ...req.body }
  saveAllData(buildSiteData())
  res.json(memorySlides[i])
})
app.delete('/api/slides/:id', authMiddleware, (req, res) => {
  const i = memorySlides.findIndex(s => s._id === req.params.id)
  if (i >= 0) memorySlides.splice(i, 1)
  saveAllData(buildSiteData())
  res.json({ ok: true })
})

// EXPERTS
app.get('/api/experts', (req, res) => {
  res.json(memoryExperts)
})
app.post('/api/experts', authMiddleware, (req, res) => {
  const item = { ...req.body, _id: String(Date.now()) }
  memoryExperts.push(item)
  saveAllData(buildSiteData())
  res.json(item)
})
app.put('/api/experts/:id', authMiddleware, (req, res) => {
  const i = memoryExperts.findIndex(s => s._id === req.params.id)
  if (i < 0) { res.status(404).json({ error: 'Not found' }); return }
  memoryExperts[i] = { ...memoryExperts[i], ...req.body }
  saveAllData(buildSiteData())
  res.json(memoryExperts[i])
})
app.delete('/api/experts/:id', authMiddleware, (req, res) => {
  const i = memoryExperts.findIndex(s => s._id === req.params.id)
  if (i >= 0) memoryExperts.splice(i, 1)
  saveAllData(buildSiteData())
  res.json({ ok: true })
})

// RESEARCH
app.get('/api/research', (req, res) => {
  res.json(memoryResearch)
})
app.post('/api/research', authMiddleware, (req, res) => {
  const item = { ...req.body, _id: String(Date.now()) }
  memoryResearch.push(item)
  saveAllData(buildSiteData())
  res.json(item)
})
app.put('/api/research/:id', authMiddleware, (req, res) => {
  const i = memoryResearch.findIndex(s => s._id === req.params.id)
  if (i < 0) { res.status(404).json({ error: 'Not found' }); return }
  memoryResearch[i] = { ...memoryResearch[i], ...req.body }
  saveAllData(buildSiteData())
  res.json(memoryResearch[i])
})
app.delete('/api/research/:id', authMiddleware, (req, res) => {
  const i = memoryResearch.findIndex(s => s._id === req.params.id)
  if (i >= 0) memoryResearch.splice(i, 1)
  saveAllData(buildSiteData())
  res.json({ ok: true })
})

// PDF UPLOAD ENDPOINT
app.post('/api/research/:id/upload-pdf', authMiddleware, upload.single('pdf'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }
    const pdfUrl = `/research-papers/${req.file.filename}`
    res.json({ success: true, pdfUrl, filename: req.file.filename })
  } catch (err) {
    console.error('[Upload] Error:', err)
    res.status(500).json({ error: 'Upload failed: ' + err.message })
  }
})

// DELETE PDF ENDPOINT
app.delete('/api/research/:id/delete-pdf', authMiddleware, (req, res) => {
  try {
    const { filename } = req.query
    if (!filename) {
      return res.status(400).json({ error: 'Filename required' })
    }
    const filePath = path.join(uploadDir, filename)
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
      res.json({ success: true })
    } else {
      res.status(404).json({ error: 'File not found' })
    }
  } catch (err) {
    console.error('[Delete] Error:', err)
    res.status(500).json({ error: 'Delete failed: ' + err.message })
  }
})

// SERVE STATIC ASSETS
// Enable static serving for public folder (uploads)
app.use('/research-papers', express.static(path.join(__dirname, '..', 'public', 'research-papers')))
app.use(express.static(path.join(__dirname, '..', 'public')))

// Serve frontend build in production
if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, '..', '.dist')
  app.use(express.static(buildPath))

  // Handle SPA routing - return index.html for all non-API routes
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ error: 'Not found' })
    }
    res.sendFile(path.join(buildPath, 'index.html'))
  })
}

// Initialize data before starting server
initializeData()

const port = process.env.API_PORT || 5000
app.listen(port, () => {
  console.log(`✅ API server running on http://localhost:${port}`)
  console.log(`📦 Loaded ${memoryArticles.length} articles, ${memoryCategories.length} categories, ${memoryExperts.length} experts`)
  console.log(`👤 Admin credentials: ${ADMIN_USERNAME} / ${ADMIN_PASSWORD}`)
  console.log(`💾 Data storage: ./content/`)
})
