const router = require('express').Router();
const auth = require('../middleware/auth');
const { getMyCourses, getActiveCycles, getProfile } = require('../controllers/studentController');

router.use(auth([]));
router.get('/courses', getMyCourses);
router.get('/cycles', getActiveCycles);
router.get('/profile', getProfile);

module.exports = router;
