const aiService = require('../services/aiService');

exports.handleMessage = async (req, res, next) => {
    try {
        const { message, history } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const reply = await aiService.chat(message, history || []);

        res.json({
            reply: reply.response || reply.message || reply,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        // Fallback responses
        const fallbackReplies = [
            "I can help you with MongoDB queries! Try asking something like 'Find all users older than 25'.",
            "I'm here to help with database operations. You can ask me about collections, queries, or MongoDB concepts.",
            "To get started, try typing a natural language query in the query panel. I'll translate it to MongoDB for you!",
        ];

        res.json({
            reply: fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)],
            timestamp: new Date().toISOString(),
        });
    }
};

exports.getHistory = async (req, res) => {
    res.json({ history: [] });
};
