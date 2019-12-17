import React, { useContext } from 'react';
import { AppointmentContext, NotificationContext, UserContext } from '../../App';
import { Display } from '../Display';
import { reservationRuleCheck } from './rules';

export const CreateAppointment = ({ id, start_date }) => {
    const { user } = useContext(UserContext);
    const { appointmentService } = useContext(AppointmentContext);
    const { createNotification } = useContext(NotificationContext);

    const handleAppointmentCreation = async () => {
        const ruleCheckResult = reservationRuleCheck(user.appointments, start_date);

        if (ruleCheckResult.allowed) {
            await appointmentService.update(id, { type_of_reservation: 1, user_id: user._id });
            createNotification('Appointment reserved succesfully', 'success');
        } else {
            createNotification(ruleCheckResult.message);
        }
    };

    return (
        <button
            id={reservationRuleCheck(user.appointments, start_date).allowed ? 'available' : 'impossible'}
            onClick={() => handleAppointmentCreation()}
        >
            <Display dateobject={start_date} free={true} />
        </button>
    );
};
