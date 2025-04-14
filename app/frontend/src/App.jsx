import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import theme from './theme';
 
// Components
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Navigation from './components/Navigation';
import Profile from './pages/Profile';
import Users from './pages/Users';
 
// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
 
  if (loading) {
    return <div>Loading...</div>;
  }
 
  if (!user) {
    return <Navigate to="/login" />;
  }
 
  if (allowedRoles && !allowedRoles.includes(user.role_id)) {
    return <Navigate to="/" />;
  }
 
  return children;
};
 
const AppRoutes = () => {
  const { user } = useAuth();
 
  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          user ? (
            <Navigate to="/" />
          ) : (
            <Login />
          )
        } 
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
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
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Users />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};
 
const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <AppRoutes />;
  }

  return (
    <Navigation>
      <AppRoutes />
    </Navigation>
  );
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};
 
export default App;
 