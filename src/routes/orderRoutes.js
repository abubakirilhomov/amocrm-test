const express = require("express");
const router = express.Router();
const {
  getOrders,
  getOrderById,
  createOrder,
} = require("../controllers/orderController");

router.get("/orders", getOrders);
router.get("/orders/:id", getOrderById);
router.post("/orders/create", createOrder);

module.exports = router;
