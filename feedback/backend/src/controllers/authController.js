const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const register = async (req, res) => {
  const { username, email, password, role = 'student', name, full_name, department_id, roll_number, batch_year, year_of_study } = req.body;
  const displayName = full_name || name || username;
  try {
    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (username, email, password, full_name, role) VALUES (?, ?, ?, ?, ?)',
      [username, email, hash, displayName, role]
    );
    if (role === 'student') {
      await pool.query(
        'INSERT INTO students (user_id, name, department_id, roll_number) VALUES (?, ?, ?, ?)',
        [result.insertId, displayName, department_id || null, roll_number || null]
      );
    }
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: 'Username or email already exists' });
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (!users.length) return res.status(400).json({ message: 'Invalid credentials' });

    const user = users[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: 'Invalid credentials' });

    let profileId = null;
    if (user.role === 'student') {
      const [s] = await pool.query('SELECT id FROM students WHERE user_id = ?', [user.id]);
      profileId = s[0]?.id;
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, profileId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    res.json({
      token,
      user: { id: user.id, username: user.username, email: user.email, role: user.role, profileId, fullName: user.full_name }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { register, login };
