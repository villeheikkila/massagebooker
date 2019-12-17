import React from 'react';
import { useField } from '../../hooks/useField';

export const CreateInfoItem = ({ infoService, createNotification }) => {
    const contentField = useField('');
    const headerField = useField('');

    const createInfoItem = async event => {
        if (contentField.value === '') {
            createNotification('Cant create info item without content ');
        } else {
            event.preventDefault();

            const infoItem = {
                header: headerField.value,
                content: contentField.value,
            };

            infoService.create(infoItem);
            contentField.reset();
            headerField.reset();
            createNotification('Info item created', 'success');
        }
    };

    return (
        <form className="create_info_item_form" onSubmit={createInfoItem}>
            <div>
                Header (optional)
                <br />
                <input
                    className="info_header_input"
                    value={headerField.value}
                    onChange={headerField.handleFieldChange}
                />
            </div>
            <div>
                Content (required)
                <input
                    className="info_content_input"
                    value={contentField.value}
                    onChange={contentField.handleFieldChange}
                />
            </div>

            <button className="dashboard_announcement_button" type="submit">
                Add info
            </button>
            <hr />
        </form>
    );
};
