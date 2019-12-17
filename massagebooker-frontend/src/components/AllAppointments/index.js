import React, { useContext } from 'react';
import { AppointmentContext, UserContext } from '../../App';
import { getStartDate } from '../../utils';
import { Appointment } from '../Appointment';
import { appointmentsToday } from './appointmentsToday';

export const AllAppointments = () => {
    const { appointments, selectedDate, appointmentService } = useContext(AppointmentContext);
    const { users, user } = useContext(UserContext);
    const givenDate = new Date(selectedDate);

    const todaysAppointments = appointmentsToday(appointments, givenDate);
    const unavailable = todaysAppointments.every(value => value.type_of_reservation === 3);

    const markDayUnavailable = async () => {
        await appointmentService.updateExpectMany(givenDate.toDateString(), 'removeDate');
    };

    const markDayAvailable = async () => {
        await appointmentService.updateExpectMany(givenDate.toDateString(), 'addDate');
    };

    return (
        todaysAppointments && (
            <div className="appointmentListWrapper">
                <div className="controls">
                    {user.admin &&
                        (unavailable ? (
                            <button onClick={() => markDayAvailable()}>Mark this day as available</button>
                        ) : (
                            <button onClick={() => markDayUnavailable()}>Mark this day as unavailable</button>
                        ))}
                </div>
                <ul className="appointmentListWrapper">
                    {todaysAppointments.map(app => (
                        <Appointment
                            key={app._id}
                            id={app._id}
                            start_date={getStartDate(app.start_date)}
                            type_of_reservation={app.type_of_reservation}
                            appUser={users.find(user => user._id === app.user_id)}
                        />
                    ))}
                </ul>
            </div>
        )
    );
};
