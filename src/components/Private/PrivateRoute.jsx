import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const PrivateRoute = ({ requiredRole }) => {
  const { user, token } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user.user.rol !== requiredRole) {
    return <Navigate to="/dashboard" />;
  }

  return <Outlet />;
};

export default PrivateRoute;