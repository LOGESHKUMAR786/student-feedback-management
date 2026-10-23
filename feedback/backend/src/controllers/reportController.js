const pool = require('../config/db');
const { generateSummary, analyzeSentiment } = require('../models/aiService');

// ── REPORTS ──────────────────────────────────────────────

function parseKeywords(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  try { return JSON.parse(val); } catch { return val.split(',').map(k => k.trim()).filter(Boolean); }
}
const generateReport = async (req, res) => {
  const { course_id, title } = req.body;
  const admin_id = req.user.id;
  try {
    const where = course_id ? 'WHERE f.course_id = ?' : '';
    const params = course_id ? [course_id] : [];

    const [feedbacks] = await pool.query(
      `SELECT f.rating, f.sentiment, f.keywords, f.comment,
              c.course_name, fac.name as faculty_name
       FROM feedback f
       JOIN courses c ON f.course_id = c.id
       JOIN faculty fac ON c.faculty_id = fac.id
       ${where} ORDER BY f.submitted_at DESC`,
      params
    );

    if (!feedbacks.length) return res.status(400).json({ message: 'No feedback found to generate report' });

    const total = feedbacks.length;
    const avgRating = (feedbacks.reduce((s, f) => s + f.rating, 0) / total).toFixed(2);
    const positive = feedbacks.filter(f => f.sentiment === 'positive').length;
    const negative = feedbacks.filter(f => f.sentiment === 'negative').length;
    const neutral = feedbacks.filter(f => f.sentiment === 'neutral').length;

    const parsed = feedbacks.map(f => ({ ...f, keywords: parseKeywords(f.keywords) }));
    const summary = generateSummary(parsed);

    const [result] = await pool.query(
      `INSERT INTO reports (title, course_id, generated_by, total_feedback, avg_rating, positive_count, negative_count, neutral_count, summary, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [title || `Report - ${new Date().toLocaleDateString()}`, course_id || null, admin_id, total, avgRating, positive, negative, neutral, summary]
    );

    res.status(201).json({ message: 'Report generated', reportId: result.insertId, summary, avgRating, total, positive, negative, neutral });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getAllReports = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT r.*, c.course_name, u.username as generated_by_name
       FROM reports r
       LEFT JOIN courses c ON r.course_id = c.id
       LEFT JOIN users u ON r.generated_by = u.id
       ORDER BY r.created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getReportById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT r.*, c.course_name, u.username as generated_by_name
       FROM reports r
       LEFT JOIN courses c ON r.course_id = c.id
       LEFT JOIN users u ON r.generated_by = u.id
       WHERE r.id = ?`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ message: 'Report not found' });

    const [feedbacks] = await pool.query(
      `SELECT f.*, s.name as student_name, c.course_name
       FROM feedback f
       JOIN students s ON f.student_id = s.id
       JOIN courses c ON f.course_id = c.id
       WHERE (? IS NULL OR f.course_id = ?)
       ORDER BY f.submitted_at DESC`,
      [rows[0].course_id, rows[0].course_id]
    );

    res.json({ report: rows[0], feedbacks });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const updateReportStatus = async (req, res) => {
  const { status } = req.body;
  try {
    await pool.query('UPDATE reports SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: 'Report status updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ── ACTIONS ──────────────────────────────────────────────

const createAction = async (req, res) => {
  const { report_id, assigned_to, action_description, priority } = req.body;
  const assigned_by = req.user.id;
  try {
    await pool.query(
      `INSERT INTO actions (report_id, assigned_by, assigned_to, action_description, priority, status)
       VALUES (?, ?, ?, ?, ?, 'pending')`,
      [report_id, assigned_by, assigned_to || null, action_description, priority || 'medium']
    );
    await pool.query("UPDATE reports SET status = 'action_taken' WHERE id = ?", [report_id]);
    res.status(201).json({ message: 'Action assigned successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getAllActions = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT a.*, r.title as report_title,
              u1.username as assigned_by_name, u1.full_name as assigned_by_fullname,
              u2.username as assigned_to_name, u2.full_name as assigned_to_fullname
       FROM actions a
       LEFT JOIN reports r ON a.report_id = r.id
       LEFT JOIN users u1 ON a.assigned_by = u1.id
       LEFT JOIN users u2 ON a.assigned_to = u2.id
       ORDER BY a.created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const updateActionStatus = async (req, res) => {
  const { status, remarks } = req.body;
  try {
    const resolved = status === 'completed' || status === 'closed' ? new Date() : null;
    await pool.query(
      'UPDATE actions SET status = ?, remarks = ?, resolved_at = ? WHERE id = ?',
      [status, remarks || null, resolved, req.params.id]
    );
    res.json({ message: 'Action updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const closeFeedbackCase = async (req, res) => {
  const { report_id, remarks } = req.body;
  try {
    await pool.query("UPDATE reports SET status = 'closed' WHERE id = ?", [report_id]);
    await pool.query("UPDATE actions SET status = 'closed', remarks = ? WHERE report_id = ?", [remarks || 'Case closed', report_id]);
    res.json({ message: 'Feedback case closed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getAdmins = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT id, username, full_name, email FROM users WHERE role = 'admin'");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  generateReport, getAllReports, getReportById, updateReportStatus,
  createAction, getAllActions, updateActionStatus, closeFeedbackCase, getAdmins
};
