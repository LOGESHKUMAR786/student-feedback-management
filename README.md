# AI-Powered Feedback Management System

A web application for collecting course feedback and managing student grievances. Students can submit and review feedback; administrators manage academic records and feedback cycles; deans can review department and faculty reports.

## Features

- Student registration, sign-in, course feedback, and feedback history
- Feedback sentiment and keyword analysis using a built-in keyword scorer
- Admin tools for managing students, faculty, courses, feedback cycles, and reports
- Dean dashboards for department reports and faculty performance
- Grievance submission and review workflows
- MySQL-backed REST API and a React web interface

## Technology

- **Frontend:** React, React Router, Chart.js
- **Backend:** Node.js, Express
- **Database:** MySQL
- **Authentication:** JSON Web Tokens
- **Sentiment analysis:** Local keyword scoring (not an external AI service)

## Requirements

- Node.js and npm
- MySQL Server and the `mysql` command-line client

## Setup

Run these steps from the project directory (the directory containing `backend`, `frontend`, and `database`).

### 1. Create and seed the database

Run the schema using the MySQL client:

```cmd
mysql -u root -p < database\schema.sql
```

The schema creates the `feedback_db` database and seeds sample departments, courses, faculty, a feedback cycle, and development accounts. The seeded account passwords are `password`; change or remove these accounts before using the application outside local development.

### 2. Configure the backend

Create `backend/.env` with values for your local MySQL instance and a private JWT signing secret:

```dotenv
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=feedback_db
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=1d
PORT=5000
```

Do not commit real credentials or production secrets.

### 3. Install dependencies

In one terminal:

```bash
cd backend
npm install
```

In a second terminal:

```bash
cd frontend
npm install
```

### 4. Run the application

Start the API in the backend terminal:

```bash
npm run dev
```

Start the React app in the frontend terminal:

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000). The API listens on [http://localhost:5000](http://localhost:5000); check that it is running at [http://localhost:5000/api/health](http://localhost:5000/api/health).

The root-level `start.bat` can also open both development servers on Windows. It uses fixed paths for this workspace, so update those paths if the project is moved.

## Development accounts

The database schema seeds these development accounts:

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@college.edu` | `password` |
| Dean / higher official | `dean@college.edu` | `password` |
| Higher official | `official@college.edu` | `password` |

Students can register through the application. The seeded passwords are for local development only.

## API overview

All API routes are prefixed with `/api`. Most application endpoints require a bearer token returned by the login endpoint.

| Area | Routes | Purpose |
| --- | --- | --- |
| Health | `GET /health` | Check API status |
| Authentication | `POST /auth/register`, `POST /auth/login`, `GET /auth/departments` | Register, sign in, and retrieve departments |
| Student | `GET /student/courses`, `GET /student/cycles`, `GET /student/profile` | Retrieve the signed-in student's data |
| Feedback | `POST /feedback`, `PUT /feedback/:id`, `GET /feedback/my`, `GET /feedback/all`, `GET /feedback/analytics` | Submit, update, and view feedback and analytics |
| Administration | `/admin/students`, `/admin/faculty`, `/admin/courses`, `/admin/cycles`, `/admin/departments` | Manage students and academic setup |
| Dean | `GET /dean/department-report`, `GET /dean/faculty-performance`, `POST /dean/remark` | Review department and faculty information |
| Reports | `/reports` | Generate and manage reports and follow-up actions |
| Grievances | `/grievance` | Submit and manage grievances |

For the exact HTTP methods and route parameters, see the route files in `backend/src/routes`.

## Project structure

```text
feedback/
├── backend/       # Express API, controllers, routes, and database configuration
├── database/      # MySQL schema and development seed data
├── frontend/      # React application
└── start.bat      # Windows development startup helper
```

## Useful commands

Run from `frontend/`:

```bash
npm test       # Run frontend tests
npm run build  # Create a production frontend build
```

Run from `backend/`:

```bash
npm start      # Start the API without nodemon
npm run dev    # Start the API with nodemon
```
