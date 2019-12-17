import React, { useContext } from 'react';
import { NotificationContext, StretchContext, UserContext } from '../../App';
import { Notification } from '../Notification';
import { DatePickerForm } from './DatePickerForm';
import { StretchingSessionList } from './StretchingSessionList';

export const StretchAppointmentDisplay = () => {
    const { stretching } = useContext(StretchContext);
    const { user } = useContext(UserContext);
    const { notification } = useContext(NotificationContext);

    if (!user) return <h2>Loading...</h2>;

    return (
        <div className="stretchingPage_wrapper">
            {notification ? <Notification notification={notification} /> : null}
            {user.admin && (
                <div className="stretchingPage">
                    <DatePickerForm />
                    <hr />
                </div>
            )}
            {stretching.length !== 0 ? (
                <div>
                    <StretchingSessionList
                        sessions={stretching}
                        currentUsersStretchAppointments={user.stretchingSessions}
                        userIsAdmin={user.admin}
                    />
                </div>
            ) : (
                <h1 id="no_upcoming_stretchings">No upcoming stretching sessions</h1>
            )}
        </div>
    );
};
