import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';

const NavBar: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

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
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerToggle}>
        <List sx={{ width: 250 }}>
          <ListItem button component={Link} to="/" onClick={handleDrawerToggle}>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem button component={Link} to="/add-car" onClick={handleDrawerToggle}>
            <ListItemText primary="Add Car" />
          </ListItem>
          <ListItem button component={Link} to="/favorites" onClick={handleDrawerToggle}>
            <ListItemText primary="Favorites" />
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
