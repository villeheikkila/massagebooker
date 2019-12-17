const User = require('../models/user')

const verifyIfAdmin = async (req, res, next) => {
  if (process.env.NODE_ENV === 'test') return next()

  const foundUser = await User.findById({ _id: req.user._id })
  if (!foundUser.admin) return res.status(400).end()

  next()
}

const verifyIfAdminOrSelf = async (req, res, next) => {
  if (process.env.NODE_ENV === 'test') return next()

  const foundUser = await User.findById({ _id: req.user._id })
  const givenId = req.params.id

  if (String(givenId) === String(foundUser._id)) next()
  if (!foundUser.admin) return res.status(400).end()

  next()
}

module.exports = { verifyIfAdmin, verifyIfAdminOrSelf }