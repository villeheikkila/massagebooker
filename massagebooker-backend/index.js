const http = require('http')
const app = require('./app')
const config = require('./utils/config')
const server = http.createServer(app)
const timer = require('./utils/timer')

const generateAppointments = async () => {
  try {
    await timer.nextSixMonths(new Date)
  } catch (exception) {
    console.log('exception: ', exception)
  }
}

/**
 * If process argument "init" (e.g. npm start init) is passed, generate appointments for the next six months
 */
if (process.argv.length !== 0 && process.argv[2] === 'init') generateAppointments()

server.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`)
})
