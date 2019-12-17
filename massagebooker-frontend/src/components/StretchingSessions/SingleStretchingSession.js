import React, { useState } from 'react';
import { prettyDateString } from '../../utils';
import { CancelStretchAppointment } from './CancelStretchAppointment';
import { DeleteStretchSession } from './DeleteStretchSession';
import { JoinStretchAppointment } from './JoinStretchAppointment';
import { StretchingSessionUser } from './StretchingSessionUser';

export const SingleStretchingSession = ({ date, users, sessionID, currentUsersStretchAppointments, userIsAdmin }) => {
    const [visibility, setVisibility] = useState('none');

    const toggleVisibility = () => {
        const currentVisibility = visibility === 'none' ? null : 'none';
        setVisibility(currentVisibility);
    };

    const slotsUsed = users.length;
    const slotsRemainingText = `${slotsUsed} / 10 slots used `;

    return (
        <li className="stretchingList">
            {userIsAdmin && <DeleteStretchSession date={date} sessionID={sessionID} />}
            <div className="stretching_time">{prettyDateString(date)} </div>
            <h2 className="stretching_header_time" onClick={() => toggleVisibility()}>
                Attendees &nbsp;{' '}
                {visibility ? (
                    <i id="down_arrow" className="fas fa-chevron-down"></i>
                ) : (
                    <i id="up_arrow" className="fas fa-chevron-up"></i>
                )}
            </h2>

            <div className="attendees_list" style={{ display: visibility }}>
                <ul>
                    {users.map(user => {
                        return (
                            <StretchingSessionUser
                                key={user._id}
                                data={user.data ? user.data : ''}
                                description={user.description}
                            />
                        );
                    })}
                </ul>
            </div>
            {slotsRemainingText}
            {currentUsersStretchAppointments.includes(sessionID) ? (
                <CancelStretchAppointment sessionID={sessionID} />
            ) : (
                <JoinStretchAppointment sessionID={sessionID} />
            )}
        </li>
    );
};
