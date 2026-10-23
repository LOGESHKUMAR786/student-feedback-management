const router = require('express').Router();
const auth = require('../middleware/auth');
const { getDepartmentReport, getFacultyPerformance, addRemark } = require('../controllers/deanController');

router.use(auth([]));
router.get('/department-report', getDepartmentReport);
router.get('/faculty-performance', getFacultyPerformance);
router.post('/remark', addRemark);

module.exports = router;
