import React, { useContext, useEffect } from 'react';
import { NotificationContext, UserContext } from '../../App';
import useField from '../../hooks/useField';
import useResource from '../../hooks/useResource';
import Notification from '../Notification';

const InFoPage = () => {
    const { user } = useContext(UserContext);
    const { announcement, notification, createNotification } = useContext(NotificationContext);
    const [info, infoService] = useResource('/api/info');

    useEffect(() => {
        infoService.getAll();
    }, []);

    if (!user || !info[0]) return <h2>Loading...</h2>;

    const { _id, header, content } = info[0];

    return (
        <div className="infoPage">
            {notification && <Notification notification={notification} />}
            {user.admin && <CreateInfoItem infoService={infoService} createNotification={createNotification} />}
            <div>
                <ul>
                    <>
                        <InfoItem key={_id} header={header} content={content} />
                        {user.admin && (
                            <DeleteInfoItem
                                id={_id}
                                infoService={infoService}
                                createNotification={createNotification}
                            />
                        )}
                    </>
                </ul>
            </div>
            <div>
                {announcement && announcement.message && (
                    <div className="index_notice">
                        <h2>Notice</h2>
                        <p>{announcement.message}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const CreateInfoItem = ({ infoService, createNotification }) => {
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

const InfoItem = ({ header, content }) => (
    <li className="infoItem">
        <h2>{header}</h2>
        <div>{content}</div>
    </li>
);

const DeleteInfoItem = ({ id, infoService, createNotification }) => {
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

export default InFoPage;
