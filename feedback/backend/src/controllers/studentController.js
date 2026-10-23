const pool = require('../config/db');

const getMyCourses = async (req, res) => {
  const student_id = req.user.profileId;
  try {
    const [rows] = await pool.query(
      `SELECT c.*, f.name as faculty_name, d.name as department
       FROM student_courses sc
       JOIN courses c ON sc.course_id = c.id
       LEFT JOIN faculty f ON c.faculty_id = f.id
       LEFT JOIN departments d ON c.department_id = d.id
       WHERE sc.student_id = ?`,
      [student_id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getActiveCycles = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM feedback_cycles WHERE status = 'open' AND end_date >= CURDATE()"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT s.*, u.email, u.username, d.name as department
       FROM students s JOIN users u ON s.user_id = u.id
       LEFT JOIN departments d ON s.department_id = d.id
       WHERE s.id = ?`,
      [req.user.profileId]
    );
    res.json(rows[0] || {});
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getMyCourses, getActiveCycles, getProfile };
