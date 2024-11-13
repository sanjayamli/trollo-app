// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/login.jsx';
import Register from './pages/register.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TaskBoard from './pages/taskBoard.jsx';

const App = () => {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <>
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/tasks"
          element={isAuthenticated ? <TaskBoard /> : <Navigate to="/login" />}
        />
        <Route path="/" element={<Navigate to="/tasks" />} />
      </Routes>
    </Router>
          <ToastContainer position="top-right" autoClose={5000} />
          </>
  );
};

export default App;
