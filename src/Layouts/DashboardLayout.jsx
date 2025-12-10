// src/layouts/DashboardLayout.jsx
import React, { useState, useCallback } from "react";
import { Outlet, Link, useNavigate } from "react-router";
import { FiMenu, FiX, FiBell, FiChevronDown, FiUser, FiList, FiLogOut } from "react-icons/fi";
import Sidebar from "../components/layout/Sidebar";
import useAuth from "../hooks/useAuth";

export default function DashboardLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [acctOpen, setAcctOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = useCallback(async () => {
    try {
      if (typeof logout === "function") await logout();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      navigate("/", { replace: true });
    }
  }, [logout, navigate]);

  const handleNavigateFromSidebar = useCallback(() => {
    setDrawerOpen(false);
    setAcctOpen(false);
  }, []);

  const getAvatar = (u) => {
    if (u?.avatar || u?.avatarUrl) return u.avatar || u.avatarUrl;
    const name = (u?.name || u?.email || "U").trim();
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=dc2626&color=fff&bold=true`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar - Fixed */}
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
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between gap-4">
              {/* Left Side */}
              <div className="flex items-center gap-4">
                {/* Mobile Menu Button */}
                <button
                  className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={() => setDrawerOpen(true)}
                >
                  <FiMenu className="w-6 h-6 text-gray-600" />
                </button>

                {/* Page Title */}
                <div className="hidden sm:block">
                  <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
                  <p className="text-sm text-gray-500">Manage your activities</p>
                </div>
              </div>

              {/* Right Side */}
              <div className="flex items-center gap-2 sm:gap-4">
                {/* Quick Link */}
                <Link
                  to="/donation-requests"
                  className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  View Requests
                </Link>

                {/* Notifications */}
                <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
                  <FiBell className="w-5 h-5 text-gray-600" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                </button>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setAcctOpen(!acctOpen)}
                    className="flex items-center gap-3 p-1.5 pr-3 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <img
                      src={getAvatar(user)}
                      alt="avatar"
                      className="w-9 h-9 rounded-lg object-cover ring-2 ring-gray-100"
                    />
                    <div className="hidden sm:block text-left">
                      <p className="text-sm font-medium text-gray-900 truncate max-w-[120px]">
                        {user?.name || user?.email?.split("@")[0]}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">{user?.role || "donor"}</p>
                    </div>
                    <FiChevronDown className={`hidden sm:block w-4 h-4 text-gray-400 transition-transform ${acctOpen ? "rotate-180" : ""}`} />
                  </button>

                  {/* Dropdown */}
                  {acctOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setAcctOpen(false)} />
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-20">
                        {/* User Info */}
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>

                        <div className="py-1">
                          <Link
                            to="/dashboard/profile"
                            onClick={() => setAcctOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <FiUser className="w-4 h-4" />
                            Profile
                          </Link>
                          <Link
                            to="/dashboard/my-donation-requests"
                            onClick={() => setAcctOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <FiList className="w-4 h-4" />
                            My Requests
                          </Link>
                        </div>

                        <div className="border-t border-gray-100 pt-1">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                          >
                            <FiLogOut className="w-4 h-4" />
                            Logout
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}