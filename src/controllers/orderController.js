const Order = require("../models/orderModel");

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("course_id").populate("user_id");
    res.status(200).json({ data: orders });
  } catch (error) {
    res.status(500).json({ message: "Error getting orders" });
  }
};

const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId).populate("course_id").populate("user_id");
    res.status(200).json({ data: order });
  } catch (error) {
    res.status(500).json({ message: "Error getting orders" });
  }
};

const createOrder = async (req, res) => {
  try {
    const { course_id, user_id } = req.body;

    if (!course_id || !user_id) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newOrder = await Order.create({
      course_id: course_id,
      user_id: user_id,
    });

    res.status(201).json({ message: "Order created", data: newOrder });
  } catch (error) {
    res.status(400).json({ message: "Invalid data" });
    console.log(error);
  }
};

module.exports = { getOrders, getOrderById, createOrder };
