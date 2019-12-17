import React from 'react';

export const DeleteInfoItem = ({ id, infoService, createNotification }) => {
    const deleteItem = async () => {
        try {
            await infoService.remove(id);
            createNotification('item deleted', 'success');
        } catch (exception) {
            createNotification('Failed to delete item');
        }
    };

    return (
        <button onClick={deleteItem} className="delete_info_button">
            Delete
        </button>
    );
};
