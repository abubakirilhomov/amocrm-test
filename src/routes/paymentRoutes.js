const express = require('express');
const { checkPerform, createTransaction, performTransaction } = require('../controllers/paymentControllers');
const router = express.Router();

router.post('/check-perform-transaction', checkPerform);
router.post('/create-transaction', createTransaction);
router.post('/perform-transaction', performTransaction);

module.exports = router;