CREATE DATABASE IF NOT EXISTS feedback_db;
USE feedback_db;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(150),
  role ENUM('student','admin','higher_official') NOT NULL DEFAULT 'student',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS departments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(150) NOT NULL,
  department_id INT,
  roll_number VARCHAR(50) UNIQUE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (department_id) REFERENCES departments(id)
);

CREATE TABLE IF NOT EXISTS faculty (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) UNIQUE,
  department_id INT,
  FOREIGN KEY (department_id) REFERENCES departments(id)
);

CREATE TABLE IF NOT EXISTS courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  course_name VARCHAR(150) NOT NULL,
  course_code VARCHAR(50) UNIQUE,
  faculty_id INT,
  department_id INT,
  FOREIGN KEY (faculty_id) REFERENCES faculty(id),
  FOREIGN KEY (department_id) REFERENCES departments(id)
);

CREATE TABLE IF NOT EXISTS student_courses (
  student_id INT,
  course_id INT,
  PRIMARY KEY (student_id, course_id),
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (course_id) REFERENCES courses(id)
);

CREATE TABLE IF NOT EXISTS feedback_cycles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status ENUM('open','closed') DEFAULT 'open',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS feedback (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  course_id INT NOT NULL,
  cycle_id INT NOT NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  sentiment ENUM('positive','neutral','negative') DEFAULT 'neutral',
  sentiment_score FLOAT DEFAULT 0,
  keywords JSON,
  status ENUM('open','in_review','closed') DEFAULT 'open',
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_feedback (student_id, course_id, cycle_id),
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (course_id) REFERENCES courses(id),
  FOREIGN KEY (cycle_id) REFERENCES feedback_cycles(id)
);

CREATE TABLE IF NOT EXISTS reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  course_id INT,
  generated_by INT,
  total_feedback INT DEFAULT 0,
  avg_rating DECIMAL(3,2) DEFAULT 0,
  positive_count INT DEFAULT 0,
  negative_count INT DEFAULT 0,
  neutral_count INT DEFAULT 0,
  summary TEXT,
  status ENUM('pending','reviewed','action_taken','closed') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL,
  FOREIGN KEY (generated_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS actions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  report_id INT,
  assigned_by INT,
  assigned_to INT,
  action_description TEXT NOT NULL,
  priority ENUM('low','medium','high','critical') DEFAULT 'medium',
  status ENUM('pending','in_progress','completed','closed') DEFAULT 'pending',
  remarks TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP NULL,
  FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS faculty_remarks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  faculty_id INT NOT NULL,
  dean_id INT NOT NULL,
  remark TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_remark (faculty_id, dean_id),
  FOREIGN KEY (faculty_id) REFERENCES faculty(id),
  FOREIGN KEY (dean_id) REFERENCES users(id)
);

-- Seed departments
INSERT IGNORE INTO departments (name) VALUES ('Computer Science'),('Electronics'),('Mechanical'),('Civil');

-- Seed users (password = 'password')
INSERT IGNORE INTO users (username, email, password, full_name, role) VALUES
('admin',          'admin@college.edu',    '$2a$10$4aU4TojKiSXrnao5h3Ox6OuQV4luDVYBUPeeFOA6vg5X7ZPKHqsgq', 'System Admin',    'admin'),
('higher_official','official@college.edu', '$2a$10$4aU4TojKiSXrnao5h3Ox6OuQV4luDVYBUPeeFOA6vg5X7ZPKHqsgq', 'Higher Official', 'higher_official'),
('dean',           'dean@college.edu',     '$2a$10$4aU4TojKiSXrnao5h3Ox6OuQV4luDVYBUPeeFOA6vg5X7ZPKHqsgq', 'Dean HOD',        'higher_official');

-- Seed faculty
INSERT IGNORE INTO faculty (name, email, department_id) VALUES
('Dr. Smith',    'smith@college.edu',    1),
('Dr. Johnson',  'johnson@college.edu',  1),
('Dr. Williams', 'williams@college.edu', 2);

-- Seed courses
INSERT IGNORE INTO courses (course_name, course_code, faculty_id, department_id) VALUES
('Data Structures',    'CS101', 1, 1),
('Algorithms',         'CS102', 2, 1),
('Digital Electronics','EC101', 3, 2);

-- Seed feedback cycle
INSERT IGNORE INTO feedback_cycles (title, start_date, end_date, status) VALUES
('Semester 1 - 2024', '2024-01-01', '2024-12-31', 'open');
