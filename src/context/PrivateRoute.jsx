import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './userAuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loadingAuth } = useAuth();

  if (loadingAuth) {

    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/user/login" replace />;
  }

  return children;
};

export default PrivateRoute;
