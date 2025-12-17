import React from "react";
import { Outlet } from "react-router";
import Navbar from "../Components/layout/Navbar";
import Footer from "../Components/layout/Footer";

const RootLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default RootLayout;
