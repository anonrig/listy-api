var APIError = require('listy/lib/error'),
    config = require('listy/config');


/**
 * Ensure user is authenticated.
 *
 * @param req Request.
 * @param res Response.
 * @param next Callback function.
 *
 * @returns {*}
 */
exports.ensureAuthentication = function(req, res, next) {
    if (req.isAuthenticated())
        return next();

    next(new APIError('not authorized', 401));
};