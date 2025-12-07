// src/layouts/DashboardLayout.jsx
import React, { useState } from "react";
import { Outlet, Link } from "react-router";
import Sidebar from "../components/layout/Sidebar";
import useAuth from "../hooks/useAuth";

/**
 * DashboardLayout
 * - Shows a responsive sidebar (persistent on desktop, collapsible drawer on mobile)
 * - Topbar contains hamburger, page title slot, user avatar + dropdown
 * - Main content rendered via <Outlet />
 *
 * Place this file at: src/layouts/DashboardLayout.jsx
 */

export default function DashboardLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar for desktop & drawer for mobile */}
      <aside
        className={`bg-white border-r hidden md:block w-72 shrink-0`}
        aria-hidden={false}
      >
        <div className="h-full flex flex-col">
          <div className="px-6 py-5 border-b flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-bold">🩸</div>
            <div>
              <div className="text-lg font-semibold text-red-600">Response Team</div>
              <div className="text-xs text-gray-500">Dashboard</div>
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            <Sidebar />
          </div>
        </div>
      </aside>

      {/* Mobile drawer (slides over) */}
      <div className={`fixed inset-0 z-40 md:hidden transition-transform ${drawerOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="absolute inset-0 bg-black/40" onClick={() => setDrawerOpen(false)} />
        <div className="relative w-72 bg-white h-full border-r">
          <div className="px-6 py-5 border-b flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-bold">🩸</div>
            <div>
              <div className="text-lg font-semibold text-red-600">Response Team</div>
              <div className="text-xs text-gray-500">Dashboard</div>
            </div>
            <button className="ml-auto btn btn-ghost" onClick={() => setDrawerOpen(false)}>Close</button>
          </div>

          <div className="p-4">
            <Sidebar onNavigate={() => setDrawerOpen(false)} />
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="w-full bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {/* Mobile hamburger */}
                <button
                  className="md:hidden p-2 rounded-md hover:bg-gray-100"
                  onClick={() => setDrawerOpen(true)}
                  aria-label="Open menu"
                >
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>

                {/* Page title slot (you can replace with breadcrumb or dynamic title) */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Dashboard</h2>
                  <p className="text-sm text-gray-500">Manage requests, donors & funding</p>
                </div>
              </div>

              {/* Right-side user actions */}
              <div className="flex items-center gap-3">
                <Link to="/donation-requests" className="hidden sm:inline-block px-3 py-2 text-sm rounded hover:bg-gray-100">View Requests</Link>

                <div className="relative">
                  <button className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100" title="Account">
                    <img
                      src={user?.avatar || "https://via.placeholder.com/40"}
                      alt="avatar"
                      className="w-9 h-9 rounded-full object-cover border-2 border-red-600"
                    />
                    <div className="hidden sm:flex flex-col text-left">
                      <span className="text-sm font-medium">{user?.name || user?.email}</span>
                      <span className="text-xs text-gray-500 capitalize">{user?.role || "donor"}</span>
                    </div>
                  </button>

                  {/* Simple dropdown */}
                  <div className="absolute right-0 mt-2 w-44 bg-white border rounded shadow-md hidden group-hover:block">
                    {/* This dropdown is hidden by default; we provide quick links below outside hover logic for simplicity */}
                  </div>
                </div>

                <button
                  onClick={() => logout && logout()}
                  className="px-3 py-2 text-sm rounded bg-red-600 text-white hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
