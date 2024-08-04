import React from 'react';
import { Typography, Container, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NotFound: React.FC = () => {
  const { role } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (role === 'consumer') {
      navigate('/');
    } else if (role === 'operations') {
      navigate('/add-car');
    }
  }, [role, navigate]);

  return (
    <Container>
      <Typography variant="h4">404 - Page Not Found</Typography>
      <Typography variant="body1">The page you are looking for does not exist.</Typography>
    </Container>
  );
};

export default NotFound;
