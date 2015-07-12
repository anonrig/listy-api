var APIError = require('listy/lib/error'),
    config = require('listy/config'),
    Account = require('listy/components/account/model'),
    jwt = require('jsonwebtoken');


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
    if (!req.headers.authorization)
        return next(new APIError('not authorized', 401));

    var userId = jwt.verify(req.headers.authorization.split(' ')[1], config.get('jwt-secret'))
    Account.findById(userId).exec(function(err, user) {
        if (err) return next(err);

        req.user = user;

        return next();
    });
};
