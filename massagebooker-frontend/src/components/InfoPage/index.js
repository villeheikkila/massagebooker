import React, { useContext, useEffect } from 'react';
import { NotificationContext, UserContext } from '../../App';
import { useResource } from '../../hooks/useResource';
import { Notification } from '../Notification';
import { CreateInfoItem } from './CreateInfoItem';
import { DeleteInfoItem } from './DeleteInfoItem';

export const InfoPage = () => {
    const { user } = useContext(UserContext);
    const { announcement, notification, createNotification } = useContext(NotificationContext);
    const [info, infoService] = useResource('/api/info');

    useEffect(() => {
        infoService.getAll();
    }, []);

    if (!user || !info) return <h2>Loading...</h2>;

    return (
        <div className="infoPage">
            {notification && <Notification notification={notification} />}
            {user.admin && <CreateInfoItem infoService={infoService} createNotification={createNotification} />}
            <div>
                <ul>
                    {info.map(element => (
                        <>
                            <li className="infoItem">
                                <h2>{element.header}</h2>
                                <div>{element.content}</div>
                            </li>
                            {user.admin && (
                                <DeleteInfoItem
                                    id={element._id}
                                    infoService={infoService}
                                    createNotification={createNotification}
                                />
                            )}
                        </>
                    ))}
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
