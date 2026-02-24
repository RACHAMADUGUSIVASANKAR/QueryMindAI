const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbotController');

router.post('/message', chatbotController.handleMessage);
router.get('/history', chatbotController.getHistory);

module.exports = router;
