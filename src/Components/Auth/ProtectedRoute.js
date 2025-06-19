import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function ProtectedRoute({ children }) {
  const { currentUser, isAuthenticated } = useAuth();
  
  if (!currentUser || !isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
}

export default ProtectedRoute; 