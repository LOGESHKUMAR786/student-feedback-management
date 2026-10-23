require('dotenv').config();
const mysql = require('mysql2/promise');

async function run() {
  const c = await mysql.createConnection({
    host: process.env.DB_HOST, user: process.env.DB_USER,
    password: process.env.DB_PASSWORD, database: process.env.DB_NAME
  });
  await c.query('ALTER TABLE grievances ADD COLUMN dean_action TEXT DEFAULT NULL');
  console.log('dean_action column added');
  c.end();
}
run();
