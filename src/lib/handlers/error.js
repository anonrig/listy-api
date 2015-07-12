var APIError = require('listy/lib/error');

module.exports = function(err, req, res, next) {
    var shownError = err instanceof APIError ? err : { message: 'Server error' };

    console.error(err);

    shownError.level = APIError.Levels[err.level || 3];
    res.status(err.status || 500);
    delete shownError.status;

    res.json({ error: shownError }).end();
};