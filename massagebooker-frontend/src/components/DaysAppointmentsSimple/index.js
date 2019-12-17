import moment from 'moment';
import React from 'react';
import formatStartDate from '../../utils/formatStartDate';
import SimpleAppointment from '../SimpleAppointment';

const DaysAppointmentsSimple = ({ dayNumber, lastdayWithAppointments, appointments }) => {
    const now = moment();
    const day =
        now.day() <= lastdayWithAppointments
            ? moment()
                  .startOf('week')
                  .add(dayNumber, 'days')
            : (day = moment()
                  .startOf('week')
                  .add(7 + dayNumber, 'days'));

    // Compares appointment time to selected date on calendar, filtering to only include selected days appointments
    const daysAppointments = appointments.filter(appointment => {
        const appointmentsDate = moment(appointment.start_date);
        return day.isSame(appointmentsDate, 'day');
    });

    daysAppointments.sort((a, b) => {
        const dateA = new Date(a.start_date);
        const dateB = new Date(b.start_date);
        return dateA - dateB;
    });

    const weekdays = {
        0: 'Sunday',
        1: 'Monday',
        2: 'Tuesday',
        3: 'Wednesday',
        4: 'Thursday',
        5: 'Friday',
        6: 'Saturday',
    };

    // NOTE: THIS ASSUMES 13 APPOINTMETS PER DAY; IF APPOINTMETS ARE EVER ADDED OR REMOVED THIS WILL BREAK
    const firstHalf = daysAppointments.filter(app => new Date(app.start_date).getHours() < 15);
    const secondHalf = daysAppointments.filter(app => new Date(app.start_date).getHours() > 14);
    const dayHasNoAppointments = daysAppointments.filter(app => app.type_of_reservation !== 3).length === 0;

    return (
        <div>
            <h2 className="tv_view_day">{weekdays[dayNumber]}</h2>
            {dayHasNoAppointments ? (
                <div className="tv_view_header">
                    <h2>No massages on this day</h2>
                </div>
            ) : (
                <div>
                    <ul className="tvViewAppointmentList">
                        {firstHalf.map(app => {
                            return (
                                <SimpleAppointment
                                    key={app._id}
                                    id={app._id}
                                    start_date={formatStartDate(app.start_date)}
                                    type_of_reservation={app.type_of_reservation}
                                    appUser={app.user}
                                />
                            );
                        })}
                    </ul>

                    <h5 className="tv_view_headers">Break</h5>

                    <ul className="tvViewAppointmentList">
                        {secondHalf.map(app => (
                            <SimpleAppointment
                                key={app._id}
                                id={app._id}
                                start_date={formatStartDate(app.start_date)}
                                type_of_reservation={app.type_of_reservation}
                                appUser={app.user}
                            />
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default DaysAppointmentsSimple;
