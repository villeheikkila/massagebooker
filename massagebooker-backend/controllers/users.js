const User = require('../models/user');
const Appointment = require('../models/appointment');
const usersRouter = require('express').Router();
const bodyParser = require('body-parser');
usersRouter.use(bodyParser.json());
const appointmentUtil = require('../utils/appointmentUtil');
const verify = require('../utils/verify');

const formatUser = input => {
    return {
        _id: input._id,
        name: input.name,
        number: input.number,
        email: input.email,
        admin: input.admin,
        banned: input.banned,
        appointments: input.appointments,
        stretchingSessions: input.stretchingSessions,
        avatarUrl: input.avatarUrl,
    };
};

// Returns current user data depending on whether one has logged in or not
usersRouter.get('/current_user', async (req, res) => {
    if (req.user) {
        res.send(req.user);
    } else {
        res.send({ error: 'not authenticated' })
            .status(400)
            .end();
    }
});

usersRouter.get('/', async (req, res, next) => {
    try {
        const users = await User.find({}).populate('appointments');
        res.json(users.map(formatUser));
    } catch (exception) {
        next(exception);
    }
});

usersRouter.get('/:id', async (req, res, next) => {
    try {
        const user = await User.findById({ _id: req.params.id }).populate('appointments');
        res.json(user);
    } catch (exception) {
        next(exception);
    }
});

usersRouter.put('/:id/user', async (req, res, next) => {
    try {
        const body = req.body;
        const given_id = req.params.id;
        const found_user = await User.findById({ _id: given_id });

        if (!found_user)
            return res
                .status(400)
                .json({ error: 'Requested user was not found' })
                .end();

        if (body.number.length > 10) return res.json({ error: 'The entered phone number is too long' }).end();

        if (body.number.length < 7) return res.json({ error: 'The entered phone number is too short' }).end();

        const updateUserData = {
            number: body.number || '',
        };

        const updatedUser = await User.findByIdAndUpdate(req.params.id, updateUserData, { new: true });

        res.json(updatedUser);
    } catch (exception) {
        next(exception);
    }
});

// User data which gets updated by administrator only
usersRouter.put('/:id', verify.verifyIfAdmin, async (req, res, next) => {
    try {
        const body = req.body;
        const updatableUser = await User.findById({ _id: req.params.id });

        const admin = !body.admin ? updatableUser.admin : body.admin;
        const banned = !body.banned ? updatableUser.banned : body.banned;

        const updateUserData = {
            admin,
            banned,
        };

        const updatedUser = await User.findByIdAndUpdate(updatableUser._id, updateUserData, { new: true });
        res.json(updatedUser);
    } catch (exception) {
        next(exception);
    }
});

usersRouter.delete('/:id', verify.verifyIfAdminOrSelf, async (req, res, next) => {
    try {
        const user = await User.findById({ _id: req.params.id });
        await emptyAppointmentsFromUser(user);
        await emptyStretchingsFromUser(user);
        await user.remove();
        res.status(204).end();
    } catch (exception) {
        next(exception);
    }
});

const emptyAppointmentsFromUser = async user => {
    const appointments = await Appointment.find({ user_id: user._id });
    appointments.forEach(async appointment => await appointmentUtil.removeUserFromAppointment(appointment));
};

const emptyStretchingsFromUser = async user => {
    const stretchings = user.stretchingSessions;
    stretchings.forEach(async stretching => await appointmentUtil.removeUserFromStretching(user._id, stretching));
};

module.exports = usersRouter;
