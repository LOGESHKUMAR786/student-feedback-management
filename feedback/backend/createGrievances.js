require('dotenv').config();
const mysql = require('mysql2/promise');

async function run() {
  const c = await mysql.createConnection({
    host: process.env.DB_HOST, user: process.env.DB_USER,
    password: process.env.DB_PASSWORD, database: process.env.DB_NAME
  });
  await c.query(`
    CREATE TABLE IF NOT EXISTS grievances (
      id INT AUTO_INCREMENT PRIMARY KEY,
      student_id INT NOT NULL,
      title VARCHAR(255) NOT NULL,
      category ENUM('academic','facility','faculty','administration','other') DEFAULT 'other',
      description TEXT NOT NULL,
      status ENUM('pending','in_review','resolved','rejected') DEFAULT 'pending',
      admin_response TEXT,
      submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
    )
  `);
  console.log('Grievances table created');
  c.end();
}
run();
