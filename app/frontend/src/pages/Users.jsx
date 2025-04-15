import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Snackbar,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Users = () => {
  const { api } = useAuth();
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    dateOfBirth: '',
    phoneNumber: '',
    address: '',
    role_id: 'employee'
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/users/all');
      if (response.data && response.data.status === 'success') {
        setUsers(response.data.data);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      dateOfBirth: '',
      phoneNumber: '',
      address: '',
      role_id: 'employee'
    });
  };

  const handleAddClick = () => {
    setSelectedUser(null);
    setOpenDialog(true);
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      dateOfBirth: user.dateOfBirth || '',
      phoneNumber: user.phoneNumber || '',
      address: user.address || '',
      role_id: user.role_id
    });
    setOpenDialog(true);
  };

  const handleSubmit = async () => {
    try {
      if (selectedUser) {
        // Edit user
        const response = await api.put(`/api/users/${selectedUser._id}`, formData);
        if (response.data.status === 'success') {
          setSuccess('User updated successfully');
          fetchUsers();
        }
      } else {
        // Add user
        const response = await api.post('/api/users/add', formData);
        if (response.data.status === 'success') {
          setSuccess('User added successfully');
          fetchUsers();
        }
      }
      handleDialogClose();
    } catch (error) {
      setError(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await api.delete(`/api/users/${userId}`);
        if (response.data.status === 'success') {
          setSuccess('User deleted successfully');
          fetchUsers();
        }
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const filteredUsers = roleFilter === 'all' 
    ? users 
    : users.filter(user => user.role_id === roleFilter);

  return (
    <Container maxWidth="lg">
      <Snackbar 
        open={!!error || !!success} 
        autoHideDuration={6000} 
        onClose={() => {
          setError(null);
          setSuccess(null);
        }}
      >
        <Alert 
          severity={error ? "error" : "success"} 
          sx={{ width: '100%' }}
          onClose={() => {
            setError(null);
            setSuccess(null);
          }}
        >
          {error || success}
        </Alert>
      </Snackbar>

      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Users Management
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddClick}
          >
            Add User
          </Button>
        </Box>
        
        <Stack spacing={2}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel id="role-filter-label">Filter by Role</InputLabel>
              <Select
                labelId="role-filter-label"
                id="role-filter"
                value={roleFilter}
                label="Filter by Role"
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <MenuItem value="all">All Users</MenuItem>
                <MenuItem value="admin">Admins Only</MenuItem>
                <MenuItem value="employee">Employees Only</MenuItem>
              </Select>
            </FormControl>
          </Paper>

          <Paper elevation={3}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">Loading...</TableCell>
                    </TableRow>
                  ) : filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">No users found</TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow 
                        key={user._id}
                        sx={{
                          backgroundColor: user.role_id === 'admin' ? 'rgba(0, 0, 0, 0.04)' : 'inherit'
                        }}
                      >
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.phoneNumber || '-'}</TableCell>
                        <TableCell>
                          <Typography
                            component="span"
                            sx={{
                              color: user.role_id === 'admin' ? 'primary.main' : 'text.primary',
                              fontWeight: user.role_id === 'admin' ? 500 : 400
                            }}
                          >
                            {user.role_id === 'admin' ? 'Admin' : 'Employee'}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            size="small"
                            sx={{ mr: 1 }}
                            onClick={() => handleEditClick(user)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="small"
                            color="error"
                            onClick={() => handleDelete(user._id)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Stack>
      </Box>

      <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedUser ? 'Edit User' : 'Add New User'}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              margin="normal"
              required={!selectedUser}
              helperText={selectedUser ? "Leave blank to keep current password" : ""}
            />
            <TextField
              fullWidth
              label="Phone Number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              margin="normal"
              multiline
              rows={2}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Role</InputLabel>
              <Select
                name="role_id"
                value={formData.role_id}
                onChange={handleInputChange}
                label="Role"
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="employee">Employee</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {selectedUser ? 'Save Changes' : 'Add User'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Users; 