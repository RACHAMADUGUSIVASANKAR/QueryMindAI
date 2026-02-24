const queryValidator = require('../services/queryValidator');

exports.validateQueryInput = (req, res, next) => {
    const { query, collection, message } = req.body;
    const input = query || message;

    if (input) {
        // Sanitize string inputs
        if (typeof input === 'string') {
            req.body.query = queryValidator.sanitizeInput(input);
            req.body.message = queryValidator.sanitizeInput(input);
        }

        // Check for destructive patterns in natural language
        if (typeof input === 'string') {
            const dangerousPatterns = [
                /\bdrop\s+(the\s+)?(database|collection|table|index)/i,
                /\bdelete\s+(all|every|everything)\b/i,
                /\bdestroy\b/i,
                /\btruncate\b/i,
                /\bremove\s+(all|every)\b/i,
                /\bwipe\b/i,
            ];

            for (const pattern of dangerousPatterns) {
                if (pattern.test(input)) {
                    return res.status(403).json({
                        error: 'Destructive operation blocked',
                        message: 'This query appears to contain a destructive operation and has been blocked by the security layer.',
                        suggestion: 'If you need to perform data modifications, please contact your database administrator.',
                    });
                }
            }
        }
    }

    // Validate collection name
    if (collection) {
        const validCollection = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
        if (!validCollection.test(collection)) {
            return res.status(400).json({ error: 'Invalid collection name' });
        }
    }

    next();
};

exports.checkRole = (requiredRole) => {
    return (req, res, next) => {
        const userRole = req.headers['x-user-role'] || 'viewer';
        const roleHierarchy = { admin: 3, analyst: 2, viewer: 1 };

        if ((roleHierarchy[userRole] || 0) >= (roleHierarchy[requiredRole] || 0)) {
            next();
        } else {
            res.status(403).json({ error: 'Insufficient permissions', requiredRole });
        }
    };
};
