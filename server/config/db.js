const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/querymindDB');
        console.log(`✓ MongoDB Connected: ${conn.connection.host}`);

        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('MongoDB disconnected. Attempting reconnect...');
        });

        return conn;
    } catch (error) {
        console.error(`MongoDB connection failed: ${error.message}`);
        // Don't exit in development - allow server to run without DB
        if (process.env.NODE_ENV === 'production') {
            process.exit(1);
        }
        console.warn('Running without database connection in development mode');
    }
};

module.exports = connectDB;
