import React, { useState, useCallback } from "react";
import { Outlet } from "react-router";
import Sidebar from "../Components/layout/Sidebar";

export default function DashboardLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleNavigateFromSidebar = useCallback(() => {
    setDrawerOpen(false);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar (fixed) */}
      <div className="hidden lg:block lg:w-64 lg:flex-shrink-0">
        <div className="h-screen sticky top-0">
          <Sidebar onNavigate={handleNavigateFromSidebar} />
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {drawerOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-64 bg-white shadow-2xl">
            <Sidebar onNavigate={handleNavigateFromSidebar} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="lg:hidden p-4 border-b border-gray-200 bg-white">
          <button
            onClick={() => setDrawerOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {/* A simple hamburger icon (you can pick a different one if preferred) */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}