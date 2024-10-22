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

// Load Environment Variables
dotenv.config();

const accessToken = process.env.AMOCRM_ACCESS_TOKEN;
const subdomain = process.env.AMOCRM_SUBDOMAIN;

// Connect to MongoDB
connectDB();

// Initialize Express App
const app = express();

// Set Up CORS
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

// Use Body Parser Middleware to Parse JSON Requests
app.use(bodyParser.json());

// Routes Middleware
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

// Create Lead in amoCRM Route
app.post('/create-lead', async (req, res) => {
  try {
    // Log the incoming request body for debugging
    console.log("Received Request Body:", req.body);

    const { name, price, phone, courseTitle, paymentType, transactionId, statusId } = req.body;

    // Check if any required fields are missing
    if (!name || !price || !phone || !courseTitle || !paymentType || !transactionId || !statusId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Use the correct field IDs fetched from amoCRM
    const phoneFieldId = '1234567'; // Replace with actual phone field ID
    const courseTitleFieldId = '2345678'; // Replace with actual course field ID
    const paymentTypeFieldId = '3456789'; // Replace with actual payment type field ID
    const transactionIdFieldId = '4567890'; // Replace with actual transaction ID field ID

    // Construct the payload to send to amoCRM
    const payload = [
      {
        name: name, // Scalar (single) value
        price: price, // Scalar (single) integer value
        status_id: statusId, // Scalar (single) integer value
        custom_fields_values: [
          {
            field_id: phoneFieldId,
            values: [{ value: phone }]
          },
          {
            field_id: courseTitleFieldId,
            values: [{ value: courseTitle }]
          },
          {
            field_id: paymentTypeFieldId,
            values: [{ value: paymentType }]
          },
          {
            field_id: transactionIdFieldId,
            values: [{ value: transactionId }]
          }
        ]
      }
    ];

    // Log the payload to check the data before sending to amoCRM
    console.log("Payload being sent to amoCRM:", JSON.stringify(payload, null, 2));

    // Send the request to amoCRM to create a lead
    const response = await axios.post(
      `https://${subdomain}.amocrm.ru/api/v4/leads`,
      payload,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        }
      }
    );

    // Respond with success if the lead was created
    res.status(201).json({
      message: 'Lead created successfully',
      lead: response.data
    });
  } catch (error) {
    // Log and respond with an error message
    console.error('Error creating lead in amoCRM:', error.response ? error.response.data : error.message);
    res.status(500).json({
      message: 'Error creating lead in amoCRM',
      error: error.response ? error.response.data : error.message
    });
  }
});

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
