import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Adjust path as needed

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    // Optional: Show a loading spinner or message while checking auth status
    return <div>Loading authentication status...</div>;
  }

  // If authenticated, render the child route components using Outlet
  // If not authenticated, redirect to the login page
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
