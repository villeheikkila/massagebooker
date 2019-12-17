import React, { useContext } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { NotificationContext } from '../../App';
import { useField } from '../../hooks/useField';
import { announcementNotification } from '../../utils';
import { Notification } from '../Notification';
import { UserList } from './UserList';

export const DashBoard = () => {
    const { announcementService, notification, announcement } = useContext(NotificationContext);
    const editedAnnouncement = useField('');

    const changeAnnouncement = event => {
        event.preventDefault();
        announcementService.createWithoutConcat({ message: editedAnnouncement.value });
    };

    return (
        <div>
            {notification && (
                <div className="dashboard_notification_container">
                    <Notification notification={notification} />
                </div>
            )}

            <Notification notification={announcementNotification(announcement)} />
            <h2 className="dashboard_announcement_labels">Set Announcement</h2>
            <p className="dashboard_announcement_labels">Making an empty announcement clears the announcement</p>
            <form className="dashboard_form" onSubmit={changeAnnouncement}>
                <input
                    className="dashboard_announcement"
                    value={editedAnnouncement.value}
                    onChange={editedAnnouncement.handleFieldChange}
                />
                <br />
                <button type="submit">Change</button>
            </form>

            <UserList />
        </div>
    );
};
