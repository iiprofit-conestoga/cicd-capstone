import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Container,
  Paper,
  Typography,
  Box,
} from '@mui/material';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome, {user?.name || 'User'}!
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Welcome to the HR Portal. Use the navigation menu to access different sections.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Dashboard; 