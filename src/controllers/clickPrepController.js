const prepareService = require('../services/clickPrepService');
const Order = require('../models/orderModel');

exports.preparePayment = async (req, res) => {
    try {
        const { click_trans_id, service_id, merchant_trans_id, amount, action, sign_time, sign_string } = req.body;

        if (!click_trans_id || !service_id || !merchant_trans_id || !amount || !action || !sign_time || !sign_string) {
            return res.status(400).json({ error: -1, error_note: 'Missing required fields' });
        }

        const result = await prepareService.preparePayment({
            click_trans_id,
            service_id,
            merchant_trans_id,
            amount,
            action,
            sign_time,
            sign_string
        });

        if (result.error) {
            return res.status(400).json(result);
        }

        const newOrder = new Order({
            transactionId: click_trans_id,
            invoiceNumber: null, 
            create_time: Date.now(),
            perform_time: null,
            cancel_time: null,
            amount: amount,
            course_id: merchant_trans_id,
            status: 'ВЫСТАВЛЕНО',
            paymentType: 'Click'
        });

        console.log('New order to be saved:', newOrder);

        try {
            const savedOrder = await newOrder.save();
            console.log('Order saved successfully:', savedOrder);
            return res.status(200).json({ result, order: savedOrder });
        } catch (saveError) {
            console.error('Error saving new order:', saveError);
            return res.status(500).json({ error: -3, error_note: 'Failed to save order' });
        }

    } catch (error) {
        console.error('Error in preparePayment controller:', error);
        return res.status(500).json({ error: -3, error_note: 'Server error' });
    }
};
