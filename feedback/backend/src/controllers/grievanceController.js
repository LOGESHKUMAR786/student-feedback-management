const pool = require('../config/db');

const submitGrievance = async (req, res) => {
  const { title, category, description } = req.body;
  const student_id = req.user.profileId;
  try {
    await pool.query(
      'INSERT INTO grievances (student_id, title, category, description) VALUES (?, ?, ?, ?)',
      [student_id, title, category || 'other', description]
    );
    res.status(201).json({ message: 'Grievance submitted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getMyGrievances = async (req, res) => {
  const student_id = req.user.profileId;
  try {
    const [rows] = await pool.query(
      'SELECT * FROM grievances WHERE student_id = ? ORDER BY submitted_at DESC',
      [student_id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getAllGrievances = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT g.*, s.name as student_name, s.roll_number, d.name as department
       FROM grievances g
       JOIN students s ON g.student_id = s.id
       LEFT JOIN departments d ON s.department_id = d.id
       ORDER BY g.submitted_at DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const updateGrievanceStatus = async (req, res) => {
  const { status, admin_response } = req.body;
  try {
    await pool.query(
      'UPDATE grievances SET status = ?, admin_response = ? WHERE id = ?',
      [status, admin_response || null, req.params.id]
    );
    res.json({ message: 'Grievance updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const deleteGrievance = async (req, res) => {
  try {
    await pool.query('DELETE FROM grievances WHERE id = ?', [req.params.id]);
    res.json({ message: 'Grievance deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const addDeanAction = async (req, res) => {
  const { dean_action } = req.body;
  try {
    await pool.query('UPDATE grievances SET dean_action = ?, status = "resolved" WHERE id = ?', [dean_action, req.params.id]);
    res.json({ message: 'Dean action saved' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { submitGrievance, getMyGrievances, getAllGrievances, updateGrievanceStatus, addDeanAction, deleteGrievance };
