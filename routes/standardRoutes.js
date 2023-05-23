const express = require('express');
const router = express.Router();
const {fetcher, viewAPI, returnAPI} = require('../controllers/fetchFussball');

router.post('/api/v1/newAPI', fetcher);
router.get('/api/v1/show/:key/:website', viewAPI);
router.get('/api/v1/:key/:website', returnAPI);

module.exports = router;






