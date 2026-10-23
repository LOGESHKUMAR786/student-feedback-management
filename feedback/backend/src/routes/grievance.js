const router = require('express').Router();
const auth = require('../middleware/auth');
const { submitGrievance, getMyGrievances, getAllGrievances, updateGrievanceStatus, addDeanAction, deleteGrievance } = require('../controllers/grievanceController');

router.post('/', auth([]), submitGrievance);
router.get('/my', auth([]), getMyGrievances);
router.get('/all', auth([]), getAllGrievances);
router.patch('/:id/status', auth([]), updateGrievanceStatus);
router.patch('/:id/dean-action', auth([]), addDeanAction);
router.delete('/:id', auth([]), deleteGrievance);

module.exports = router;
