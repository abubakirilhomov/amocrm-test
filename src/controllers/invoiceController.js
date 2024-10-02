const Invoice = require('../models/invoiceModel');
const Course = require('../models/courseModel');
const Counter = require('../models/counterModel');

async function getNextSequenceValue(sequenceName) {
    const sequenceDocument = await Counter.findByIdAndUpdate(
        { _id: sequenceName },
        { $inc: { sequence_value: 1 } },
        { new: true, upsert: true }
    );
    return sequenceDocument.sequence_value;
}

const createInvoice = async (req, res) => {
    const { clientName, clientAddress, clientPhone, email } = req.body;

    try {
        const invoiceNumber = await getNextSequenceValue('invoiceNumber');

        const invoice = new Invoice({
            invoiceNumber,
            clientName,
            clientAddress,
            clientPhone,
            email,
            status: 'ВЫСТАВЛЕНО'
        });

        const newInvoice = await invoice.save();
        res.status(201).json(newInvoice);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const getInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find();
        res.json(invoices);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getInvoiceById = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id);
        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }
        res.status(200).json(invoice);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const deleteInvoiceById = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id);

        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        await invoice.remove();
        res.status(200).json({ message: 'Invoice deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    createInvoice,
    getInvoices,
    getInvoiceById,
    deleteInvoiceById
};
