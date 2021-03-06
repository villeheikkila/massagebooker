import React, { useContext, useEffect } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { NotificationContext, UserContext } from '../../App';
import { useField } from '../../hooks/useField';
import { announcementNotification } from '../../utils';
import { Notification } from '../Notification';
import { OwnAppointments } from './OwnAppointments';

export const MyPage = () => {
    const { user, setUser, userService } = useContext(UserContext);
    const { createNotification, notification, announcement } = useContext(NotificationContext);
    const numberField = useField('text');

    useEffect(() => {
        numberField.changeValue(user.number);
    }, [user]);

    if (!user) return <h2>Loading...</h2>;

    const handleNumberUpdate = async event => {
        event.preventDefault();
        try {
            const updatedUser = { ...user, number: numberField.value };

            setUser(updatedUser);
            const response = await userService.update(user._id, updatedUser, 'user');

            if (response) {
                createNotification(response.data.error);
            } else {
                createNotification('Succesfully changed number', 'success');
            }
        } catch (exception) {
            createNotification('Unable to change number');
        }
    };

    const handleRemoveUser = async id => {
        confirmAlert({
            message: 'Are you sure you want to remove your profile?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        try {
                            await userService.remove(id);
                        } catch (exception) {
                            window.location.reload();
                        }
                    },
                },
                {
                    label: 'No',
                },
            ],
        });
    };

    // NOTICE -- user && rest rendered. Otherwise nothing gets rendered
    return (
        user && (
            <div>
                {notification ? (
                    <Notification notification={notification} />
                ) : (
                    <Notification notification={announcementNotification(announcement)} />
                )}
                <div className="mypage_wrapper">
                    <div className="own_info">
                        <h2>{user.name}</h2>
                        {user.avatarUrl ? (
                            <img src={user.avatarUrl} alt="profile pic" height="180" width="180" />
                        ) : (
                            'avatar'
                        )}
                        <label>Phone number</label>
                    </div>
                    <form className="mypage_form" onSubmit={handleNumberUpdate}>
                        <input
                            type={numberField.type}
                            id="number"
                            value={numberField.value}
                            name="number"
                            onChange={numberField.handleFieldChange}
                        />
                        <button type="submit">Update</button>
                    </form>
                    <button className="delete_user" onClick={() => handleRemoveUser(user._id)}>
                        Remove user
                    </button>
                    <div className="own_appointments">
                        <h2>My Appointments</h2>
                        <OwnAppointments ownPage={true} />
                    </div>
                </div>
            </div>
        )
    );
};
