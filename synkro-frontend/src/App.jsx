// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './Pages/Register';
import Login from './Pages/Login';
import HomeCalendar from './Pages/HomeCalendar';
import PrivateRoute from './Components/PrivateRoute';
import ForgotPassword from './Pages/ForgotPassword';
import ResetPassword from './Pages/ResetPassword';

function App() {
  const [userId, setUserId] = useState(localStorage.getItem('userId'));

  const handleAuth = () => {
    setUserId(localStorage.getItem('userId'));
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={userId ? "/calendar" : "/login"} />} />
        <Route path="/login" element={<Login onSuccess={handleAuth} />} />
        <Route path="/register" element={<Register onSuccess={handleAuth} />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route
          path="/calendar"
          element={
            <PrivateRoute>
              <HomeCalendar onClose={() => {}} />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
