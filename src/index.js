const express = require("express");
const connectDB = require("./config/database");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
const amocrmAuthRoutes = require("./routes/amocrmAuthRoutes")
const authMiddleware = require('./middlware/auth');
const uzumAuthMiddleware = require("./middlware/uzumAuthMiddleware");
const pdfGenerateRoute = require('./routes/pdfGenerateRoute');
const {
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
  uzumBankRoutes,
} = require("./config/allRoutes");

dotenv.config();

const subdomain = process.env.AMOCRM_SUBDOMAIN;

connectDB();

const app = express();

app.use(
  cors({
    origin: [
      "https://billing.norbekovgroup.uz",
      "https://markaz.norbekovgroup.uz",
      "https://forum.norbekovgroup.uz",
      "http://174.138.43.233:3000",
      "http://174.138.43.233:3001",
      "https://test.paycom.uz",
      "http://localhost:3000",
      "http://localhost:3001",
      "https://norbekovgroup.vercel.app", 
    ],
    methods: "GET, POST, PUT, DELETE, PATCH",
    allowedHeaders: "Content-Type, Authorization",
    credentials: true,
  })
);

app.use(bodyParser.json());

app.use("/", paymentRoutes);
app.use("/api/v1/uzum-bank", uzumAuthMiddleware, uzumBankRoutes);
app.use("/api/v1", courseRoutes);
app.use("/api/v1", invoiceRoutes);
app.use("/api/v1", orderRoutes);
app.use("/api/v1/counter", counterRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/v1/compare", compareRoutes);
app.use("/api/v1", invoiceOrdersRoutes);
app.use("/api/v1/click", clickPrepRoutes);
app.use("/api/v1/click", clickCompleteRoutes);
app.use("/api/v1", pdfGenerateRoute);
app.use("/api/v1", amocrmAuthRoutes)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
