import React from 'react';

export const StretchingSessionUser = ({ data, description }) => (
    <li>
        <b>{data.name}:</b>
        <br />
        <i id="description">{description}</i>
    </li>
);
