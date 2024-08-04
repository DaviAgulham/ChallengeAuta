import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactElement;
  requiredRole?: string;
  handleError: (message: string) => void;
}

const ProtectedRouteComponent: React.FC<ProtectedRouteProps> = ({ children, requiredRole, handleError }) => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    handleError('You need to be logged in to access this page.');
    return <Navigate to="/login" />;
  }

  if (requiredRole && role !== requiredRole) {
    handleError('You do not have permission to access this page.');
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRouteComponent;
