import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Pages
import HomePage from './pages/HomePage';
import StudentRegister from './pages/StudentRegister';
import TutorRegister from './pages/TutorRegister';
import StudentLogin from './pages/StudentLogin';
import TutorLogin from './pages/TutorLogin';
import AdminLogin from './pages/AdminLogin';
import StudentDashboard from './pages/StudentDashboard';
import TutorDashboard from './pages/TutorDashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (token in localStorage)
    const token = localStorage.getItem('token');
    const savedUserType = localStorage.getItem('userType');
    const savedUser = localStorage.getItem('user');

    if (token && savedUserType) {
      setUser(JSON.parse(savedUser));
      setUserType(savedUserType);
    }
    setLoading(false);
  }, []);

  const handleLogin = (token, type, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userType', type);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setUserType(type);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('user');
    setUser(null);
    setUserType(null);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/student-register" element={<StudentRegister onLogin={handleLogin} />} />
        <Route path="/tutor-register" element={<TutorRegister onLogin={handleLogin} />} />
        <Route path="/student-login" element={<StudentLogin onLogin={handleLogin} />} />
        <Route path="/tutor-login" element={<TutorLogin onLogin={handleLogin} />} />
        <Route path="/admin-login" element={<AdminLogin onLogin={handleLogin} />} />

        {/* Protected Routes */}
        <Route
          path="/student-dashboard"
          element={userType === 'student' ? <StudentDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/student-login" />}
        />
        <Route
          path="/tutor-dashboard"
          element={userType === 'tutor' ? <TutorDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/tutor-login" />}
        />
        <Route
          path="/admin-dashboard"
          element={userType === 'admin' ? <AdminDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/admin-login" />}
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
