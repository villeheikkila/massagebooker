import axios from 'axios';
import moment from 'moment';
import React, { createContext, useEffect, useState } from 'react';
import { Routes } from './components/Routes';
import { useResource } from './hooks/useResource';
import * as icons from './types/fa-icons';
import * as types from './types/types';

export const App = () => {
    const [users, userService] = useResource('/api/users');
    const [appointments, appointmentService] = useResource('/api/appointments');
    const [stretching, stretchingService] = useResource('/api/stretching');
    const [announcement, announcementService] = useResource('/api/announcements');
    const [notification, setNotification] = useState(null);
    const [user, setUser] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);

    const createNotification = (message, type, length) => {
        const notification =
            type === types.SUCCESS
                ? { message, icon: icons.SUCCESS, messageType: types.SUCCESS }
                : { message, icon: icons.ERROR, messageType: types.ERROR };

        setNotification(notification);

        setTimeout(() => {
            setNotification(null);
        }, length * 1000 || 3500);
    };

    const announcementNotification = {
        message: announcement ? announcement.message : '',
        type: types.GENERAL,
        icon: icons.GENERAL,
    };

    useEffect(() => {
        axios.get('/api/users/current_user').then(response => setUser(response.data));
    }, []);

    useEffect(() => {
        userService.getAll();
        const twoWeeksAgo = moment().subtract(15, 'days');
        const sixWeeksFromNow = moment().add(43, 'days');
        appointmentService.getInterval(twoWeeksAgo, sixWeeksFromNow);
        stretchingService.getAll();
        announcementService.getAll();
    }, []);

    useEffect(() => {
        user && userService.getOne(user._id).then(refreshedUser => setUser(refreshedUser));
    }, [appointments, stretching]);

    return (
        <>
            <NotificationContext.Provider
                value={{
                    createNotification,
                    announcementService,
                    announcement,
                    announcementNotification,
                    notification,
                }}
            >
                <StretchContext.Provider value={{ stretching, stretchingService }}>
                    <UserContext.Provider value={{ user, setUser, users, userService }}>
                        <AppointmentContext.Provider
                            value={{
                                appointments,
                                appointmentService,
                                selectedDate,
                                setSelectedDate,
                            }}
                        >
                            <Routes user={user} />
                        </AppointmentContext.Provider>
                    </UserContext.Provider>
                </StretchContext.Provider>
            </NotificationContext.Provider>
        </>
    );
};

export const NotificationContext = createContext({});
export const AppointmentContext = createContext({});
export const UserContext = createContext({});
export const StretchContext = createContext({});
