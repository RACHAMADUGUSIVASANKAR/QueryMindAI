const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const connectDB = require('./config/db');
const queryRoutes = require('./routes/queryRoutes');
const chatbotRoutes = require('./routes/chatbotRoutes');
const errorHandler = require('./middleware/errorHandler');

require('dotenv').config();

const app = express();

// Security
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// Parsing
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}

// Routes
app.use('/api/query', queryRoutes);
app.use('/api/chatbot', chatbotRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString(), service: 'querymind-backend' });
});

// Error handling
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`✓ QueryMind Server running on port ${PORT}`);
        console.log(`✓ API available at http://localhost:${PORT}/api`);
    });
};

startServer().catch(err => {
    console.error('Failed to start server:', err.message);
    process.exit(1);
});

module.exports = app;
