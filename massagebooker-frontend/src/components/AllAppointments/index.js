import React, { useContext } from 'react';
import { AppointmentContext, UserContext } from '../../App';
import Appointment from '../Appoinment';

const AllAppointments = () => {
    const { appointments, selectedDate, appointmentService } = useContext(AppointmentContext);
    const { users, user } = useContext(UserContext);
    const givenDate = new Date(selectedDate);

    const selectedDay = givenDate.getDate();
    const selectedMonth = givenDate.getMonth() + 1;
    const selectedYear = givenDate.getFullYear();

    // compares appointment time to selected date on calendar, filtering to only include selected days appointments
    const todaysAppointments = appointments.filter(appointment => {
        const appointmentsDate = new Date(appointment.start_date);
        const appointmentsDay = appointmentsDate.getDate();
        const appointmentsMonth = appointmentsDate.getMonth() + 1;
        const appointmentsYear = appointmentsDate.getFullYear();

        return (
            appointmentsMonth === selectedMonth && appointmentsDay === selectedDay && appointmentsYear === selectedYear
        );
    });

    todaysAppointments.sort((a, b) => {
        const dateA = new Date(a.start_date);
        const dateB = new Date(b.start_date);

        return dateA < dateB ? -1 : dateA > dateB ? 1 : 0;
    });

    const unavailable = todaysAppointments.every(value => value.type_of_reservation === 3);

    const getStart_Date = date => {
        const dateObject = new Date(date);
        const minutes = dateObject.getMinutes();
        const time = dateObject.getTimezoneOffset();
        dateObject.setMinutes(minutes + time);
        return dateObject;
    };

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
                            start_date={getStart_Date(app.start_date)}
                            type_of_reservation={app.type_of_reservation}
                            appUser={users.find(user => user._id === app.user_id)}
                        />
                    ))}
                </ul>
            </div>
        )
    );
};

export default AllAppointments;
