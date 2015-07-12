var db = require('listy/lib/db'),
    app = require('listy/app/index'),
    handle = require('listy/lib/handlers/system'),
    async = require('async');


async.series(
    [
        db.connect,
        app.listenBound
    ],
    handle('App init')
);