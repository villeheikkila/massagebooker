import React, { useContext } from 'react';
import { AppointmentContext, UserContext } from '../../App';
import { getStartDate, sortByStartDate } from '../../utils';
import { Appointment } from '../Appointment';

export const OwnAppointments = ({ ownPage }) => {
    const { appointments } = useContext(AppointmentContext);
    const { user } = useContext(UserContext);
    const ownAppointments = appointments.filter(app => app.user_id === user._id);

    const sortedOwnAppointmets = sortByStartDate(ownAppointments);

    return (
        <ul className="appointmentListWrapper">
            {sortedOwnAppointmets.map(app => {
                return (
                    <Appointment
                        key={app._id}
                        id={app._id}
                        start_date={getStartDate(app.start_date)}
                        type_of_reservation={app.type_of_reservation}
                        appUser={user}
                        ownPage={ownPage}
                    />
                );
            })}
        </ul>
    );
};
