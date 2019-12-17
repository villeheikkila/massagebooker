import { sortByStartDate } from '../../utils';

export const appointmentsToday = (appointments, givenDate) => {
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

    return sortByStartDate(todaysAppointments);
};
