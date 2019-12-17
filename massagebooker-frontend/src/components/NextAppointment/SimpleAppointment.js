import React from 'react';
import { getDateSuffix, months, weekdays } from '../../utils';

export const SimpleAppointment = ({ app }) => {
    const date = new Date(app.start_date);
    const minutes = date.getMinutes();
    const time = date.getTimezoneOffset();
    date.setMinutes(minutes + time);

    return (
        <div className="nextappointment_wrapper">
            <p>
                Your next appointment is on {weekdays[date.getDay()]} {date.getDate()}
                {getDateSuffix(date.getDate())}
                of {months[date.getMonth()]} {date.getHours()}:
                {date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}
            </p>
        </div>
    );
};
