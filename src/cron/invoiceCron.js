const cron = require('node-cron');
const Invoice = require('../models/invoiceModel');
const { checkInvoicesForExpiration } = require('../controllers/paymentController');


const startInvoiceCronJob = () => {
    cron.schedule('0 0 * * *', async () => {
        console.log('Running cron job to check unpaid invoices...');
        await checkInvoicesForExpiration();
    });
};

module.exports = startInvoiceCronJob;
