const stretchingRouter = require('express').Router()
const bodyParser = require('body-parser')
stretchingRouter.use(bodyParser.json())
const Stretching = require('../models/stretching')
const User = require('../models/user')
const AppointmentManager = require('../utils/appointmentUtil')

const formatStretchingSession = input => {
  return {
    _id: input._id,
    date: input.date,
    users: input.users
  }
}

// GETS latest / next / upcoming stretching session
stretchingRouter.get('/', async (req, res, next) => {
  try {
    const today = new Date()
    const allSessions =
      await Stretching
        .find({ date: { $gte: today } })
        .populate('users.data')
        .sort({ date: 1 })

    res.send(allSessions.map(formatStretchingSession))
  } catch (exception) {
    next(exception)
  }
})

// Endpoint for masseusse user which gets triggered once they decide to
// create a new stretching session for other users to join
stretchingRouter.post('/', async (req, res, next) => {
  try {
    const date = new Date(req.body.date)
    const minutes = date.getMinutes()
    const time = date.getTimezoneOffset() * -1
    date.setMinutes(minutes + time)

    // check if there is a stretch already
    if (await AppointmentManager.isDateValid(date)) {
      await AppointmentManager.removeTwoAppointments(date)

      const stretchingSession = new Stretching({
        date: date,
        users: []
      })

      const savedStretchingSession = await stretchingSession.save()
      res.json(savedStretchingSession.toJSON())
    }
  } catch (exception) {
    next(exception)
  }
})

// Endpoint for users wanting to join / cancel previously joined existing stretching session
stretchingRouter.put('/:id', async (req, res, next) => {
  try {
    const body = req.body
    const joinStatus = body.join
    const stretchingId = req.params.id
    const getCurrentUser = req.user

    // Extract current user data.
    // Need to have user model as we need to update it
    const user = await User.findById(getCurrentUser._id)
    const stretchingAppointment = await Stretching.findById(stretchingId)

    const joinCriteriaPassed =
      joinStatus === true &&
      stretchingAppointment.users.length < 10 &&
      stretchingAppointment.users.filter(participant => participant.data._id.toString() === user._id.toString()).length === 0

    const exitCriteriaPassed =
      joinStatus === false &&
      stretchingAppointment.users.length > 0 &&
      stretchingAppointment.users.filter(participant => participant.data._id.toString() === user._id.toString()).length > 0

    if (joinCriteriaPassed) {
      // Description is given in body only when trying to join the appointment
      // Fallback used if description value isn't given
      const description = body.description.value || 'No description given'

      stretchingAppointment.users = stretchingAppointment.users.concat({ data: user._id, description })
      const saved = await stretchingAppointment.save()
      await saved.populate('users.data').execPopulate()

      user.stretchingSessions.concat(saved._id)
      await user.save()

      // Give this as response so that state can be updated dynamically for user
      res.json(saved.toJSON())
    } else if (exitCriteriaPassed) {
      stretchingAppointment.users = stretchingAppointment.users.filter(participant => participant.data._id.toString() !== user._id.toString())

      const saved = await stretchingAppointment.save()
      await saved.populate('users.data').execPopulate()

      user.stretchingSessions = user.stretchingSessions.filter(stretch_session_id => stretch_session_id.toString() !== stretchingAppointment._id.toString())
      await user.save()

      // Give this as response so that state can be updated dynamically for user
      res.json(saved.toJSON())
    }

  } catch (exception) {
    next(exception)
  }
})

// Removes individual stretching appointment completely. Used by admin
stretchingRouter.delete('/:id', async (req, res, next) => {
  try {
    const stretchId = req.params.id
    const stretch = await Stretching.findById(stretchId)

    stretch.users.forEach(async user => await AppointmentManager.removeStretchFromUser(user.data, stretchId))

    await AppointmentManager.recoverTwoAppointments(stretch.date)
    await Stretching.remove({ _id: stretchId })

    res.status(204).end()
  } catch (exception) {
    next(exception)
  }
})

module.exports = stretchingRouter