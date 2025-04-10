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
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
 
  if (loading) {
    return <div>Loading...</div>;
  }
 
  if (!user) {
    return <Navigate to="/login" />;
  }
 
  if (allowedRoles && !allowedRoles.includes(user.role_id)) {
    // Redirect to appropriate dashboard based on role_id
    return <Navigate to={user.role_id === 'admin' ? '/admin/dashboard' : '/employee/dashboard'} />;
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
            <Navigate to={user.role_id === 'admin' ? '/admin/dashboard' : '/employee/dashboard'} />
          ) : (
            <Login />
          )
        } 
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Navigate to={user?.role_id === 'admin' ? '/admin/dashboard' : '/employee/dashboard'} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/*"
        element={
          <ProtectedRoute allowedRoles={['employee']}>
            <EmployeeDashboard />
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
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};
 
export default App;
 