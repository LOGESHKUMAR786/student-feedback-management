const router = require('express').Router();
const auth = require('../middleware/auth');
const {
  getStudents, deleteStudent,
  getFaculty, addFaculty, updateFaculty, deleteFaculty,
  getCourses, addCourse, updateCourse, deleteCourse, assignCourse,
  getCycles, addCycle, toggleCycle, deleteCycle, getDepartments
} = require('../controllers/adminController');

router.use(auth([]));

router.get('/students', getStudents);
router.delete('/students/:id', deleteStudent);

router.get('/faculty', getFaculty);
router.post('/faculty', addFaculty);
router.put('/faculty/:id', updateFaculty);
router.delete('/faculty/:id', deleteFaculty);

router.get('/courses', getCourses);
router.post('/courses', addCourse);
router.put('/courses/:id', updateCourse);
router.delete('/courses/:id', deleteCourse);
router.post('/courses/assign', assignCourse);

router.get('/cycles', getCycles);
router.post('/cycles', addCycle);
router.patch('/cycles/:id/toggle', toggleCycle);
router.delete('/cycles/:id', deleteCycle);

router.get('/departments', getDepartments);

module.exports = router;
