import React from 'react';
import { SingleStretchingSession } from './SingleStretchingSession';

export const StretchingSessionList = ({ sessions, currentUsersStretchAppointments, userIsAdmin }) => (
    <div className="stretching_header">
        <h1>Stretching appointments</h1>
        <h2 className="stretching_header_title">Click to reserve</h2>
        <ul className="stretchingPage">
            {sessions.map(session => {
                return (
                    <SingleStretchingSession
                        key={session._id}
                        sessionID={session._id}
                        date={session.date}
                        users={session.users}
                        currentUsersStretchAppointments={currentUsersStretchAppointments}
                        userIsAdmin={userIsAdmin}
                    />
                );
            })}
        </ul>
    </div>
);
