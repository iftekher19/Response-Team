import React from "react";
import { createBrowserRouter } from "react-router";

import Home from "../Pages/Home/Home";
import RootLayout from "../Layouts/RootLayout";

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
]);
