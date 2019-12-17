const express = require('express');
const statsRouter = express.Router();
const Appointment = require('../models/appointment');
const User = require('../models/user');
const bodyParser = require('body-parser');
const moment = require('moment');
statsRouter.use(bodyParser.json());

const appointmentStatistics = appointments => {
    const now = moment();

    const pastAppointments = appointments.filter(appointment => moment(appointment.start_date).isBefore(now, 'days'));

    const numberOfPastAppointments = pastAppointments.length;
    const numberOfUnusedPastAppointments = pastAppointments.filter(appointment => appointment.type_of_reservation === 0)
        .length;

    return {
        numberOfPastAppointments,
        numberOfUnusedPastAppointments,
    };
};

const userStatistics = users => {
    const numberOfUsers = users.length;

    const numberOfUsersAppointments = users.map(user => user.appointments.length).sort((a, b) => b - a);
    const mostAppointmentsBySingleUser = numberOfUsersAppointments[0];

    const totalAppointmentsUsed = numberOfUsersAppointments.reduce((total, current) => total + current);
    const usersWhoHaveUsedMassage = numberOfUsersAppointments.filter(count => count > 0).length;

    return {
        numberOfUsers,
        mostAppointmentsBySingleUser,
        totalAppointmentsUsed,
        usersWhoHaveUsedMassage,
    };
};

statsRouter.get('/', async (req, res, next) => {
    try {
        const appointments = await Appointment.find({});
        const users = await User.find({});

        const appointmentStats = appointmentStatistics(appointments);
        const userStats = userStatistics(users);

        const statisticsToSend = {
            ...appointmentStats,
            ...userStats,
        };

        res.json(statisticsToSend);
    } catch (exception) {
        next(exception);
    }
});

module.exports = statsRouter;
