const moment = require('moment')
const logger = require('./logger')

/*  Checks that requested appointment is no more tha six weeks away. Appointments can be made 6 weeks in advance. */
const moreThanSixWeeksAway = (now, appointmentsFirstDayOfTheWeek) => {
  const startOfThisWeek = now.startOf('week')
  const sixWeeksFromNow = startOfThisWeek.add(42, 'days')
  return appointmentsFirstDayOfTheWeek.isAfter(sixWeeksFromNow)
}

/* Filter previous appointments, leaving only ones that make  are within two week of requested appointment i.e if filtered list is not empty appointment can't be made.
Use first day of the week of appointment rather than day itself to allow booking monday appointments when last appointment was 2 weeks ago on tuesday*/
const moreThanOneAppointmentInTwoWeeks = (usersPreviousMassageTimes, appointmentsFirstDayOfTheWeek) => {
  const usersPreviousMassageTimesTwoWeeks = usersPreviousMassageTimes.filter(prevTime => {
    const prevTimeMoment = moment(prevTime)
    const prevTimeStartOfWeek = prevTimeMoment.startOf('week')
    const dayDifference = appointmentsFirstDayOfTheWeek.diff(
      prevTimeStartOfWeek,
      'days'
    )
    return Math.abs(dayDifference) < 14
  })

  return usersPreviousMassageTimesTwoWeeks.length === 0
}


const userAllowedToMakeAppointment = async (usersAppointmentList, appointment) => {
  try {
    const usersPreviousMassageTimes = usersAppointmentList.map(app => app.start_date)
    const now = moment()

    // Fix timezone difference from db
    const date = new Date(appointment.start_date)
    const minutes = date.getMinutes()
    const time = date.getTimezoneOffset()
    date.setMinutes(minutes + time)

    const appointmentTimeMoment = moment(date)
    // Checks that requested appointment is in the future. Cant book past appointments
    if (appointmentTimeMoment.isBefore(now)) return false

    if (appointmentTimeMoment.isSame(now, 'days')) {
      // Appointments can be booked by anyone on the day of the appointment provided they don't already have an appointment that day
      const usersAppointmentOnSameDay = usersPreviousMassageTimes.find((time) => moment(time).isSame(appointmentTimeMoment, 'days'))
      return usersAppointmentOnSameDay ? false : true
    } else {
      const appointmentsFirstDayOfTheWeek = appointmentTimeMoment.startOf('week')
      if (moreThanSixWeeksAway(now, appointmentsFirstDayOfTheWeek)) return false
      return (moreThanOneAppointmentInTwoWeeks(usersPreviousMassageTimes, appointmentsFirstDayOfTheWeek))
    }
  } catch (error) {
    logger.error('error in rule checker', error.message)
  }
}

const userAllowedtoCancelAppointment = async (userID, appointment) => String(userID) === String(appointment.user_id)

module.exports = { userAllowedToMakeAppointment, userAllowedtoCancelAppointment }
