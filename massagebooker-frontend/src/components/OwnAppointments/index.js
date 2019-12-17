import React, { useContext } from 'react';
import { AppointmentContext, UserContext } from '../../App';
import Appointment from '../Appoinment';

const OwnAppointments = ({ ownPage }) => {
    const { appointments } = useContext(AppointmentContext);
    const { user } = useContext(UserContext);
    const ownAppointments = appointments.filter(app => app.user_id === user._id);

    const getStart_Date = date => {
        date = new Date(date);
        const minutes = date.getMinutes();
        const time = date.getTimezoneOffset();
        date.setMinutes(minutes + time);
        return date;
    };

    ownAppointments.sort((a, b) => {
        const dateA = new Date(a.start_date);
        const dateB = new Date(b.start_date);

        return dateA < dateB ? -1 : dateA > dateB ? 1 : 0;
    });

    return (
        <ul className="appointmentListWrapper">
            {ownAppointments.map(app => {
                return (
                    <Appointment
                        key={app._id}
                        id={app._id}
                        start_date={getStart_Date(app.start_date)}
                        type_of_reservation={app.type_of_reservation}
                        appUser={user}
                        ownPage={ownPage}
                    />
                );
            })}
        </ul>
    );
};

export default OwnAppointments;
