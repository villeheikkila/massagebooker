import React from 'react';
import { sortByStartDate } from '../../utils';
import { SimpleAppointment } from './SimpleAppointment';

export const NextAppointment = ({ user, appointments }) => {
    const ownAppointments = appointments.filter(app => app.user_id === user._id);
    const sortedOwnAppointments = sortByStartDate(ownAppointments);

    return !sortedOwnAppointments[0] ? (
        <div className="desktop_no_appointments_info">
            <p>You currently have no appointments booked, you can reserve one using the calendar below.</p>
        </div>
    ) : (
        <SimpleAppointment app={sortedOwnAppointments[0]} />
    );
};
