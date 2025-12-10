// src/Guards/PrivateRoute.jsx
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import useAuth from "../../hooks/useAuth";

const PrivateRoute = () => {
  const { user, firebaseUser, loading } = useAuth();
  const location = useLocation();

  // Still checking Firebase/backend
  if (loading) {
    // You can replace with your own spinner component
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // Not logged in (no firebase user)
  if (!firebaseUser) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname + location.search }}
        replace
      />
    );
  }

  // Application-level user info (role, status)
  const effectiveStatus = user?.status || "active";

  // Blocked user → do not allow any private route
  if (effectiveStatus === "blocked") {
    // You can redirect to a "blocked" info page if you create one
    return <Navigate to="/" replace />;
  }

  // Logged in + not blocked → allow child routes
  return <Outlet />;
};

export default PrivateRoute;
