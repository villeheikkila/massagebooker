import React, { useContext, useState } from 'react';
import { NotificationContext, StretchContext } from '../../App';
import useField from '../../hooks/useField';

const StretchingSessionUser = ({ data, description }) => (
    <li>
        <b>{data.name}:</b>
        <br />
        <i id="description">{description}</i>
    </li>
);

const SingleStretchingSession = ({ date, users, sessionID, currentUsersStretchAppointments, userIsAdmin }) => {
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

const JoinStretchAppointment = ({ sessionID }) => {
    const { stretchingService } = useContext(StretchContext);
    const { createNotification } = useContext(NotificationContext);
    const description = useField('text');

    const joinSession = async () => {
        try {
            await stretchingService.update(sessionID, { join: true, description });
            createNotification('Joined succesfully', 'success');
        } catch (exception) {
            createNotification('Unable to join');
        }
    };
    return (
        <div>
            <Modal description={description} joinSession={joinSession} />
        </div>
    );
};

const CancelStretchAppointment = ({ sessionID }) => {
    const { stretchingService } = useContext(StretchContext);
    const { createNotification } = useContext(NotificationContext);

    const cancelSession = async () => {
        try {
            await stretchingService.update(sessionID, { join: false });
            createNotification('Reservation cancelled succesfully', 'success');
        } catch (exception) {
            createNotification('Unable to cancel');
        }
    };
    return (
        <div>
            <button className="cancel_button" onClick={cancelSession}>
                Cancel
            </button>
        </div>
    );
};

const DeleteStretchSession = ({ date, sessionID }) => {
    const { stretchingService } = useContext(StretchContext);
    const { createNotification } = useContext(NotificationContext);

    const deleteSession = async () => {
        try {
            await stretchingService.remove(sessionID);

            const dateData = new Date(date);
            const minuteAddition = dateData.getMinutes() < 10 ? '0' : '';

            createNotification(
                `Reservation on ${dateData.toDateString()} has been removed successfully! Two appointments beginning from ${dateData.getUTCHours()}:${minuteAddition}${dateData.getMinutes()} have been restored!`,
                'success',
                8,
            );
        } catch (exception) {
            createNotification(`${exception}`);
        }
    };

    return (
        <div className="delete_stretching">
            <button className="far fa-trash-alt" onClick={deleteSession}></button>
        </div>
    );
};

const Modal = ({ joinSession, description }) => {
    const [open, setOpen] = useState(false);

    const handleClose = func => {
        func();
        setOpen(false);
    };

    return (
        <>
            {!open && (
                <button className="join_button" onClick={() => setOpen(true)}>
                    Join
                </button>
            )}
            {open && (
                <div className="modal_wrapper">
                    <div>
                        <textarea
                            placeholder="Describe problem areas"
                            value={description.value}
                            onChange={description.handleFieldChange}
                            rows="3"
                        ></textarea>
                    </div>

                    <div>
                        <button onClick={() => setOpen(false)} className="modal_cancel_button">
                            Cancel
                        </button>
                        <button onClick={() => handleClose(joinSession)} className="modal_submit_button">
                            Submit
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

const prettyDateString = dateToPretify => {
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

export default SingleStretchingSession;
