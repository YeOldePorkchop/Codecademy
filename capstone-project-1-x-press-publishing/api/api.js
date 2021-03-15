const express = require('express');
const router = express.Router();
const artistsRouter = require('./artists');

router.use('/artists', artistsRouter);

module.exports = router;