const express = require('express');
const Invoices = require('../models/invoiceModel');
const router = express.Router();

router.post('/', async (req, res) => {
    const { transaction_id, status } = req.body.params;

    switch (status) {
        case 1:
            console.log(`Transaction ${transaction_id} is created.`);
            break;

        case 2:
            console.log(`Transaction ${transaction_id} is completed.`);
            await completeTransaction(transaction_id);
            break;

        case -1:
        case -2:
            console.log(`Transaction ${transaction_id} is canceled.`);
            await cancelTransaction(transaction_id);
            break;

        default:
            return res.json({
                jsonrpc: '2.0',
                id: req.body.id,
                error: {
                    code: -31001,
                    message: { ru: 'Транзакция не существует', uz: 'Transaksiya mavjud emas', en: 'Transaction does not exist' }
                }
            });
    }

    res.json({
        jsonrpc: '2.0',
        id: req.body.id,
        result: { status: 'success' }
    });
});

async function completeTransaction(transactionId) {
    const course = await Invoices.findOneAndUpdate(
        { invoiceNumber: transactionId },
        { status: 'completed' },
        { new: true }
    );
    return course;
}

async function cancelTransaction(transactionId) {
    const course = await Invoices.findOneAndUpdate(
        { invoiceNumber: transactionId },
        { status: 'canceled' },
        { new: true }
    );
    return course;
}

module.exports = router;
