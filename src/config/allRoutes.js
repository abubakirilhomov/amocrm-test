const courseRoutes = require("../routes/courseRoutes");
const invoiceRoutes = require("../routes/invoiceRoutes");
const counterRoutes = require("../routes/counterRoutes");
const checkPersormRoute = require("../routes/checkPerformRoute");
const performTransaction = require("../routes/performTransaction");
const paymentRoutes = require("../routes/paymentRoutes");
const orderRoutes = require("../routes/orderRoutes");
const authRoutes = require("../routes/authRoutes");
const transactionRoutes = require("../routes/transRoutes");

module.exports = {
  courseRoutes,
  invoiceRoutes,
  counterRoutes,
  checkPersormRoute,
  performTransaction,
  paymentRoutes,
  orderRoutes,
  authRoutes,
  transactionRoutes,
};
