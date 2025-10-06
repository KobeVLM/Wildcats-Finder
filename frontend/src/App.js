import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ReportLost from './pages/ReportLost';
import ReportFound from './pages/ReportFound';
import Search from './pages/Search';
import Profile from './pages/Profile';
import Login from './pages/Login'; 

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} /> {/* Add the login route */}
          <Route path="/" element={<ProtectedRoute> <Home/> </ProtectedRoute>}/>
          <Route path="/report-lost"element={<ProtectedRoute><ReportLost /></ProtectedRoute>}/>
          <Route path="/report-found"element={<ProtectedRoute><ReportFound /></ProtectedRoute>}/>
          <Route path="/search"element={<ProtectedRoute><Search /></ProtectedRoute>}/>
          <Route path="/profile"element={<ProtectedRoute><Profile /></ProtectedRoute>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;