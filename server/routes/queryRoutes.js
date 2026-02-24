const express = require('express');
const router = express.Router();
const queryController = require('../controllers/queryController');
const { validateQueryInput } = require('../middleware/securityMiddleware');

router.post('/translate', validateQueryInput, queryController.translateAndExecute);
router.post('/execute', validateQueryInput, queryController.executeRawQuery);
router.get('/collections', queryController.getCollections);
router.post('/vector-search', validateQueryInput, queryController.vectorSearch);
router.get('/stats', queryController.getStats);

module.exports = router;
