const pool = require('../config/db');
const bcrypt = require('bcryptjs');

// Students
const getStudents = async (req, res) => {
  const [rows] = await pool.query(
    `SELECT s.*, u.email, u.username, d.name as department FROM students s
     JOIN users u ON s.user_id = u.id LEFT JOIN departments d ON s.department_id = d.id`
  );
  res.json(rows);
};

const deleteStudent = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT user_id FROM students WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Student not found' });
    await pool.query('DELETE FROM feedback WHERE student_id = ?', [req.params.id]);
    await pool.query('DELETE FROM student_courses WHERE student_id = ?', [req.params.id]);
    await pool.query('DELETE FROM users WHERE id = ?', [rows[0].user_id]);
    res.json({ message: 'Student deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Faculty
const getFaculty = async (req, res) => {
  const [rows] = await pool.query(
    `SELECT f.*, d.name as department FROM faculty f LEFT JOIN departments d ON f.department_id = d.id`
  );
  res.json(rows);
};

const addFaculty = async (req, res) => {
  const { name, email, department_id } = req.body;
  await pool.query('INSERT INTO faculty (name, email, department_id) VALUES (?, ?, ?)', [name, email, department_id]);
  res.status(201).json({ message: 'Faculty added' });
};

const updateFaculty = async (req, res) => {
  const { name, email, department_id } = req.body;
  await pool.query('UPDATE faculty SET name=?, email=?, department_id=? WHERE id=?', [name, email, department_id, req.params.id]);
  res.json({ message: 'Faculty updated' });
};

const deleteFaculty = async (req, res) => {
  try {
    await pool.query('UPDATE courses SET faculty_id = NULL WHERE faculty_id = ?', [req.params.id]);
    await pool.query('DELETE FROM faculty WHERE id = ?', [req.params.id]);
    res.json({ message: 'Faculty deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Courses
const getCourses = async (req, res) => {
  const [rows] = await pool.query(
    `SELECT c.*, f.name as faculty_name, d.name as department FROM courses c
     LEFT JOIN faculty f ON c.faculty_id = f.id LEFT JOIN departments d ON c.department_id = d.id`
  );
  res.json(rows);
};

const addCourse = async (req, res) => {
  const { course_name, course_code, faculty_id, department_id } = req.body;
  await pool.query('INSERT INTO courses (course_name, course_code, faculty_id, department_id) VALUES (?, ?, ?, ?)',
    [course_name, course_code, faculty_id, department_id]);
  res.status(201).json({ message: 'Course added' });
};

const updateCourse = async (req, res) => {
  const { course_name, course_code, faculty_id, department_id } = req.body;
  await pool.query('UPDATE courses SET course_name=?, course_code=?, faculty_id=?, department_id=? WHERE id=?',
    [course_name, course_code, faculty_id, department_id, req.params.id]);
  res.json({ message: 'Course updated' });
};

const deleteCourse = async (req, res) => {
  try {
    await pool.query('DELETE FROM feedback WHERE course_id = ?', [req.params.id]);
    await pool.query('DELETE FROM student_courses WHERE course_id = ?', [req.params.id]);
    await pool.query('DELETE FROM courses WHERE id = ?', [req.params.id]);
    res.json({ message: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Assign course to student
const assignCourse = async (req, res) => {
  const { student_id, course_id } = req.body;
  try {
    await pool.query('INSERT INTO student_courses (student_id, course_id) VALUES (?, ?)', [student_id, course_id]);
    res.json({ message: 'Course assigned' });
  } catch {
    res.status(400).json({ message: 'Already assigned' });
  }
};

// Feedback Cycles
const getCycles = async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM feedback_cycles ORDER BY created_at DESC');
  res.json(rows);
};

const addCycle = async (req, res) => {
  const { title, start_date, end_date } = req.body;
  await pool.query('INSERT INTO feedback_cycles (title, start_date, end_date) VALUES (?, ?, ?)', [title, start_date, end_date]);
  res.status(201).json({ message: 'Cycle created' });
};

const toggleCycle = async (req, res) => {
  const [rows] = await pool.query('SELECT status FROM feedback_cycles WHERE id = ?', [req.params.id]);
  if (!rows.length) return res.status(404).json({ message: 'Cycle not found' });
  const newStatus = rows[0].status === 'open' ? 'closed' : 'open';
  await pool.query('UPDATE feedback_cycles SET status = ? WHERE id = ?', [newStatus, req.params.id]);
  res.json({ message: `Cycle ${newStatus}` });
};

const deleteCycle = async (req, res) => {
  try {
    await pool.query('DELETE FROM feedback WHERE cycle_id = ?', [req.params.id]);
    await pool.query('DELETE FROM feedback_cycles WHERE id = ?', [req.params.id]);
    res.json({ message: 'Cycle deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Departments
const getDepartments = async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM departments');
  res.json(rows);
};

module.exports = {
  getStudents, deleteStudent,
  getFaculty, addFaculty, updateFaculty, deleteFaculty,
  getCourses, addCourse, updateCourse, deleteCourse, assignCourse,
  getCycles, addCycle, toggleCycle, deleteCycle,
  getDepartments
};
