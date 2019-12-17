import moment from 'moment';
import React from 'react';
import { formatStartDate, sortByStartDate, weekdays } from '../../utils';
import { SimpleAppointment } from '../SimpleAppointment';

export const DaysAppointmentsSimple = ({ dayNumber, lastdayWithAppointments, appointments }) => {
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

    // NOTE: THIS ASSUMES 13 APPOINTMETS PER DAY; IF APPOINTMETS ARE EVER ADDED OR REMOVED THIS WILL BREAK
    const firstHalf = sortedDaysAppointments.filter(app => new Date(app.start_date).getHours() < 15);
    const secondHalf = sortedDaysAppointments.filter(app => new Date(app.start_date).getHours() > 14);
    const dayHasNoAppointments = sortedDaysAppointments.filter(app => app.type_of_reservation !== 3).length === 0;

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
