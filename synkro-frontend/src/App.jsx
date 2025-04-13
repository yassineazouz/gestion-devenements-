import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './Pages/Landing';
import Login from './Pages/Login';
import Register from './Pages/Register';
import HomeCalendar from './Pages/HomeCalendar';
import PrivateRoute from './Components/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/calendar"
          element={
            <PrivateRoute>
              <HomeCalendar />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

