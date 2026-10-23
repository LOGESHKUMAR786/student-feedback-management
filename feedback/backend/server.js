require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const pool = require('./src/config/db');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth',      require('./src/routes/auth'));
app.use('/api/feedback',  require('./src/routes/feedback'));
app.use('/api/admin',     require('./src/routes/admin'));
app.use('/api/student',   require('./src/routes/student'));
app.use('/api/dean',      require('./src/routes/dean'));
app.use('/api/reports',   require('./src/routes/reports'));
app.use('/api/grievance', require('./src/routes/grievance'));

// Auto-close expired cycles daily
cron.schedule('0 0 * * *', async () => {
  await pool.query("UPDATE feedback_cycles SET status='closed' WHERE end_date < CURDATE() AND status='open'");
});

app.get('/api/health', (req, res) => res.json({ status: 'OK' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
