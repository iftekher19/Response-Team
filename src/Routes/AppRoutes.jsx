// src/Routes/AppRoutes.jsx
import React from "react";
import { createBrowserRouter } from "react-router";

import RootLayout from "../Layouts/RootLayout";
import AuthLayout from "../Layouts/AuthLayout";
import DashboardLayout from "../Layouts/DashboardLayout";

import Home from "../Pages/Home/Home";
import Register from "../Pages/Auth/Register/Register";
import Login from "../Pages/Auth/Login/Login";

import DashboardHome from "../Pages/Dashboard/DashboardHome";
import Profile from "../Pages/Dashboard/Profile";
import MyDonationRequests from "../Pages/Dashboard/MyDonationRequests";
import CreateDonationRequest from "../Pages/Dashboard/CreateDonationRequest";
import Funding from "../Pages/Dashboard/Funding";
import AllUsers from "../Pages/Dashboard/AllUsers";
import AllDonationRequests from "../Pages/Dashboard/AllDonationRequests";

import SearchDonors from "../Pages/Search/SearchDonors";
import AllRequests from "../Pages/DonationRequests/AllRequests";
import RequestDetails from "../Pages/DonationRequests/RequestDetails"
import PrivateRoute from "../Routes/Guards/PrivateRoute";
import AdminRoute from "../Routes/Guards/AdminRoute";
import DonationRequests from "../Pages/Dashboard/DonationRequests";
import FundingSuccess from "../Pages/Dashboard/FundingSuccess";
// import VolunteerRoute from "../Guards/VolunteerRoute"; // when you need it

export const router = createBrowserRouter([
  // Public site (root layout)
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true, // "/"
        element: <Home />,
      },
      {
        path: "search", // "/search"
        element: <SearchDonors />,
        loader: () => fetch("/districts.json"),
      },
      {
        // public list of all PENDING blood donation requests
        // assignment route: /donation-requests
        path: "donation-requests",
        element: <DonationRequests />,
      },
    ],
  },

  // Auth pages (public)
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
        loader: () => fetch("/districts.json").then((res) => res.json()),
      },
    ],
  },

  // Private route that is outside dashboard layout: details page
  {
    element: <PrivateRoute />,
    children: [
      {
        // "/donation-requests/:id" – private details
        path: "donation-requests/:id",
        element: <RequestDetails />,
      },
    ],
  },

  // Dashboard – all private
  {
    path: "/dashboard",
    element: <PrivateRoute />, // user must be logged in & active
    children: [
      {
        element: <DashboardLayout />, // layout with sidebar
        children: [
          // /dashboard
          {
            index: true,
            element: <DashboardHome />,
          },

          // /dashboard/profile
          {
            path: "profile",
            element: <Profile />,
          },

          // Donor features
          // /dashboard/my-donation-requests
          {
            path: "my-donation-requests",
            element: <MyDonationRequests />,
          },

          // /dashboard/create-donation-request
          {
            path: "create-donation-request",
            element: <CreateDonationRequest />,
          },

          // Funding (any authenticated user)
          // /dashboard/funds
          {
            path: "funding",
            element: <Funding />,
          },
          {
            path: "funding-success",
            element: <FundingSuccess />,
          },

          // Admin-only routes
          {
            element: <AdminRoute />,
            children: [
              // /dashboard/all-users
              {
                path: "AllUsers",
                element: <AllUsers />,
              },
            ],
          },

          // /dashboard/all-blood-donation-request
          // Admin + Volunteer share this page
          // Inside <AllDonationRequests /> you will check user.role:
          // - admin: full CRUD + status
          // - volunteer: only update status
          {
            path: "all-blood-donation-request",
            element: <AllDonationRequests />,
          },

          // Example if later you add volunteer-only pages:
          // {
          //   element: <VolunteerRoute />,
          //   children: [
          //     { path: "volunteer-only-page", element: <VolunteerPage /> }
          //   ]
          // },
        ],
      },
    ],
  },
]);
