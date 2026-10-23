const router = require('express').Router();
const auth = require('../middleware/auth');
const {
  generateReport, getAllReports, getReportById, updateReportStatus,
  createAction, getAllActions, updateActionStatus, closeFeedbackCase, getAdmins
} = require('../controllers/reportController');

router.post('/generate', auth([]), generateReport);
router.get('/', auth([]), getAllReports);
router.get('/:id', auth([]), getReportById);
router.patch('/:id/status', auth([]), updateReportStatus);

router.post('/actions/create', auth([]), createAction);
router.get('/actions/all', auth([]), getAllActions);
router.patch('/actions/:id/status', auth([]), updateActionStatus);
router.post('/actions/close-case', auth([]), closeFeedbackCase);

router.get('/admins/list', auth([]), getAdmins);

module.exports = router;
