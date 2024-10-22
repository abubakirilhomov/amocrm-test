const Order = require("../models/orderModel");
const { createNewLead } = require("../services/amoCRMService");

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("course_id")
    res.status(200).json({ data: orders });
  } catch (error) {
    console.error("Error getting orders:", error);
    res.status(500).json({ message: "Error getting orders", error: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId).populate("course_id")
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
      create_time,  // This will be an ISO string
      state,
      amount,
      course_id,
      user_id,
      clientName,
      clientPhone,
      clientAddress,
      invoiceNumber,
      status,
      passport,
      tgUsername,
      courseTitle,
      prefix
    } = req.body;

    // Convert ISO string to Unix timestamp (in seconds)
    const createTimeUnix = new Date(create_time).getTime() / 1000;

    const newOrder = new Order({
      transactionId,
      invoiceNumber,
      create_time: createTimeUnix,  // Use the converted Unix timestamp
      perform_time: null,
      cancel_time: null,
      state,
      amount,
      course_id,
      user_id,
      clientName,
      clientPhone,
      clientAddress,
      passport,
      tgUsername,
      prefix,
      courseTitle,
      reason: null,
      status: status || 'НЕ ОПЛАЧЕНО'
    });

    await newOrder.save();

    // If status is "ОПЛАЧЕНО", create a new lead in amoCRM
    if (newOrder.status === 'ОПЛАЧЕНО') {
      const leadData = {
        name: clientName,
        phone: clientPhone,
        courseTitle: courseTitle,
        amount: amount,
        statusId: 70986170,  // Replace with your actual status ID
        paymentType: state,  // Assuming 'state' represents payment type
        transactionId: transactionId
      };

      try {
        const newLead = await createNewLead(leadData);
        console.log('New lead created in amoCRM:', newLead);
      } catch (amoCrmError) {
        console.error('Error creating lead in amoCRM:', amoCrmError.response ? amoCrmError.response.data : amoCrmError.message);
        return res.status(500).json({ message: 'Order created, but failed to create lead in amoCRM', error: amoCrmError.message });
      }
    }

    res.status(201).json({ message: "Order created and synced to amoCRM", data: newOrder });
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
