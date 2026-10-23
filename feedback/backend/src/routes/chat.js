const router = require('express').Router();
const auth = require('../middleware/auth');
const { getMessages, getBatches, addBatch } = require('../controllers/chatController');

router.get('/messages', auth(['student', 'admin', 'higher_official', 'dean']), getMessages);
router.get('/batches', auth(['student', 'admin', 'higher_official', 'dean']), getBatches);
router.post('/batches', auth(['admin']), addBatch);

module.exports = router;
