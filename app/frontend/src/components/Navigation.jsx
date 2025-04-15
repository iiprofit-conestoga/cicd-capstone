import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
  Container,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard,
  Person,
  ExitToApp,
  ChevronLeft,
  People,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
 
const Navigation = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
 
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
 
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
 
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
 
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
 
  // Define menu items based on user role
  const getMenuItems = () => {
    const baseMenuItems = [
      { text: 'Dashboard', icon: <Dashboard />, path: '/' },
      { text: 'Profile', icon: <Person />, path: '/profile' },
    ];

    if (user?.role_id === 'admin') {
      return [
        ...baseMenuItems.slice(0, 1), // Dashboard
        { text: 'Users', icon: <People />, path: '/admin/users' },
        baseMenuItems[1], // Profile
      ];
    }

    return baseMenuItems;
  };

  const menuItems = getMenuItems();
 
  const drawer = (
    <Box sx={{ width: 250 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          padding: 2,
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h6" noWrap component="div">
          HR Portal
        </Typography>
        {isMobile && (
          <IconButton onClick={handleDrawerToggle}>
            <ChevronLeft />
          </IconButton>
        )}
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => {
              navigate(item.path);
              if (isMobile) handleDrawerToggle();
            }}
            selected={location.pathname === item.path}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
 
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${250}px)` },
          ml: { sm: `${250}px` },
          bgcolor: theme.palette.primary.main,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {menuItems.find((item) => item.path === location.pathname)?.text || 'HR Portal'}
          </Typography>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenuOpen}
            color="inherit"
          >
            <Person />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => {
              navigate('/profile');
              handleMenuClose();
            }}>
              <ListItemIcon>
                <Person fontSize="small" />
              </ListItemIcon>
              Profile
            </MenuItem>
            <MenuItem onClick={() => {
              handleLogout();
              handleMenuClose();
            }}>
              <ListItemIcon>
                <ExitToApp fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: 250 }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: 250,
              bgcolor: theme.palette.background.default,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${250}px)` },
          mt: { xs: 8, sm: 9 },
        }}
      >
        <Container maxWidth="lg">
          {children}
        </Container>
      </Box>
    </Box>
  );
};
 
export default Navigation;
 