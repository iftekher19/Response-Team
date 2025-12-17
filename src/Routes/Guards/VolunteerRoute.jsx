import React from "react";
import { Navigate, Outlet } from "react-router";
import useAuth from "../hooks/useAuth";

const VolunteerRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const role = user?.role || "donor";

  if (role !== "volunteer") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default VolunteerRoute;
