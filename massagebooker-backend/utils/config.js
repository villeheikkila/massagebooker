if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const PORT = process.env.PORT
const MONGODB_URI = process.env.NODE_ENV === 'test' ? process.env.TEST_MONGODB_URI : process.env.MONGODB_URI
const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const COOKIE_KEY = process.env.COOKIE_KEY
const EMAIL_SUFFIX = process.env.EMAIL_SUFFIX
const INITIAL_ADMIN = process.env.INITIAL_ADMIN
const EMAIL_WHITELIST = process.env.EMAIL_WHITELIST

module.exports = {
  MONGODB_URI,
  PORT,
  CLIENT_ID,
  CLIENT_SECRET,
  COOKIE_KEY,
  EMAIL_SUFFIX,
  INITIAL_ADMIN,
  EMAIL_WHITELIST
}
