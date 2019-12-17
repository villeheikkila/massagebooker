import moment from 'moment';
import React, { useEffect } from 'react';
import useResource from '../../hooks/useResource';
import unity4 from '../../pics/unity4.png';
import formatStartDate from '../../utils/formatStartDate';
import Clock from '../Clock';
import DaysAppointmentsSimple from '../DaysAppointmentsSimple';
import SimpleAppointment from '../SimpleAppointment';

const TV = () => {
    const [tv, tvService] = useResource('/api/tv');
    const now = moment();

    useEffect(() => {
        tvService.getAll();
    }, []);

    // every 24 minutes force page refresh to keep next appointment up to date.
    setInterval(() => {
        window.location.reload();
    }, 1440000);

    const announcement = tv.pop();

    if (announcement === undefined) {
        return null;
    }

    // Find next appointment
    const comingAppointments = tv.filter(app => {
        const appStartTime = moment(app.start_date);
        return appStartTime.isAfter(now);
    });

    comingAppointments.sort((a, b) => {
        const dateA = new Date(a.start_date);
        const dateB = new Date(b.start_date);
        return dateA - dateB;
    });

    const next = comingAppointments.filter(app => app.type_of_reservation !== 3)[0]
        ? comingAppointments.filter(app => app.type_of_reservation !== 3)[0]
        : null;

    return (
        <div className="tv_view">
            <div>
                <Clock />

                <h2>NEXT APPOINTMENT</h2>
                {next && (
                    <ul className="tvViewAppointmentList">
                        <div className="cont_tv">
                            <SimpleAppointment
                                key={next._id}
                                id={next._id}
                                start_date={formatStartDate(next.start_date)}
                                type_of_reservation={next.type_of_reservation}
                                appUser={next.user}
                            />
                        </div>
                    </ul>
                )}

                {announcement && announcement.message && (
                    <div className="tv_notice">
                        <h2>Notice</h2>
                        <p>{announcement.message}</p>
                    </div>
                )}

                <img className="logoTV" id="unity4" src={unity4} alt=""></img>
            </div>
            <div className="day-view">
                <DaysAppointmentsSimple dayNumber={1} lastdayWithAppointments={0} appointments={tv} />
            </div>
            <div className="day-view">
                <DaysAppointmentsSimple dayNumber={2} lastdayWithAppointments={0} appointments={tv} />
            </div>

            <div></div>
        </div>
    );
};

export default TV;
