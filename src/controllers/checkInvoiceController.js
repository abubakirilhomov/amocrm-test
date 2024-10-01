const Invoice = require('../models/invoiceModel');

const updateInvoiceStatusToPaid = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id);
        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        invoice.status = 'ОПЛАЧЕНО';
        await invoice.save();

        res.json(invoice);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const checkInvoicesForExpiration = async (req, res) => {
    try {
        const invoices = await Invoice.find({ status: 'ВЫСТАВЛЕНО' });
        const currentTime = new Date();

        invoices.forEach(async (invoice) => {
            const threeDaysLater = new Date(invoice.createdAt.getTime() + 3 * 24 * 60 * 60 * 1000);
            if (currentTime >= threeDaysLater) {
                invoice.status = 'НЕ ОПЛАЧЕНО';
                await invoice.save();
            }
        });

        res.json({ message: 'Invoices checked for expiration' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    updateInvoiceStatusToPaid,
    checkInvoicesForExpiration,
};
