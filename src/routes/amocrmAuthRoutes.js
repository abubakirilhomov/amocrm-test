const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Маршрут для обработки callback от AmoCRM
router.get('/callback', authController.handleAmoCrmCallback);

module.exports = router;
