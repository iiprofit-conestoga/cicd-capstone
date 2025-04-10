import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Grid,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
 
const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
 
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
 
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h4" component="h1" gutterBottom>
                Welcome, {user?.name || 'User'}!
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                You are successfully logged in to your dashboard.
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Account Information
                </Typography>
                <Typography variant="body1">
                  Email: {user?.email}
                </Typography>
                <Typography variant="body1">
                  Role: {user?.role || 'User'}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleLogout}
                sx={{ mt: 2 }}
              >
                Logout
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};
 
export default Dashboard;
 