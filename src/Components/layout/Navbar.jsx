import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router";
import useAuth from "../../hooks/useAuth";
import { 
  FiMenu, 
  FiX, 
  FiHeart, 
  FiSearch, 
  FiDollarSign,
  FiUser,
  FiLogOut,
  FiChevronDown,
  FiDroplet
} from "react-icons/fi";

export default function Navbar() {
  const { user, firebaseUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Detect scroll for navbar shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, []);

  const navLinkClass = ({ isActive }) =>
    `group relative flex items-center gap-2 px-4 py-2 font-medium transition-all duration-300 ${
      isActive
        ? "text-red-600"
        : "text-gray-600 hover:text-red-600"
    }`;

  const navLinks = (
    <>
      <NavLink to="donation-requests" className={navLinkClass}>
        <FiHeart className="text-lg" />
        <span>Donation Requests</span>
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-linear-to-r from-red-500 to-rose-600 group-hover:w-3/4 transition-all duration-300 rounded-full" />
      </NavLink>

      <NavLink to="/search" className={navLinkClass}>
        <FiSearch className="text-lg" />
        <span>Search Donors</span>
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-linear-to-r from-red-500 to-rose-600 group-hover:w-3/4 transition-all duration-300 rounded-full" />
      </NavLink>

      {user && (
        <NavLink to="/dashboard/funding" className={navLinkClass}>
          <FiDollarSign className="text-lg" />
          <span>Funding</span>
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-linear-to-r from-red-500 to-rose-600 group-hover:w-3/4 transition-all duration-300 rounded-full" />
        </NavLink>
      )}
    </>
  );

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl shadow-lg shadow-gray-200/50"
          : "bg-white/95 backdrop-blur-sm"
      }`}
    >
      {/* Top accent bar */}
      <div className="h-1 bg-linear-to-r from-red-600 via-rose-500 to-red-600" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-4">
          {/* Logo */}
          <Link to="/" className="group flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 bg-linear-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-200 group-hover:shadow-red-300 transition-all duration-300 group-hover:scale-105">
                <FiDroplet className="text-white text-2xl animate-pulse" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-linear-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                Response Team
              </span>
              <span className="text-xs text-gray-500 font-medium tracking-wider">
                SAVE LIVES TODAY
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-2">{navLinks}</div>

          {/* Right side (Login / Avatar) */}
          <div className="hidden lg:flex items-center gap-4">
            {!firebaseUser ? (
              <>
                <Link
                  to="/login"
                  className="group relative px-6 py-2.5 font-semibold text-red-600 rounded-xl overflow-hidden transition-all duration-300 hover:text-white"
                >
                  <span className="absolute inset-0 border-2 border-red-600 rounded-xl transition-all duration-300 group-hover:border-transparent" />
                  <span className="absolute inset-0 bg-linear-to-r from-red-600 to-rose-600 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  <span className="relative flex items-center gap-2">
                    <FiUser className="text-lg" />
                    Login
                  </span>
                </Link>

                <Link
                  to="/register"
                  className="group relative px-6 py-2.5 font-semibold text-white rounded-xl overflow-hidden shadow-lg shadow-red-200 hover:shadow-red-300 transition-all duration-300 hover:scale-105"
                >
                  <span className="absolute inset-0 bg-linear-to-r from-red-600 via-rose-600 to-red-600 bg-size-200 bg-pos-0 group-hover:bg-pos-100 transition-all duration-500" />
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white transition-all duration-300" />
                  <span className="relative flex items-center gap-2">
                    <FiHeart className="text-lg group-hover:animate-pulse" />
                    Join as Donor
                  </span>
                  {/* Glowing effect */}
                  <span className="absolute -inset-1 bg-linear-to-r from-red-600 to-rose-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition-all duration-300 -z-10" />
                </Link>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="group flex items-center gap-3 p-1.5 pr-4 rounded-full bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-red-200 transition-all duration-300"
                >
                  <div className="relative">
                    <img
                      src={user?.avatarUrl}
                      alt="avatar"
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-red-500 ring-offset-2"
                    />
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                  </div>
                  <div className="hidden xl:flex flex-col items-start">
                    <span className="text-sm font-semibold text-gray-700">
                      {user?.name?.split(" ")[0]}
                    </span>
                    <span className="text-xs text-gray-500">
                      {user?.bloodGroup || "Donor"}
                    </span>
                  </div>
                  <FiChevronDown
                    className={`text-gray-500 transition-transform duration-300 ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-20 animate-slideDown">
                      {/* User Info Header */}
                      <div className="px-5 py-4 bg-linear-to-r from-red-50 to-rose-50 border-b">
                        <p className="font-semibold text-gray-800">
                          {user?.name}
                        </p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                      </div>

                      <div className="p-2">
                        <Link
                          to="/dashboard"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-200"
                        >
                          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                            <FiUser className="text-red-600" />
                          </div>
                          <div>
                            <p className="font-medium">Dashboard</p>
                            <p className="text-xs text-gray-500">
                              Manage your account
                            </p>
                          </div>
                        </Link>

                        <hr className="my-2 border-gray-100" />

                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            import("firebase/auth").then(
                              ({ getAuth, signOut }) => {
                                signOut(getAuth());
                              }
                            );
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                        >
                          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                            <FiLogOut className="text-red-600" />
                          </div>
                          <div className="text-left">
                            <p className="font-medium">Sign Out</p>
                            <p className="text-xs text-gray-500">
                              See you again soon!
                            </p>
                          </div>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            className="lg:hidden relative w-12 h-12 flex items-center justify-center rounded-xl bg-gray-50 hover:bg-red-50 border border-gray-200 hover:border-red-200 transition-all duration-300"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <span
              className={`absolute w-6 h-0.5 bg-gray-700 transition-all duration-300 ${
                open ? "rotate-45" : "-translate-y-2"
              }`}
            />
            <span
              className={`absolute w-6 h-0.5 bg-gray-700 transition-all duration-300 ${
                open ? "opacity-0 scale-0" : ""
              }`}
            />
            <span
              className={`absolute w-6 h-0.5 bg-gray-700 transition-all duration-300 ${
                open ? "-rotate-45" : "translate-y-2"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${
          open ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-linear-to-b from-white to-gray-50 border-t">
          <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
            {/* Mobile Nav Links */}
            <div className="space-y-2">
              <NavLink
                to="/donation-requests"
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-4 py-3.5 rounded-xl font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-red-100 text-red-600 shadow-sm"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                <div className="w-10 h-10 bg-linear-to-br from-red-500 to-rose-500 rounded-lg flex items-center justify-center shadow-sm">
                  <FiHeart className="text-white text-lg" />
                </div>
                <span>Donation Requests</span>
              </NavLink>

              <NavLink
                to="/search"
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-4 py-3.5 rounded-xl font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-red-100 text-red-600 shadow-sm"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                <div className="w-10 h-10 bg-linear-to-br from-red-500 to-rose-500 rounded-lg flex items-center justify-center shadow-sm">
                  <FiSearch className="text-white text-lg" />
                </div>
                <span>Search Donors</span>
              </NavLink>

              {user && (
                <NavLink
                  to="/dashboard/funding"
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-4 px-4 py-3.5 rounded-xl font-medium transition-all duration-300 ${
                      isActive
                        ? "bg-red-100 text-red-600 shadow-sm"
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  <div className="w-10 h-10 bg-linear-to-br from-red-500 to-rose-500 rounded-lg flex items-center justify-center shadow-sm">
                    <FiDollarSign className="text-white text-lg" />
                  </div>
                  <span>Funding</span>
                </NavLink>
              )}
            </div>

            <hr className="border-gray-200" />

            {/* Mobile Auth Section */}
            {!firebaseUser ? (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-red-600 text-red-600 rounded-xl font-semibold hover:bg-red-50 transition-all duration-300"
                >
                  <FiUser />
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-linear-to-r from-red-600 to-rose-600 text-white rounded-xl font-semibold shadow-lg shadow-red-200 hover:shadow-red-300 transition-all duration-300"
                >
                  <FiHeart />
                  Join Now
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={user?.avatarUrl}
                      alt="avatar"
                      className="w-14 h-14 rounded-xl object-cover ring-2 ring-red-500 ring-offset-2"
                    />
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-800">{user?.name}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                    {user?.bloodGroup && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-red-100 text-red-600 text-xs font-bold rounded-full">
                        {user?.bloodGroup}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <Link
                    to="/dashboard"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all duration-300"
                  >
                    <FiUser />
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setOpen(false);
                      import("firebase/auth").then(({ getAuth, signOut }) => {
                        signOut(getAuth());
                      });
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-100 text-red-600 rounded-xl font-medium hover:bg-red-200 transition-all duration-300"
                  >
                    <FiLogOut />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}