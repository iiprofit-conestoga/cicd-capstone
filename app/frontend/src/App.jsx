import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import theme from './theme';
 
// Components
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
 
// Protected Route Component
const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
 
  if (loading) {
    return <div>Loading...</div>;
  }
 
  if (!user) {
    return <Navigate to="/login" />;
  }
 
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" />;
  }
 
  return children;
};
 
const AppRoutes = () => {
  const { user } = useAuth();
 
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            {user?.role === 'admin' ? <AdminDashboard /> : <EmployeeDashboard />}
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
        path="/admin/*"
        element={
          <ProtectedRoute roles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};
 
const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Navigation />
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};
 
export default App;
 