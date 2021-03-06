import React from 'react';

export const Notification = ({ notification }) => {
    return (
        notification &&
        notification.message && (
            <div className="notification_container">
                <div className={`notification ${notification.type}`}>
                    <i className={`${notification.icon}`} />
                    <p>{notification.message}</p>
                </div>
            </div>
        )
    );
};
