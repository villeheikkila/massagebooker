const express = require('express');
const Appointment = require('../models/appointment');
const appointmentsRouter = express.Router();
const bodyParser = require('body-parser');
appointmentsRouter.use(bodyParser.json());
const User = require('../models/user');
const ruleChecker = require('../utils/bookingRuleChecker');
const appointmentUtil = require('../utils/appointmentUtil');
const verify = require('../utils/verify');

const formatAppointment = input => {
    return {
        _id: input._id,
        user_id: input.user_id,
        start_date: input.start_date,
        end_date: input.end_date,
        type_of_reservation: input.type_of_reservation,
    };
};

appointmentsRouter.get('/', async (req, res, next) => {
    try {
        const appointments = await Appointment.find({});
        res.json(appointments.map(formatAppointment));
    } catch (exception) {
        next(exception);
    }
});

appointmentsRouter.get('/:startDate/:endDate', async (req, res, next) => {
    const start = new Date(req.params.startDate);
    const end = new Date(req.params.endDate);

    try {
        const appointments = await Appointment.find({
            start_date: {
                $gte: start,
                $lte: end,
            },
        });

        res.json(appointments.map(formatAppointment));
    } catch (exception) {
        next(exception);
    }
});

appointmentsRouter.get('/:id', async (req, res, next) => {
    try {
        const appointment = await Appointment.findById({ _id: req.params.id });
        res.json(appointment);
    } catch (exception) {
        next(exception);
    }
});

appointmentsRouter.put('/:id', async (req, res, next) => {
    try {
        const body = req.body;
        const appointmentID = req.params.id;

        const user = await User.findById(body.user_id).populate('appointments');

        if (!user) {
            res.status(400).end();
            return;
        }

        const appointment = await Appointment.findById(appointmentID);

        if (!appointment) {
            res.status(400).end();
            return;
        }

        if (appointment.type_of_reservation === 1 || appointment.type_of_reservation === 3) {
            // User wishes to cancel their appointment

            const userAllowedToCancel = await ruleChecker.userAllowedtoCancelAppointment(user._id, appointment);

            if (!userAllowedToCancel) {
                res.status(400).end();
                return;
            }

            appointment.user_id = null;
            appointment.type_of_reservation = body.type_of_reservation;
            const updatedAppointment = await appointment.save();

            // Remove appointment from users appointments
            user.appointments = user.appointments.filter(
                app => JSON.stringify(app._id) !== JSON.stringify(updatedAppointment._id),
            );
        } else {
            // User wishes to make an appointment
            const ruleCheckResult = await ruleChecker.userAllowedToMakeAppointment(user.appointments, appointment);

            if (ruleCheckResult) {
                // User is allowed to make reservation, proceed with reservation
                appointment.user_id = body.user_id;
                appointment.type_of_reservation = body.type_of_reservation;
                const updatedAppointment = await appointment.save();

                // Adds appointment to users appointments
                user.appointments = user.appointments.concat(updatedAppointment._id);
            }
        }

        await user.save();
        res.json(appointment);
    } catch (exception) {
        next(exception);
    }
});

/**
 * Searches appointment from database by id and then calls removeAppointment.
 */
appointmentsRouter.put('/:id/remove', verify.verifyIfAdmin, async (req, res, next) => {
    try {
        const appointment = await Appointment.findById({ _id: req.params.id });
        const updatedAppointment = await appointmentUtil.removeAppointment(appointment);

        return res.json(updatedAppointment);
    } catch (exception) {
        next(exception);
    }
});

/**
 * Marks the appointment with given id as available
 */
appointmentsRouter.put('/:id/add', verify.verifyIfAdmin, async (req, res, next) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        appointment.type_of_reservation = 0;

        const response = await appointment.save();
        return res.json(response);
    } catch (exception) {
        next(exception);
    }
});

/**
 * Removes appointments that matches the date given as parameter.
 */
appointmentsRouter.put('/:date/removeDate', verify.verifyIfAdmin, async (req, res, next) => {
    try {
        const date = new Date(req.params.date);

        const month = date.getMonth();
        const year = date.getYear();
        const day = date.getDate();
        const appointments = await Appointment.find();
        const appointmentsToRemove = appointments.filter(
            appoint =>
                appoint.start_date.getDate() === day &&
                appoint.start_date.getMonth() === month &&
                appoint.start_date.getYear() === year,
        );

        const updatedAppointments = appointmentsToRemove.reduce(async (updated, appoint) => {
            const updatedAppointment = await appointmentUtil.removeAppointment(appoint);
            updated.push(updatedAppointment);
        }, []);

        res.json(updatedAppointments.map(formatAppointment));
    } catch (exception) {
        next(exception);
    }
});

/**
 * Marks the given date as available
 */
appointmentsRouter.put('/:date/addDate', verify.verifyIfAdmin, async (req, res, next) => {
    try {
        const start = new Date(req.params.date);
        start.setHours(start.getHours() + 3);

        const end = new Date(start);
        end.setHours(end.getHours() + 23);

        const appointments = await Appointment.find({
            start_date: {
                $gte: start,
                $lte: end,
            },
        });

        const updatedAppointments = appointments.reduce(async (updated, appointment) => {
            appointment.type_of_reservation = 0;
            const updatedAppointment = await Appointment.findByIdAndUpdate(appointment._id, appointment, { new: true });
            updated.push(updatedAppointment);
        }, []);

        res.json(updatedAppointments.map(formatAppointment));
    } catch (exception) {
        next(exception);
    }
});

module.exports = appointmentsRouter;
