const pool = require('../config/db');

// Get chat messages filtered by batch/department
const getMessages = async (req, res) => {
  const { batch_year, department, limit = 50 } = req.query;
  try {
    let query = `SELECT cm.*, u.role FROM chat_messages cm JOIN users u ON cm.sender_id = u.id WHERE 1=1`;
    const params = [];
    if (batch_year) { query += ' AND cm.batch_year = ?'; params.push(batch_year); }
    if (department) { query += ' AND cm.department = ?'; params.push(department); }
    query += ' ORDER BY cm.created_at DESC LIMIT ?';
    params.push(parseInt(limit));
    const [rows] = await pool.query(query, params);
    res.json(rows.reverse());
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Save message to DB
const saveMessage = async (data) => {
  const { sender_id, sender_name, role, batch_year, department, message } = data;
  try {
    const [result] = await pool.query(
      'INSERT INTO chat_messages (sender_id, sender_name, role, batch_year, department, message) VALUES (?, ?, ?, ?, ?, ?)',
      [sender_id, sender_name, role, batch_year || null, department || null, message]
    );
    return result.insertId;
  } catch (err) {
    console.error('Chat save error:', err.message);
    return null;
  }
};

// Get batches
const getBatches = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT b.*, d.name as department_name FROM batches b LEFT JOIN departments d ON b.department_id = d.id ORDER BY b.batch_year DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Add batch (admin)
const addBatch = async (req, res) => {
  const { batch_year, department_id } = req.body;
  try {
    await pool.query('INSERT IGNORE INTO batches (batch_year, department_id) VALUES (?, ?)', [batch_year, department_id]);
    res.status(201).json({ message: 'Batch added' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getMessages, saveMessage, getBatches, addBatch };
