/* helper for correcting timezone offset*/
export const formatStartDate = date => {
    date = new Date(date);
    const minutes = date.getMinutes();
    const time = date.getTimezoneOffset();
    date.setMinutes(minutes + time);
    return date;
};

export const getDateSuffix = date =>
    date < 11 || date > 13 ? ['st ', 'nd ', 'rd ', 'th '][Math.min((date - 1) % 10, 3)] : 'th ';

export const prettyDateString = dateToPretify => {
    const date = new Date(dateToPretify);

    // Fix timezone offset
    const minutes = date.getMinutes();
    const time = date.getTimezoneOffset();
    date.setMinutes(minutes + time);

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutesFixed = date.getMinutes();
    const minutesString = minutesFixed < 10 ? `0${minutesFixed}` : minutesFixed;

    return `${day}.${month}.${year} ${hours}:${minutesString}`;
};

export const sortByStartDate = appointments =>
    appointments.sort((a, b) => {
        const dateA = new Date(a.start_date);
        const dateB = new Date(b.start_date);

        return dateA < dateB ? -1 : dateA > dateB ? 1 : 0;
    });

export const getStartDate = date => {
    const dateObject = new Date(date);
    const minutes = dateObject.getMinutes();
    const time = dateObject.getTimezoneOffset();
    dateObject.setMinutes(minutes + time);
    return dateObject;
};

export const weekdays = {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
};

export const months = {
    0: 'January',
    1: 'February',
    2: 'March',
    3: 'April',
    4: 'May',
    5: 'June',
    6: 'July',
    7: 'August',
    8: 'September',
    9: 'October',
    10: 'November',
    11: 'December',
};
