// src/layouts/DashboardLayout.jsx
import React, { useState, useCallback } from "react";
import { Outlet, Link, useNavigate } from "react-router";
import Sidebar from "../components/layout/Sidebar";
import useAuth from "../hooks/useAuth";

/**
 * DashboardLayout
 * - Responsive sidebar (desktop persistent / mobile drawer)
 * - Topbar with hamburger, title, user avatar + dropdown
 * - Main content rendered via <Outlet />
 */

const avatarDataUrl = (name = "U") => {
  const letter = encodeURIComponent((name || "U").charAt(0).toUpperCase());
  const bg = encodeURIComponent("#ef4444");
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'><rect width='100%' height='100%' fill='${bg}'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='28' fill='white' font-family='Arial, Helvetica, sans-serif'>${letter}</text></svg>`;
  return `data:image/svg+xml;utf8,${svg}`;
};

export default function DashboardLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [acctOpen, setAcctOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Logout handler: await logout and redirect to home (so dashboard doesn't remain visible)
  const handleLogout = useCallback(async () => {
    try {
      if (typeof logout === "function") {
        await logout();
      }
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      // always redirect to safe place
      navigate("/", { replace: true });
    }
  }, [logout, navigate]);

  // Called when a nav link is clicked in mobile drawer to close it.
  const handleNavigateFromSidebar = useCallback(() => {
    setDrawerOpen(false);
    setAcctOpen(false);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop sidebar */}
      <aside className="bg-white border-r hidden md:flex md:flex-col w-72 shrink-0" aria-hidden={false}>
        {/* <div className="px-6 py-5 border-b flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-bold">🩸</div>
          <div>
            <div className="text-lg font-semibold text-red-600">Response Team</div>
            <div className="text-xs text-gray-500">Dashboard</div>
          </div>
        </div> */}

        <div className="flex-1 overflow-auto">
          {/* Sidebar can accept onNavigate prop; if it doesn't, it's ignored */}
          <Sidebar onNavigate={handleNavigateFromSidebar} />
        </div>

        {/* <div className="px-4 py-4 border-t">
          <div className="flex items-center gap-3">
            <img
              src={user?.avatar || avatarDataUrl(user?.name)}
              alt="avatar"
              className="w-10 h-10 rounded-full object-cover border-2 border-red-600"
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">{user?.name || user?.email}</p>
              <p className="text-xs text-gray-500">Role: <span className="capitalize">{user?.role}</span></p>
            </div>
          </div>
          {user?.status === "blocked" && (
            <p className="mt-3 text-xs text-red-600">Your account is <strong>blocked</strong>. Contact admin.</p>
          )}
        </div> */}
      </aside>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-transform ${drawerOpen ? "translate-x-0" : "-translate-x-full"}`}
        aria-hidden={!drawerOpen}
      >
        <div className="absolute inset-0 bg-black/40" onClick={() => setDrawerOpen(false)} />
        <div className="relative w-72 bg-white h-full border-r">
          {/* <div className="px-6 py-5 border-b flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-bold">🩸</div>
            <div>
              <div className="text-lg font-semibold text-red-600">Response Team</div>
              <div className="text-xs text-gray-500">Dashboard</div>
            </div>
            <button className="ml-auto px-3 py-1 rounded-md hover:bg-gray-100" onClick={() => setDrawerOpen(false)}>Close</button>
          </div> */}

          <div className="p-4 h-full overflow-auto">
            <Sidebar onNavigate={handleNavigateFromSidebar} />
          </div>

          {/* <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
            <div className="flex items-center gap-3">
              <img src={user?.avatar || avatarDataUrl(user?.name)} alt="avatar" className="w-10 h-10 rounded-full border-2 border-red-600" />
              <div className="flex-1">
                <div className="text-sm font-medium">{user?.name || user?.email}</div>
                <div className="text-xs text-gray-500">Role: <span className="capitalize">{user?.role}</span></div>
              </div>
              <button onClick={handleLogout} className="px-3 py-2 rounded bg-red-600 text-white">Logout</button>
            </div>
          </div> */}
        </div>
      </div>

      {/* Main content */}
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

                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Dashboard</h2>
                  <p className="text-sm text-gray-500">Manage requests, donors & funding</p>
                </div>
              </div>

              {/* Right-side */}
              <div className="flex items-center gap-3">
                <Link to="/donation-requests" className="hidden sm:inline-block px-3 py-2 text-sm rounded hover:bg-gray-100">View Requests</Link>

                <div className="relative">
                  <button
                    onClick={() => setAcctOpen((s) => !s)}
                    className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100"
                    aria-expanded={acctOpen}
                    aria-haspopup="true"
                  >
                    <img
                      src={user?.avatar || avatarDataUrl(user?.name)}
                      alt="avatar"
                      className="w-9 h-9 rounded-full object-cover border-2 border-red-600"
                    />
                    <div className="hidden sm:flex flex-col text-left">
                      <span className="text-sm font-medium">{user?.name || user?.email}</span>
                      <span className="text-xs text-gray-500 capitalize">{user?.role || "donor"}</span>
                    </div>
                  </button>

                  {/* Dropdown */}
                  {acctOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-md z-50">
                      <Link
                        to="/dashboard/profile"
                        className="block px-3 py-2 text-sm hover:bg-gray-50"
                        onClick={() => setAcctOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        to="/dashboard/my-donation-requests"
                        className="block px-3 py-2 text-sm hover:bg-gray-50"
                        onClick={() => setAcctOpen(false)}
                      >
                        My Requests
                      </Link>
                      <div className="border-t" />
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>

                {/* Primary logout CTA for larger screens */}
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 text-sm rounded bg-red-600 text-white hover:bg-red-700 hidden md:inline-block"
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
