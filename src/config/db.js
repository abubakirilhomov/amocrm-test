const mongoose = require('mongoose');
require('dotenv').config()

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://2ilhomovabubakir2:abubakir@paymentdashboard.rrwaw.mongodb.net/?retryWrites=true&w=majority&appName=paymentDashboard")
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;