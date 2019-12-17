/* helper for correcting timezone offset*/
const formatStartDate = date => {
    date = new Date(date);
    const minutes = date.getMinutes();
    const time = date.getTimezoneOffset();
    date.setMinutes(minutes + time);
    return date;
};

export default formatStartDate;
