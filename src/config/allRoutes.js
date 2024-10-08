const courseRoutes = require("../routes/courseRoutes");
const invoiceRoutes = require("../routes/invoiceRoutes");
const counterRoutes = require("../routes/counterRoutes");
const paymentRoutes = require("../routes/paymentRoutes");
const orderRoutes = require("../routes/orderRoutes");
const authRoutes = require("../routes/authRoutes");
const transactionRoutes = require("../routes/transRoutes");
const compareRoutes = require("../routes/compareRoutes");
const invoiceOrdersRoutes = require("../routes/invoiceOrdersRoutes")
const clickPrepRoutes = require("../routes/clickPrepRoutes")
const clickCompleteRoutes = require("../routes/clickCompleteRoute")

module.exports = {
  clickCompleteRoutes,
  clickPrepRoutes,
  invoiceOrdersRoutes,
  compareRoutes,
  courseRoutes,
  invoiceRoutes,
  counterRoutes,
  paymentRoutes,
  orderRoutes,
  authRoutes,
  transactionRoutes,
};
