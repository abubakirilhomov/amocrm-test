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

const corsOptions = {
  origin: ['http://localhost:3000', 'https://your-production-domain.com'], // Allow these origins only
  methods: 'GET,POST,PUT,DELETE', // Specify allowed HTTP methods
  allowedHeaders: 'Content-Type,Authorization', // Specify allowed headers
  credentials: true,  // If you want to allow cookies and credentials
};

dotenv.config();

connectDB();

const app = express();
app.use(cors(corsOptions));
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
