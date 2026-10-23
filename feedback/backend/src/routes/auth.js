const router = require('express').Router();
const { register, login } = require('../controllers/authController');
const { getDepartments } = require('../controllers/adminController');
router.post('/register', register);
router.post('/login', login);
router.get('/departments', getDepartments);
module.exports = router;
