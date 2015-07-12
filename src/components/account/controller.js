var router = require('express').Router(),
    APIError = require('listy/lib/error'),
    passport = require('passport'),
    auth = require('listy/lib/auth');

var Account = require('./model');


router.post('/facebook', passport.authenticate('facebook-token', { scope: ['email'] }), function(req, res) {
    res.json(req.user);
});


router.get('/me', passport.authenticate('facebook-token'), function(req, res) {
    res.json(req.user);
});

module.exports = router;