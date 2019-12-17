const routeProtector = (req, res, next) =>
    req.isAuthenticated() || process.env.NODE_ENV === 'test' ? next() : res.status(401).end();

module.exports = { routeProtector };
