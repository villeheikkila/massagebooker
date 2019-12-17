import { useState } from 'react';

export const useField = (type, defaultValue) => {
    const [value, setValue] = useState('');

    const handleFieldChange = event => {
        setValue(event.target.value);
    };

    const changeValue = value => {
        setValue(value);
    };

    const reset = (defaultValue = '') => {
        setValue(defaultValue);
    };

    return { type, value, handleFieldChange, reset, changeValue };
};
