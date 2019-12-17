const generator = require('./appointmentGenerator');
const Appointment = require('../models/appointment');
const User = require('../models/user');
const Stretch = require('../models/stretching');
const logger = require('./logger');

/**
 *Removes appointment from user and removes user from appointment
 */
const removeAppointment = async appointment => {
    try {
        if (appointment.user_id) {
            const user = await User.findById({ _id: appointment.user_id });
            user.appointments = user.appointments.filter(appoint => appointment._id.stringify !== appoint.stringify);
            await User.findByIdAndUpdate(user._id, user);
        }

        appointment.user_id = null;
        appointment.type_of_reservation = 3;

        return await Appointment.findByIdAndUpdate(appointment._id, appointment, { new: true });
    } catch (error) {
        logger.error('removeAppointment exception', error.message);
    }
};

const removeTwoAppointments = async date => {
    const firstDate = new Date(date);

    try {
        const firstAppointment = await Appointment.findOne({ start_date: firstDate });
        const secondDate = generator.increaseTime(35, firstDate);
        const secondAppointment = await Appointment.findOne({ start_date: secondDate });

        await removeAppointment(firstAppointment);
        await removeAppointment(secondAppointment);
    } catch (error) {
        logger.error('removeAppointment exception', error.message);
    }
};

const recoverTwoAppointments = async date => {
    const firstDate = new Date(date);
    try {
        const firstAppointment = await Appointment.findOne({ start_date: firstDate });
        const secondDate = generator.increaseTime(5, new Date(firstAppointment.end_date));
        const secondAppointment = await Appointment.findOne({ start_date: secondDate });

        firstAppointment.type_of_reservation = 0;
        secondAppointment.type_of_reservation = 0;

        await Appointment.findByIdAndUpdate(firstAppointment._id, firstAppointment);
        await Appointment.findByIdAndUpdate(secondAppointment._id, secondAppointment);
    } catch (error) {
        logger.error('recoverTwoAppointments exception', error.message);
    }
};

const removeUserFromAppointment = async appointment => {
    try {
        appointment.user_id = null;
        appointment.type_of_reservation = 0;
        await Appointment.findByIdAndUpdate(appointment._id, appointment);
    } catch (error) {
        logger.error('removeUserFromAppointment exception', error.message);
    }
};

const removeUserFromStretching = async (userId, stretchId) => {
    try {
        const stretch = await Stretch.findById(stretchId);
        stretch.users = stretch.users.filter(participant => participant.data._id.toString() !== userId.toString());
        await Stretch.findByIdAndUpdate(stretchId, stretch);
    } catch (error) {
        logger.error('removeUserFromStretching exception', error.message);
    }
};

const removeStretchFromUser = async (userId, stretchId) => {
    try {
        const user = await User.findById(userId);
        user.stretchingSessions = user.stretchingSessions.filter(stretch => stretch.stringify !== stretchId.stringify);
        await User.findByIdAndUpdate(userId, user);
    } catch (error) {
        logger.error('removeStretchFromUser exception', error.message);
    }
};

const isDateValid = async date => {
    const appointments = await Appointment.find({ start_date: date });
    const stretchings = await Stretch.find({ date: date });
    return appointments.length === 0 ||
        stretchings.length !== 0 ||
        !areTimesValid(date) ||
        (await thereIsAStretchBeforeThisOne(date)) ||
        (await thereIsAStretchAfterThisOne(date))
        ? false
        : true;
};

const areTimesValid = date => {
    const compare = date.toISOString();
    return compare.includes('11:15') || compare.includes('16:20') ? false : true;
};

const thereIsAStretchBeforeThisOne = async date => {
    const oneBefore = decreaseTime(35, new Date(date));
    const beforeStretch = await Stretch.find({ date: oneBefore });
    return beforeStretch.length === 0 ? false : true;
};

const thereIsAStretchAfterThisOne = async date => {
    const oneAfter = generator.increaseTime(35, new Date(date));
    const beforeStretch = await Stretch.find({ date: oneAfter });
    return beforeStretch.length === 0 ? false : true;
};

const decreaseTime = (minutes, currentTime) => {
    const overflowMinutes = currentTime.getMinutes();
    currentTime.setMinutes(overflowMinutes - minutes);
    return currentTime;
};

module.exports = {
    recoverTwoAppointments,
    removeTwoAppointments,
    removeAppointment,
    removeUserFromAppointment,
    removeStretchFromUser,
    removeUserFromStretching,
    isDateValid,
};
