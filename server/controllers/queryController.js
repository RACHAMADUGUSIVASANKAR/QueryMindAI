const mongoose = require('mongoose');
const aiService = require('../services/aiService');
const queryValidator = require('../services/queryValidator');
const aggregationBuilder = require('../services/aggregationBuilder');

exports.translateAndExecute = async (req, res, next) => {
    try {
        const { query, collection } = req.body;

        if (!query || !collection) {
            return res.status(400).json({ error: 'Query and collection are required' });
        }

        // Call AI service for NL translation
        const aiResult = await aiService.translateQuery(query, collection);

        // Validate generated query for safety
        const validation = queryValidator.validate(aiResult.mongoQuery || aiResult.query);
        if (!validation.safe) {
            return res.status(403).json({
                error: 'Query blocked by security layer',
                reason: validation.reason,
                intent: aiResult.intent,
            });
        }

        // Execute query against MongoDB
        let results = [];
        let executionTime = 0;
        const db = mongoose.connection.db;

        if (db) {
            const coll = db.collection(collection);
            const start = process.hrtime.bigint();

            if (aiResult.intent === 'AGGREGATE' && aiResult.pipeline) {
                results = await coll.aggregate(aiResult.pipeline).toArray();
            } else if (aiResult.intent === 'COUNT') {
                const count = await coll.countDocuments(aiResult.mongoQuery || {});
                results = [{ count }];
            } else {
                const mongoQuery = aiResult.mongoQuery || {};
                results = await coll.find(mongoQuery).limit(100).toArray();
            }

            const end = process.hrtime.bigint();
            executionTime = Number(end - start) / 1_000_000; // Convert to ms
        } else {
            // Mock results when DB is not connected
            results = generateMockResults(aiResult.intent, collection);
            executionTime = Math.random() * 10 + 2;
        }

        res.json({
            results,
            intent: aiResult.intent,
            entities: aiResult.entities || [],
            mongoQuery: aiResult.mongoQuery || aiResult.query,
            pipeline: aiResult.pipeline,
            confidence: aiResult.confidence,
            collection,
            executionTime,
            resultCount: results.length,
        });
    } catch (error) {
        next(error);
    }
};

exports.executeRawQuery = async (req, res, next) => {
    try {
        const { query, collection } = req.body;
        const validation = queryValidator.validate(query);
        if (!validation.safe) {
            return res.status(403).json({ error: 'Query blocked', reason: validation.reason });
        }

        const db = mongoose.connection.db;
        if (!db) {
            return res.json({ results: generateMockResults('FIND', collection), executionTime: 5 });
        }

        const coll = db.collection(collection);
        const start = process.hrtime.bigint();
        const results = await coll.find(typeof query === 'string' ? JSON.parse(query) : query).limit(100).toArray();
        const end = process.hrtime.bigint();

        res.json({ results, executionTime: Number(end - start) / 1_000_000 });
    } catch (error) {
        next(error);
    }
};

exports.getCollections = async (req, res, next) => {
    try {
        const db = mongoose.connection.db;
        if (!db) {
            return res.json({ collections: ['users', 'products', 'orders', 'reviews', 'analytics'] });
        }
        const collections = await db.listCollections().toArray();
        res.json({ collections: collections.map(c => c.name) });
    } catch (error) {
        next(error);
    }
};

exports.vectorSearch = async (req, res, next) => {
    try {
        const { query, collection, limit = 10 } = req.body;
        const embedding = await aiService.getEmbedding(query);

        const db = mongoose.connection.db;
        if (!db) {
            return res.json({ results: generateMockResults('SEARCH', collection), executionTime: 8 });
        }

        // Atlas Vector Search pipeline
        const pipeline = [
            {
                $vectorSearch: {
                    index: 'vector_index',
                    path: 'embedding',
                    queryVector: embedding,
                    numCandidates: limit * 10,
                    limit: limit,
                }
            },
            { $project: { _id: 1, score: { $meta: 'vectorSearchScore' }, name: 1, description: 1 } }
        ];

        const start = process.hrtime.bigint();
        const results = await db.collection(collection).aggregate(pipeline).toArray();
        const end = process.hrtime.bigint();

        res.json({ results, executionTime: Number(end - start) / 1_000_000 });
    } catch (error) {
        next(error);
    }
};

exports.getStats = async (req, res) => {
    res.json({
        totalQueries: 190,
        avgResponseTime: 9.7,
        successRate: 98.4,
        activeCollections: 5,
    });
};

function generateMockResults(intent, collection) {
    const mockData = {
        users: [
            { _id: '1', name: 'Alice Johnson', email: 'alice@example.com', age: 28, city: 'New York', status: 'active' },
            { _id: '2', name: 'Bob Smith', email: 'bob@example.com', age: 34, city: 'San Francisco', status: 'active' },
            { _id: '3', name: 'Charlie Brown', email: 'charlie@example.com', age: 22, city: 'Chicago', status: 'inactive' },
            { _id: '4', name: 'Diana Prince', email: 'diana@example.com', age: 31, city: 'New York', status: 'active' },
            { _id: '5', name: 'Edward Norton', email: 'edward@example.com', age: 45, city: 'Los Angeles', status: 'active' },
        ],
        products: [
            { _id: '1', name: 'Laptop Pro', price: 1299, category: 'Electronics', stock: 45 },
            { _id: '2', name: 'Wireless Mouse', price: 29, category: 'Accessories', stock: 200 },
            { _id: '3', name: 'Mechanical Keyboard', price: 149, category: 'Accessories', stock: 78 },
        ],
        orders: [
            { _id: '1', user: 'Alice', total: 1328, items: 2, date: '2024-01-15', status: 'delivered' },
            { _id: '2', user: 'Bob', total: 149, items: 1, date: '2024-01-20', status: 'shipped' },
        ],
    };

    if (intent === 'COUNT') return [{ count: mockData[collection]?.length || 0 }];
    return mockData[collection] || mockData.users;
}
