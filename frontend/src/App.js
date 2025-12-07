import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Toaster } from 'sonner';
import theme from './theme/theme';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import { Navigation } from './components/layout/Navigation';

// Pages
import Index from './pages/Index/Index';
import { HomePage } from './pages/Home/Home';
import ReportItem from './pages/ReportItem/ReportItem';
import Search from './pages/Search/Search';
import Profile from './pages/Profile/Profile';
import Claims from './pages/Claims/Claims';
import Admin from './pages/Admin/Admin';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';

// Mock data - replace with actual API calls
const mockItems = [
  {
    id: '1',
    type: 'lost',
    name: 'iPhone 13 Pro',
    description: 'Blue iPhone 13 Pro with a black case',
    category: 'Electronics',
    location: 'Main Campus - Library',
    date: '2024-12-01',
    imageUrl: '',
    reportedBy: 'student@cit.edu',
    status: 'active',
  },
  {
    id: '2',
    type: 'found',
    name: 'Blue Backpack',
    description: 'Blue Jansport backpack with laptop inside',
    category: 'Accessories',
    location: 'Main Campus - Cafeteria',
    date: '2024-12-02',
    imageUrl: '',
    reportedBy: 'admin@cit.edu',
    status: 'active',
  },
];

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [items] = useState(mockItems);
  const [currentPage, setCurrentPage] = useState('home');
  const [userRole] = useState('student'); // or 'admin'

  // Update current page based on route
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/home')) setCurrentPage('home');
    else if (path.includes('/report-item')) setCurrentPage('report');
    else if (path.includes('/search')) setCurrentPage('search');
    else if (path.includes('/profile')) setCurrentPage('profile');
    else if (path.includes('/claims')) setCurrentPage('claims');
    else if (path.includes('/admin')) setCurrentPage('admin');
  }, [location]);

  const handleNavigate = (page) => {
    const routes = {
      home: '/home',
      report: '/report-item',
      search: '/search',
      profile: '/profile',
      claims: '/claims',
      admin: '/admin',
    };
    navigate(routes[page] || '/home');
  };

  const handleClaim = (item) => {
    console.log('Claiming item:', item);
    // TODO: Implement claim logic
  };

  const isProtectedRoute = !['/login', '/signup', '/'].includes(location.pathname);

  return (
    <>
      <CssBaseline />
      <Toaster position="top-right" richColors />
      
      {isProtectedRoute && (
        <Navigation
          currentPage={currentPage}
          onNavigate={handleNavigate}
          userRole={userRole}
          notificationCount={0}
          claimsCount={0}
        />
      )}

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage items={items} onClaim={handleClaim} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/report-item"
          element={
            <ProtectedRoute>
              <ReportItem />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <Search />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/claims"
          element={
            <ProtectedRoute>
              <Claims />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;
