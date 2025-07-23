import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getCurrentUser } from '../utils/auth';

const PrivateRoute = ({ allowedRoles }) => {
  const user = getCurrentUser();
  const access_token = localStorage.getItem('access_token');

  if (!access_token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user's role is allowed
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />; // Renders nested route like Dashboard
};

export default PrivateRoute;
