import moment from 'moment';
import React, { useState } from 'react';

const Clock = () => {
    const initial = moment();
    const initialHour = initial.hour();
    const initialMinutes = initial.minute();
    const initialMinutesFormatted = initialMinutes < 10 ? `0${initialMinutes}` : initialMinutes;
    const [currentTime, setCurrentTime] = useState(`${initialHour}:${initialMinutesFormatted}`);

    setInterval(() => {
        const now = moment();
        const hour = now.hour();
        const minutes = now.minute();
        const minutesFormatted = minutes < 10 ? `0${minutes}` : minutes;

        setCurrentTime(`${hour}:${minutesFormatted}`);
    }, 1000);

    return <div className="clock">{currentTime}</div>;
};

export default Clock;
