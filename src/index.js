const express = require("express");
const connectDB = require("./config/database");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const {
  invoiceOrdersRoutes,
  compareRoutes,
  courseRoutes,
  invoiceRoutes,
  counterRoutes,
  paymentRoutes,
  orderRoutes,
  authRoutes,
  transactionRoutes
} = require("./config/allRoutes");

dotenv.config();

connectDB();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/", paymentRoutes);
app.use("/api/v1", courseRoutes);
app.use("/api/v1", invoiceRoutes);
app.use("/api/v1", orderRoutes);
app.use("/api/v1/counter", counterRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/v1/compare", compareRoutes);
app.use("/api/v1", invoiceOrdersRoutes)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
