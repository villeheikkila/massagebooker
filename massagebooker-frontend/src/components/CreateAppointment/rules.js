import moment from 'moment';

const usersAppointmentOnSameDay = (usersAppointments, now) =>
    usersAppointments.find(time => {
        const timeMoment = moment(time.start_date);
        return timeMoment.isSame(now, 'day');
    });

const usersAppointmentsWithinTheLastTwoWeeks = (usersAppointments, requestedTimeMoment) => {
    const firstWeekDayOfrequestedTimesWeek = requestedTimeMoment.startOf('week');

    usersAppointments.filter(usersPreviousTime => {
        const prevTimeMoment = moment(usersPreviousTime.start_date);
        const firstWeekDayOfPrevtime = prevTimeMoment.startOf('week');
        const dayDifference = firstWeekDayOfrequestedTimesWeek.diff(firstWeekDayOfPrevtime, 'days');
        return Math.abs(dayDifference) < 14;
    });

    return usersAppointments.length === 0;
};

export const reservationRuleCheck = (usersAppointments, requestedAppointmentStartDate) => {
    const now = moment();
    const requestedTimeMoment = moment(requestedAppointmentStartDate);

    if (requestedTimeMoment.isBefore(now)) return { allowed: false, message: 'Tried to book past appointment' };

    if (requestedTimeMoment.isSame(now, 'days')) {
        const alreadyHasAppointmentSameDay = usersAppointmentOnSameDay(usersAppointments, now);

        return alreadyHasAppointmentSameDay
            ? { allowed: false, message: 'You already have an appointment booked for today' }
            : { allowed: true, message: '' };
    } else {
        const alreadyHasAppointment = usersAppointmentsWithinTheLastTwoWeeks(usersAppointments, requestedTimeMoment);

        return alreadyHasAppointment
            ? { allowed: true, message: '' }
            : { allowed: false, message: 'You already have an appointment within a week of this appointment' };
    }
};
