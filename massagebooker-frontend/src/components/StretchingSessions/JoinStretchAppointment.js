import React, { useContext } from 'react';
import { NotificationContext, StretchContext } from '../../App';
import { useField } from '../../hooks/useField';
import { Modal } from './Modal';

export const JoinStretchAppointment = ({ sessionID }) => {
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
