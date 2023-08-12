const express = require('express');
const router = express.Router();
const {fetcher, viewAPI, returnAPI} = require('../controllers/fetchFussball');

router.post('/newAPI', fetcher);
router.get('/show/:key/:website', viewAPI);
router.get('/:key/:website', returnAPI);

module.exports = router;






