# 🎓 AI-Powered Feedback Management System

## 🛠 Tech Stack
- **Frontend**: React.js + Chart.js
- **Backend**: Node.js + Express
- **Database**: MySQL
- **AI**: Sentiment Analysis (JS-based keyword scoring)

---

## 📁 Project Structure
```
feedback/
├── backend/          # Node.js + Express API
├── frontend/         # React.js App
├── database/         # SQL Schema
└── start.bat         # One-click startup script
```

---

## ⚙️ Setup Instructions

### 1. Database Setup
The database has already been set up. To re-run manually:
```
cd "C:\Program Files\MySQL\MySQL Workbench 8.0"
mysql.exe -u root -psan@2005 < e:\feedback\database\schema.sql
```

### 2. Backend Setup
```bash
cd e:\feedback\backend
npm install
npm run dev        # runs on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd e:\feedback\frontend
npm install
npm start          # runs on http://localhost:3000
```

### 4. One-Click Start
Double-click `start.bat` to launch both servers at once.

---

## 🔐 Default Login Credentials

| Role    | Email                  | Password  |
|---------|------------------------|-----------|
| Admin   | admin@college.edu      | password  |
| Dean    | dean@college.edu       | password  |
| Student | Register via /register | (your own)|

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint             | Description       |
|--------|----------------------|-------------------|
| POST   | /api/auth/register   | Register student  |
| POST   | /api/auth/login      | Login             |

### Student
| Method | Endpoint              | Description         |
|--------|-----------------------|---------------------|
| GET    | /api/student/courses  | My assigned courses |
| GET    | /api/student/cycles   | Active cycles       |
| GET    | /api/student/profile  | My profile          |

### Feedback
| Method | Endpoint              | Description         |
|--------|-----------------------|---------------------|
| POST   | /api/feedback         | Submit feedback     |
| PUT    | /api/feedback/:id     | Edit feedback       |
| GET    | /api/feedback/my      | My feedback history |
| GET    | /api/feedback/all     | All feedback(admin) |
| GET    | /api/feedback/analytics | Analytics data    |

### Admin
| Method | Endpoint                    | Description        |
|--------|-----------------------------|--------------------|
| GET    | /api/admin/students         | List students      |
| DELETE | /api/admin/students/:id     | Delete student     |
| GET    | /api/admin/faculty          | List faculty       |
| POST   | /api/admin/faculty          | Add faculty        |
| PUT    | /api/admin/faculty/:id      | Update faculty     |
| DELETE | /api/admin/faculty/:id      | Delete faculty     |
| GET    | /api/admin/courses          | List courses       |
| POST   | /api/admin/courses          | Add course         |
| POST   | /api/admin/courses/assign   | Assign to student  |
| GET    | /api/admin/cycles           | List cycles        |
| POST   | /api/admin/cycles           | Create cycle       |
| PATCH  | /api/admin/cycles/:id/toggle| Open/Close cycle   |

### Dean
| Method | Endpoint                      | Description           |
|--------|-------------------------------|-----------------------|
| GET    | /api/dean/department-report   | Dept-wise report      |
| GET    | /api/dean/faculty-performance | Faculty analytics     |
| POST   | /api/dean/remark              | Add remark on faculty |

---

## 🤖 AI Features
- **Sentiment Analysis**: Detects Positive 😄 / Neutral 😐 / Negative 😡
- **Keyword Extraction**: Extracts key themes from feedback text
- **AI Summary**: Auto-generates summary from all feedback data
- **Real-time Preview**: Shows sentiment prediction while typing

---

## 👥 Roles & Access

| Feature                  | Student | Admin | Dean |
|--------------------------|---------|-------|------|
| Submit Feedback          | ✅      | ❌    | ❌   |
| Edit Feedback            | ✅      | ❌    | ❌   |
| View Own History         | ✅      | ❌    | ❌   |
| Manage Students          | ❌      | ✅    | ❌   |
| Manage Faculty/Courses   | ❌      | ✅    | ❌   |
| Open/Close Cycles        | ❌      | ✅    | ❌   |
| Analytics Dashboard      | ❌      | ✅    | ✅   |
| Department Reports       | ❌      | ✅    | ✅   |
| Faculty Performance      | ❌      | ✅    | ✅   |
| Add Remarks on Faculty   | ❌      | ❌    | ✅   |
