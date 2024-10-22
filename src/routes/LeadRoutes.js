const express = require('express');
const LeadController = require('../controllers/leadController');
const router = express.Router();

router.post('/create-lead', LeadController.createLead);

module.exports = router;
