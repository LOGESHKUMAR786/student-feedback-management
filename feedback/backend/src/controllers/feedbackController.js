const pool = require('../config/db');
const { analyzeSentiment, generateSummary } = require('../models/aiService');

function parseKeywords(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  try { return JSON.parse(val); } catch { return val.split(',').map(k => k.trim()).filter(Boolean); }
}

const submitFeedback = async (req, res) => {
  const { course_id, cycle_id, rating, comment } = req.body;
  const student_id = req.user.profileId;
  try {
    const { sentiment, score, keywords } = analyzeSentiment(comment);
    await pool.query(
      `INSERT INTO feedback (student_id, course_id, cycle_id, rating, comment, sentiment, sentiment_score, keywords)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [student_id, course_id, cycle_id, rating, comment, sentiment, score, JSON.stringify(keywords)]
    );
    res.status(201).json({ message: 'Feedback submitted', sentiment, keywords });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: 'Feedback already submitted for this course' });
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const updateFeedback = async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;
  const student_id = req.user.profileId;
  try {
    const [rows] = await pool.query(
      `SELECT f.*, fc.end_date FROM feedback f JOIN feedback_cycles fc ON f.cycle_id = fc.id WHERE f.id = ? AND f.student_id = ?`,
      [id, student_id]
    );
    if (!rows.length) return res.status(404).json({ message: 'Feedback not found' });
    if (new Date() > new Date(rows[0].end_date)) return res.status(400).json({ message: 'Feedback cycle closed' });

    const { sentiment, score, keywords } = analyzeSentiment(comment);
    await pool.query(
      'UPDATE feedback SET rating=?, comment=?, sentiment=?, sentiment_score=?, keywords=? WHERE id=?',
      [rating, comment, sentiment, score, JSON.stringify(keywords), id]
    );
    res.json({ message: 'Feedback updated', sentiment, keywords });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getMyFeedback = async (req, res) => {
  const student_id = req.user.profileId;
  try {
    const [rows] = await pool.query(
      `SELECT f.*, c.course_name, c.course_code, fac.name as faculty_name, fc.title as cycle_title
       FROM feedback f
       JOIN courses c ON f.course_id = c.id
       JOIN faculty fac ON c.faculty_id = fac.id
       JOIN feedback_cycles fc ON f.cycle_id = fc.id
       WHERE f.student_id = ? ORDER BY f.submitted_at DESC`,
      [student_id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getAllFeedback = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT f.*, s.name as student_name, c.course_name, fac.name as faculty_name, fc.title as cycle_title
       FROM feedback f
       JOIN students s ON f.student_id = s.id
       JOIN courses c ON f.course_id = c.id
       JOIN faculty fac ON c.faculty_id = fac.id
       JOIN feedback_cycles fc ON f.cycle_id = fc.id
       ORDER BY f.submitted_at DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getAnalytics = async (req, res) => {
  try {
    const [courseStats] = await pool.query(
      `SELECT c.course_name, fac.name as faculty_name, 
       AVG(f.rating) as avg_rating, COUNT(f.id) as total_feedback,
       SUM(CASE WHEN f.sentiment='positive' THEN 1 ELSE 0 END) as positive,
       SUM(CASE WHEN f.sentiment='negative' THEN 1 ELSE 0 END) as negative,
       SUM(CASE WHEN f.sentiment='neutral' THEN 1 ELSE 0 END) as neutral
       FROM feedback f JOIN courses c ON f.course_id = c.id JOIN faculty fac ON c.faculty_id = fac.id
       GROUP BY c.id, c.course_name, fac.name`
    );

    const [monthlyTrend] = await pool.query(
      `SELECT DATE_FORMAT(submitted_at, '%Y-%m') as month, AVG(rating) as avg_rating, COUNT(*) as count
       FROM feedback GROUP BY month ORDER BY month DESC LIMIT 12`
    );

    const [deptStats] = await pool.query(
      `SELECT d.name as department, AVG(f.rating) as avg_rating, COUNT(f.id) as total
       FROM feedback f JOIN courses c ON f.course_id = c.id JOIN departments d ON c.department_id = d.id
       GROUP BY d.id, d.name`
    );

    const [allFeedback] = await pool.query('SELECT rating, sentiment, keywords FROM feedback');
    const summary = generateSummary(allFeedback.map(f => ({ ...f, keywords: parseKeywords(f.keywords) })));

    res.json({ courseStats, monthlyTrend, deptStats, summary });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { submitFeedback, updateFeedback, getMyFeedback, getAllFeedback, getAnalytics };
