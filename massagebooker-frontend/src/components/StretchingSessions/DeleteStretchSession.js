import React, { useContext } from 'react';
import { NotificationContext, StretchContext } from '../../App';

export const DeleteStretchSession = ({ date, sessionID }) => {
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
