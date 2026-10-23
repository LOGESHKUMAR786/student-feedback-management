const pool = require('../config/db');
const { generateSummary } = require('../models/aiService');

const getDepartmentReport = async (req, res) => {
  try {
    const [report] = await pool.query(
      `SELECT d.name as department, f.name as faculty, c.course_name,
       AVG(fb.rating) as avg_rating, COUNT(fb.id) as total_feedback,
       SUM(CASE WHEN fb.sentiment='positive' THEN 1 ELSE 0 END) as positive,
       SUM(CASE WHEN fb.sentiment='negative' THEN 1 ELSE 0 END) as negative
       FROM feedback fb
       JOIN courses c ON fb.course_id = c.id
       JOIN faculty f ON c.faculty_id = f.id
       JOIN departments d ON c.department_id = d.id
       GROUP BY d.id, f.id, c.id ORDER BY d.name, avg_rating DESC`
    );
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getFacultyPerformance = async (req, res) => {
  try {
    const [perf] = await pool.query(
      `SELECT f.id, f.name, d.name as department,
       AVG(fb.rating) as avg_rating, COUNT(fb.id) as total_feedback,
       SUM(CASE WHEN fb.sentiment='positive' THEN 1 ELSE 0 END) as positive,
       SUM(CASE WHEN fb.sentiment='negative' THEN 1 ELSE 0 END) as negative,
       GROUP_CONCAT(DISTINCT fb.keywords SEPARATOR ',') as all_keywords
       FROM faculty f
       LEFT JOIN courses c ON f.id = c.faculty_id
       LEFT JOIN feedback fb ON c.id = fb.course_id
       LEFT JOIN departments d ON f.department_id = d.id
       GROUP BY f.id ORDER BY avg_rating DESC`
    );

    const result = perf.map(row => {
      let keywords = [];
      try {
        const raw = row.all_keywords || '';
        const parsed = raw.split(',').flatMap(k => { try { return JSON.parse(k); } catch { return []; } });
        keywords = [...new Set(parsed)].slice(0, 10);
      } catch {}
      return { ...row, keywords };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const addRemark = async (req, res) => {
  const { faculty_id, remark } = req.body;
  try {
    await pool.query(
      'INSERT INTO faculty_remarks (faculty_id, dean_id, remark) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE remark=?, updated_at=NOW()',
      [faculty_id, req.user.id, remark, remark]
    );
    res.json({ message: 'Remark saved' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getDepartmentReport, getFacultyPerformance, addRemark };
