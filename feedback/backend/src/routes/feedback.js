const router = require('express').Router();
const auth = require('../middleware/auth');
const { submitFeedback, updateFeedback, getMyFeedback, getAllFeedback, getAnalytics } = require('../controllers/feedbackController');

router.post('/', auth([]), submitFeedback);
router.put('/:id', auth([]), updateFeedback);
router.get('/my', auth([]), getMyFeedback);
router.get('/all', auth([]), getAllFeedback);
router.get('/analytics', auth([]), getAnalytics);

module.exports = router;
