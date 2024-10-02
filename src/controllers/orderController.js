
const Order = require("../models/orderModel");

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("course_id")
      .populate("user_id");
    res.status(200).json({ data: orders });
  } catch (error) {
    console.error("Error getting orders:", error);
    res.status(500).json({ message: "Error getting orders", error: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId)
      .populate("course_id")
      .populate("user_id");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ data: order });
  } catch (error) {
    console.error("Error getting order:", error);
    res.status(500).json({ message: "Error getting order", error: error.message });
  }
};

const createOrder = async (req, res) => {
  try {
    const {
      transactionId,
      create_time,
      state,
      amount,
      course_id,
      user_id,
      clientName,
      clientPhone,
      clientAddress,
      invoiceNumber,
      status
    } = req.body;

    if (!transactionId || !create_time || !state || !amount || !course_id || !user_id) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    const newOrder = new Order({
      transactionId,
      invoiceNumber,
      create_time,
      perform_time: null,
      cancel_time: null,
      state,
      amount,
      course_id,
      user_id,
      clientName,
      clientPhone,
      clientAddress,
      reason: null,
      status: status || 'НЕ ОПЛАЧЕНО'
    });

    await newOrder.save();

    res.status(201).json({ message: "Order created", data: newOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
};

const deleteOrder = async (req, res) => {
};

module.exports = {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder
};
