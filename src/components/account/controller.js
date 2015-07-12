var router = require('express').Router(),
    APIError = require('listy/lib/error'),
    passport = require('passport'),
    config = require('listy/config'),
    auth = require('listy/lib/auth'),
    jwt = require('jsonwebtoken');

var Account = require('./model');


router.post('/facebook', passport.authenticate('facebook-token', { scope: ['email'] }), function(req, res) {
    res.json({
        token: jwt.sign(req.user.id, config.get('jwt-secret'))
    });
});


router.get('/me', auth.ensureAuthentication, function(req, res, next) {
    Account.find({ accepted: false, accepted_date: {"$lt": req.user._id.getTimestamp()} }).exec(function(err, result) {
        if (err) return next(err);

        res.json({
            'facebook': req.user.facebook,
            'line': result.length - 1 || 0
        });
    });
});

module.exports = router;