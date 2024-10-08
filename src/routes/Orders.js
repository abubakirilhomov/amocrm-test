const express = require('express');
const Order = require('../models/orderModel');
const router = express.Router();

router.get('/orders', async (req, res) => {
    try {
        const orders = await Order.find().populate('course_id');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при получении заказов' });
    }
});

module.exports = router;