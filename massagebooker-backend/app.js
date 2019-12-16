const express = require('express')
const cors = require('cors')
const app = express()
const morgan = require('morgan')
const mongoose = require('mongoose')
const router = express.Router()
const cookieSession = require('cookie-session')
const passport = require('passport')

const protectedRoute = require('./utils/protectedRoute')
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')

const httpsRedirect = (req, res, next) => {
  const forwardedProtocol = req.headers['x-forwarded-proto']
  if (forwardedProtocol === 'http') return res.redirect(`https://${req.headers.host}${req.url}`)
  next()
}
app.use(httpsRedirect)

// This route is available without authentication
const tvRouter = require('./controllers/tv')
app.use('/api/tv', tvRouter)

require('./services/passport')

app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [config.COOKIE_KEY],
  })
)

app.use(passport.initialize())
app.use(passport.session())

logger.info('connecting to', config.MONGODB_URI)
app.use(cors())

mongoose
  .connect(config.MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch(error => {
    logger.error('error connection to MongoDB:', error.message)
  })

const appointmentsRouter = require('./controllers/appointments')
const usersRouter = require('./controllers/users')
const statsRouter = require('./controllers/stats')
const authRouter = require('./controllers/auth_routes')
const stretchingRouter = require('./controllers/stretching')
const announcementsRouter = require('./controllers/announcement')
const infoItemsRouter = require('./controllers/infoItems')

app.use('/auth', authRouter)
app.use('/api', router)
app.use('/api/appointments', appointmentsRouter)
app.use('/api/users', usersRouter)
app.use('/api/stats', statsRouter)
app.use('/api/stretching', stretchingRouter)
app.use('/api/announcements', announcementsRouter)
app.use('/api/info', infoItemsRouter)

// ROUTE PROTECTION -- DISABLE FOR OWN TESTING IN REST CLIENT ETC.
router.use(protectedRoute.routeProtector)

if (process.env.NODE_ENV === 'production') app.use('/', express.static('build'))
else app.use(morgan('dev'))

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
