var express = require('express'),
    app = express(),
    server = require('http').Server(app),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    helmet = require('helmet'),
    compression = require('compression'),
    config = require('listy/config'),
    passport = require('passport'),
    FacebookTokenStrategy = require('passport-facebook-token').Strategy,
    session = require('express-session'),
    RedisStore = require('connect-redis')(session),
    redis = require('redis').createClient(),
    redisStore = new RedisStore({
        host: config.get('redis:host'),
        port: config.get('redis:port'),
        client: redis
    }),
    Account = require('listy/components/account/model'),
    APIError = require('listy/lib/error');

passport.use(new FacebookTokenStrategy({
    clientID: config.get('facebook:id'),
    clientSecret: config.get('facebook:secret'),
    profileFields: ['id', 'photos', 'emails', 'displayName', 'name', 'gender']
}, function(accessToken, refreshToken, profile, done) {
    Account.findOne({ 'facebook.id': profile.id }, function(err, user) {
        if (err) return done(err);

        if (!user) {
            var currentUser = new Account({
                provider: 'facebook',
                email: profile.emails[0].value,
                facebook: {
                    id: profile.id,
                    access_token: accessToken,
                    photo: profile.photos[0].value
                },
                name: profile.displayName
            }).save(function(err) {
                if (err) return done(err);

                done(null, currentUser);
            })
        }

        return done(null, user);
    });
}));


passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    Account.findById(id, done);
});

app.enable('trust proxy');
app.disable('x-powered-by');

app.use(helmet());
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(session({
    secret: config.get('session-secret'),
    proxy: true,
    maxAge: 360*5, 
    resave: true,
    saveUninitialized: true,
    store: redisStore
}));
app.use(passport.initialize());
app.use(passport.session());


/**
 * Routing.
 */
app.use('/v1', require('listy/routes/v1'));
app.use('/', require('listy/routes'));

app.use(require('listy/lib/handlers/error'));

app.listenBound = server.listen.bind(server, config.get('http:port'));

module.exports = app;