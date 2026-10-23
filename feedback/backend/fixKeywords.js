require('dotenv').config();
const mysql = require('mysql2/promise');

async function fix() {
  const c = await mysql.createConnection({
    host: process.env.DB_HOST, user: process.env.DB_USER,
    password: process.env.DB_PASSWORD, database: process.env.DB_NAME
  });
  const [rows] = await c.query('SELECT id, keywords FROM feedback');
  for (const r of rows) {
    try { JSON.parse(r.keywords); }
    catch {
      const arr = typeof r.keywords === 'string'
        ? r.keywords.split(',').map(k => k.trim()).filter(Boolean)
        : Array.isArray(r.keywords) ? r.keywords : [];
      const fixed = JSON.stringify(arr);
      await c.query('UPDATE feedback SET keywords=? WHERE id=?', [fixed, r.id]);
      console.log('Fixed id', r.id, '=>', fixed);
    }
  }
  console.log('Done');
  c.end();
}
fix();
