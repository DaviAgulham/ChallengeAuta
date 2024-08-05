import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemText, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { useAuth } from '../context/AuthContext';
import { getAuth } from 'firebase/auth';

const NavBar: React.FC = () => {
  const { user, loading } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
      window.location.replace('');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  if (loading) {
    return null;
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: '#333' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleDrawerToggle}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Challenge AUTA
          </Typography>
          <Button 
            color="error"
            variant="contained"
            onClick={handleLogout}
            sx={{ marginLeft: 'auto' }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerToggle}>
        <List sx={{ width: 250 }}>
          <ListItem button component={Link} to="/" onClick={handleDrawerToggle}>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem button component={Link} to="/favorites" onClick={handleDrawerToggle}>
            <ListItemText primary="Favorites" />
          </ListItem>
          <ListItem button component={Link} to="/add-car" onClick={handleDrawerToggle}>
            <ListItemText primary="Add Car" />
          </ListItem>
          <ListItem button component={Link} to="/team-queries" onClick={handleDrawerToggle}>
            <ListItemText primary="Team Queries" />
          </ListItem>
        </List>
      </Drawer>
    </>
  );
};

export default NavBar;
