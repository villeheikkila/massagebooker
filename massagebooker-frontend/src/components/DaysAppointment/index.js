import moment from 'moment';
import React, { useContext } from 'react';
import { AppointmentContext, UserContext } from '../../App';
import { formatStartDate, sortByStartDate, weekdays } from '../../utils';
import { Appointment } from '../Appointment';

export const DaysAppointments = ({ dayNumber, lastdayWithAppointments }) => {
    const { appointments } = useContext(AppointmentContext);
    const { users } = useContext(UserContext);
    const now = moment();

    const day =
        now.day() <= lastdayWithAppointments
            ? moment()
                  .startOf('week')
                  .add(dayNumber, 'days')
            : moment()
                  .startOf('week')
                  .add(7 + dayNumber, 'days');

    // Compares appointment time to selected date on calendar, filtering to only include selected days appointments
    const daysAppointments = appointments.filter(appointment => {
        const appointmentsDate = moment(appointment.start_date);
        return day.isSame(appointmentsDate, 'day');
    });

    const sortedDaysAppointments = sortByStartDate(daysAppointments);
    const nameOfDay = weekdays[dayNumber];

    // Note: This assumes 13 appointments per day, otherwise it will not wok.
    const firstHalf = sortedDaysAppointments.slice(0, 5);
    const secondHalf = sortedDaysAppointments.slice(5, 12);

    return (
        <div>
            <h2 className="tv_view_headers">{nameOfDay}</h2>

            <ul className="tvViewAppointmentList">
                {firstHalf.map(app => {
                    return (
                        <Appointment
                            key={app._id}
                            id={app._id}
                            start_date={formatStartDate(app.start_date)}
                            type_of_reservation={app.type_of_reservation}
                            appUser={users.find(user => user._id === app.user_id)}
                        />
                    );
                })}
            </ul>

            <h5 className="tv_view_headers">Break</h5>

            <ul className="tvViewAppointmentList">
                {secondHalf.map(app => {
                    return (
                        <Appointment
                            key={app._id}
                            id={app._id}
                            start_date={formatStartDate(app.start_date)}
                            type_of_reservation={app.type_of_reservation}
                            appUser={users.find(user => user._id === app.user_id)}
                        />
                    );
                })}
            </ul>
        </div>
    );
};
