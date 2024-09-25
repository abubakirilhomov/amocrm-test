const express = require('express');
const connectDB = require('./database/config');
const dotenv = require('dotenv');
const cors = require('cors');
const courseRoutes = require('./routes/courseRoutes')
const invoiceRoutes = require('./routes/invoiceRoutes')
const counterRoutes = require('./routes/counterRoutes');
const startInvoiceCronJob = require('./cron/invoiceCron');

dotenv.config();

connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/v1', courseRoutes)
app.use('/api/v1', invoiceRoutes)
app.use('/api/v1/counter', counterRoutes)

startInvoiceCronJob();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
