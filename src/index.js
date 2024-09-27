const express = require('express');
const connectDB = require('./database/config');
const dotenv = require('dotenv');
const cors = require('cors');
const courseRoutes = require('./routes/courseRoutes')
const invoiceRoutes = require('./routes/invoiceRoutes')
const counterRoutes = require('./routes/counterRoutes');
const checkCourseRoutes = require('./routes/checkCourseRoutes')
dotenv.config();

connectDB();

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use('/api/v1', courseRoutes)
app.use('/api/v1', invoiceRoutes)
app.use('/api/v1/counter', counterRoutes)
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/transactions', require('./routes/transRoutes'));
app.use('/api/courses', checkCourseRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
