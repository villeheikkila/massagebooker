import React from 'react';

const Display = ({ dateobject, user, ownPage, free, removed, cancel }) => {
    const date = new Date(dateobject);

    const day = date.getDate();
    const minutes = date.getMinutes();
    const month = date.getMonth() + 1;

    const dayString = date.getDate() < 10 ? `0${date.getDate()}` : day;
    const monthString = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : month;
    const minuteString = date.getMinutes() < 10 ? `0${minutes}` : minutes;
    const dateString = `${dayString}.${monthString}.${date.getFullYear()}`;

    const clickCancel = cancel ? <span id="cancel_text">Click to cancel</span> : null;
    const userDisplay = user ? user.name : free ? <span>Free</span> : null;
    const remove = removed ? <span>Removed</span> : null;

    return (
        <h4 className="own_appointment">
            {ownPage ? dateString : ''} {`${date.getHours()}:${minuteString}`} {userDisplay} {remove} {clickCancel}
        </h4>
    );
};

export default Display;
