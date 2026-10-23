import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

import Welcome from './pages/Welcome';
import StudentLogin from './pages/StudentLogin';
import AdminLogin from './pages/AdminLogin';
import DeanLogin from './pages/DeanLogin';
import Register from './pages/Register';
import AdminRegister from './pages/AdminRegister';
import DeanRegister from './pages/DeanRegister';

import StudentDashboard from './pages/student/Dashboard';
import SubmitFeedback from './pages/student/SubmitFeedback';
import FeedbackHistory from './pages/student/FeedbackHistory';

import AdminDashboard from './pages/admin/Dashboard';
import ManageStudents from './pages/admin/ManageStudents';
import ManageFaculty from './pages/admin/ManageFaculty';
import ManageCourses from './pages/admin/ManageCourses';
import ManageCycles from './pages/admin/ManageCycles';
import AllFeedback from './pages/admin/AllFeedback';
import GenerateReport from './pages/admin/GenerateReport';

import Grievance from './pages/student/Grievance';
import AdminGrievances from './pages/admin/Grievances';
import DeanGrievances from './pages/dean/Grievances';

import DeanDashboard from './pages/dean/Dashboard';
import DepartmentReports from './pages/dean/DepartmentReports';
import FacultyPerformance from './pages/dean/FacultyPerformance';

function Layout({ children }) {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Navbar />
      <main>{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Welcome />} />

          {/* Login Pages */}
          <Route path="/login" element={<StudentLogin />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/dean/login" element={<DeanLogin />} />

          {/* Register Pages */}
          <Route path="/register" element={<Register />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          <Route path="/dean/register" element={<DeanRegister />} />

          {/* Student */}
          <Route path="/student/dashboard" element={<ProtectedRoute><Layout><StudentDashboard /></Layout></ProtectedRoute>} />
          <Route path="/student/feedback" element={<ProtectedRoute><Layout><SubmitFeedback /></Layout></ProtectedRoute>} />
          <Route path="/student/history" element={<ProtectedRoute><Layout><FeedbackHistory /></Layout></ProtectedRoute>} />

          <Route path="/student/grievance" element={<ProtectedRoute><Layout><Grievance /></Layout></ProtectedRoute>} />

          {/* Admin */}
          <Route path="/admin/dashboard" element={<ProtectedRoute><Layout><AdminDashboard /></Layout></ProtectedRoute>} />
          <Route path="/admin/students" element={<ProtectedRoute><Layout><ManageStudents /></Layout></ProtectedRoute>} />
          <Route path="/admin/faculty" element={<ProtectedRoute><Layout><ManageFaculty /></Layout></ProtectedRoute>} />
          <Route path="/admin/courses" element={<ProtectedRoute><Layout><ManageCourses /></Layout></ProtectedRoute>} />
          <Route path="/admin/cycles" element={<ProtectedRoute><Layout><ManageCycles /></Layout></ProtectedRoute>} />
          <Route path="/admin/feedback" element={<ProtectedRoute><Layout><AllFeedback /></Layout></ProtectedRoute>} />
          <Route path="/admin/reports" element={<ProtectedRoute><Layout><GenerateReport /></Layout></ProtectedRoute>} />

          <Route path="/admin/grievances" element={<ProtectedRoute><Layout><AdminGrievances /></Layout></ProtectedRoute>} />

          {/* Dean */}
          <Route path="/dean/dashboard" element={<ProtectedRoute><Layout><DeanDashboard /></Layout></ProtectedRoute>} />
          <Route path="/dean/reports" element={<ProtectedRoute><Layout><DepartmentReports /></Layout></ProtectedRoute>} />
          <Route path="/dean/faculty" element={<ProtectedRoute><Layout><FacultyPerformance /></Layout></ProtectedRoute>} />

          <Route path="/dean/grievances" element={<ProtectedRoute><Layout><DeanGrievances /></Layout></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </BrowserRouter>
    </AuthProvider>
  );
}
