var express = require('express'),
    router = express.Router();


router.use('/accounts', require('listy/components/account/controller'));

module.exports = router;