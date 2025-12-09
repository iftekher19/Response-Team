import React from "react";
import { createBrowserRouter } from "react-router";

import Home from "../Pages/Home/Home";
import RootLayout from "../Layouts/RootLayout";
import AuthLayout from "../Layouts/AuthLayout";
import Register from "../Pages/Auth/Register/Register";
import Login from "../Pages/Auth/Login/Login";
import DashboardLayout from "../Layouts/DashboardLayout";
import DashboardHome from "../Pages/Dashboard/DashboardHome";
import Profile from "../Pages/Dashboard/Profile";
import MyDonationRequests from "../Pages/Dashboard/MyDonationRequests";
import CreateDonationRequest from "../Pages/Dashboard/CreateDonationRequest";
import Funding from "../Pages/Dashboard/Funding";
import SearchDonors from "../Pages/Search/SearchDonors";
import AllRequests from "../Pages/DonationRequests/AllRequests";
import RequestDetails from "../Pages/DonationRequests/RequestDetails";
import AllUsers from "../Pages/Dashboard/AllUsers";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home
      },

    ],
  },
  {
    path: '/',
    Component: AuthLayout,
    children: [
      {
        path: 'login',
        Component: Login
      },
      {
        path: 'register',
        Component: Register,
        loader: () => fetch('/districts.json').then(res => res.json())
      }
    ]
  },
  {
    path: '/',
    Component: DashboardLayout,
    children: [
      {
        path: 'dashboard',
        Component: DashboardHome
      },
      {
        path: 'dashboard/profile',
        Component: Profile
      },
      {
        path: 'dashboard/my-donation-requests',
        Component:MyDonationRequests
      },
      {
        path: 'dashboard/create-donation-request',
        Component:CreateDonationRequest
      },
      {
        path:'dashboard/funds',
        Component:Funding
      },
      {
        path:'search',
        Component:SearchDonors
      },
      {
        path:'all-requests',
        Component:AllRequests
      },
      {
        path: "donation-requests/:id",
        element: <RequestDetails/>
      },
      {
        path:"AllUsers",
        Component:AllUsers
      }
    ]
  },  
]);
