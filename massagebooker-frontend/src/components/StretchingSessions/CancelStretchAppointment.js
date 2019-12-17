import React, { useContext } from 'react';
import { NotificationContext, StretchContext } from '../../App';

export const CancelStretchAppointment = ({ sessionID }) => {
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
