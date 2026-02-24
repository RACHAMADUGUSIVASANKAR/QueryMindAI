function errorHandler(err, req, res, next) {
    console.error('Error:', err.message);

    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: 'Validation Error',
            message: err.message,
            details: Object.values(err.errors || {}).map(e => e.message),
        });
    }

    if (err.name === 'MongoServerError' && err.code === 11000) {
        return res.status(409).json({
            error: 'Duplicate Key Error',
            message: 'A record with that value already exists.',
        });
    }

    if (err.name === 'CastError') {
        return res.status(400).json({
            error: 'Invalid ID',
            message: 'The provided ID is not valid.',
        });
    }

    if (err.status === 429) {
        return res.status(429).json({
            error: 'Rate Limit Exceeded',
            message: 'Too many requests. Please try again later.',
        });
    }

    res.status(err.status || 500).json({
        error: err.status === 500 ? 'Internal Server Error' : err.message,
        message: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred.',
    });
}

module.exports = errorHandler;
