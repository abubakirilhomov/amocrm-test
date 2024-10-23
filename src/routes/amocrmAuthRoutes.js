const express = require('express');
const router = express.Router();
const authController = require('../controllers/amocrmAuthControllers');

router.get('/callback', authController.handleAmoCrmCallback);

module.exports = router;