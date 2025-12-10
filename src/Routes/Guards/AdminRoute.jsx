// src/Guards/AdminRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router";
import useAuth from "../../hooks/useAuth";

const AdminRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const role = user?.role || "donor";

  if (role !== "admin") {
    // Not admin → back to dashboard main
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
