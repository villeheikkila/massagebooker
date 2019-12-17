import React, { useEffect } from 'react';
import { useResource } from '../../hooks/useResource';

export const Stats = () => {
    const [stats, statsService] = useResource('api/stats');

    useEffect(() => {
        statsService.getAll();
    }, []);

    if (stats.length === 0) return <h2>Loading...</h2>;

    const {
        numberOfUnusedPastAppointments,
        numberOfPastAppointments,
        numberOfUsers,
        totalAppointmentsUsed,
        mostAppointmentsBySingleUser,
        usersWhoHaveUsedMassage,
    } = stats;

    return (
        <>
            <div className="statsWrapper">
                <h1>Statistics</h1>
                <ol>
                    <hr />
                    <li>
                        <p>
                            {` ${((numberOfUnusedPastAppointments / numberOfPastAppointments) * 100).toFixed(
                                1,
                            )} % of possible appointments went unused`}{' '}
                        </p>
                    </li>

                    <li>
                        <p>{`Number of users ${numberOfUsers}`}</p>
                    </li>
                    <li>
                        <p>{`Number of users who have used massages ${usersWhoHaveUsedMassage}`}</p>
                    </li>
                    <li>
                        <p>{`Number of appointments needed per week if all active users fully utilize their massages ${usersWhoHaveUsedMassage /
                            2} (users who have made appointments are considered active)`}</p>
                    </li>
                    <li>
                        <p>{`Average appointments per user ${(totalAppointmentsUsed / numberOfUsers).toFixed(2)}`}</p>
                    </li>
                    <li>
                        <p>{`Most appointments by single user  ${mostAppointmentsBySingleUser}`}</p>
                    </li>
                </ol>
            </div>
        </>
    );
};
