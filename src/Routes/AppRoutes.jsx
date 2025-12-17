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
import ContentManagement from "../Pages/Dashboard/ContentManagement";


export const router = createBrowserRouter([
  // Public routes
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true, // "/"
        element: <Home />,
      },
      {
        path: "search", 
        element: <SearchDonors />,
        loader: () => fetch("/districts.json"),
      },
      {
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
        path: "donation-requests/:id",
        element: <RequestDetails />,
      },
    ],
  },

  // Dashboard – all private
  {
    path: "/dashboard",
    element: <PrivateRoute />, 
    children: [
      {
        element: <DashboardLayout />, 
        children: [
          {
            index: true,
            element: <DashboardHome />,
          },

          {
            path: "profile",
            element: <Profile />,
          },

          {
            path: "my-donation-requests",
            element: <MyDonationRequests />,
          },

          {
            path: "create-donation-request",
            element: <CreateDonationRequest />,
          },

          {
            path: "funding",
            element: <Funding />,
          },
          {
            path: "funding-success",
            element: <FundingSuccess />,
          },
          {
            path: "content-management",
            element:<ContentManagement/>,
          },

          // Admin-only routes
          {
            element: <AdminRoute />,
            children: [
              {
                path: "AllUsers",
                element: <AllUsers />,
              },
            ],
          },

          {
            path: "all-blood-donation-request",
            element: <AllDonationRequests />,
          },

        ],
      },
    ],
  },
]);
