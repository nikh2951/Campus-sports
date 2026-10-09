import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

import LoginPage from './pages/LoginPage';
import RoleSelectPage from './pages/RoleSelectPage';
import StudentRegisterPage from './pages/StudentRegisterPage';

import StudentDashboard from './pages/StudentDashboard';
import StudentSports from './pages/StudentSports';
import StudentEvents from './pages/StudentEvents';
import StudentAchievements from './pages/StudentAchievements';
import StudentProfile from './pages/StudentProfile';

import AdminDashboard from './pages/AdminDashboard';
import AdminAssignEquipment from './pages/AdminAssignEquipment';
import AdminAssignedList from './pages/AdminAssignedList';
import AdminBlockedStudents from './pages/AdminBlockedStudents';
import AdminManageSports from './pages/AdminManageSports';
import AdminManageInventory from './pages/AdminManageInventory';
import AdminManageEvents from './pages/AdminManageEvents';
import AdminManageAchievements from './pages/AdminManageAchievements';

// Protected Route wrappers
const ProtectedStudentRoute = ({ children }) => {
  const { user, role, studentData } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  if (role !== 'student') return <Navigate to="/role-select" replace />;
  if (!studentData) return <Navigate to="/student/register" replace />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
};

const ProtectedAdminRoute = ({ children }) => {
  const { user, role } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  if (role !== 'admin') return <Navigate to="/role-select" replace />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
};

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/role-select" replace /> : <LoginPage />} />
        <Route path="/role-select" element={user ? <RoleSelectPage /> : <Navigate to="/" replace />} />
        <Route path="/student/register" element={user ? <StudentRegisterPage /> : <Navigate to="/" replace />} />

        {/* Student Routes */}
        <Route path="/student/dashboard" element={<ProtectedStudentRoute><StudentDashboard /></ProtectedStudentRoute>} />
        <Route path="/student/sports" element={<ProtectedStudentRoute><StudentSports /></ProtectedStudentRoute>} />
        <Route path="/student/events" element={<ProtectedStudentRoute><StudentEvents /></ProtectedStudentRoute>} />
        <Route path="/student/achievements" element={<ProtectedStudentRoute><StudentAchievements /></ProtectedStudentRoute>} />
        <Route path="/student/profile" element={<ProtectedStudentRoute><StudentProfile /></ProtectedStudentRoute>} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
        <Route path="/admin/assign-equipment" element={<ProtectedAdminRoute><AdminAssignEquipment /></ProtectedAdminRoute>} />
        <Route path="/admin/assigned-list" element={<ProtectedAdminRoute><AdminAssignedList /></ProtectedAdminRoute>} />
        <Route path="/admin/blocked-students" element={<ProtectedAdminRoute><AdminBlockedStudents /></ProtectedAdminRoute>} />
        <Route path="/admin/manage-sports" element={<ProtectedAdminRoute><AdminManageSports /></ProtectedAdminRoute>} />
        <Route path="/admin/manage-inventory" element={<ProtectedAdminRoute><AdminManageInventory /></ProtectedAdminRoute>} />
        <Route path="/admin/manage-events" element={<ProtectedAdminRoute><AdminManageEvents /></ProtectedAdminRoute>} />
        <Route path="/admin/manage-achievements" element={<ProtectedAdminRoute><AdminManageAchievements /></ProtectedAdminRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
