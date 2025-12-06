import React, { useState } from "react";
import { Link, NavLink } from "react-router";
import useAuth from "../../hooks/useAuth";
import { FiMenu, FiX } from "react-icons/fi";

export default function Navbar() {
  const { user, firebaseUser } = useAuth();
  const [open, setOpen] = useState(false);

  const navLinks = (
    <>
      <NavLink
        to="/donation-requests"
        className={({ isActive }) =>
          `px-3 py-2 rounded-md font-medium ${
            isActive ? "text-red-600" : "text-gray-700 hover:text-red-600"
          }`
        }
      >
        Donation Requests
      </NavLink>

      <NavLink
        to="/search"
        className={({ isActive }) =>
          `px-3 py-2 rounded-md font-medium ${
            isActive ? "text-red-600" : "text-gray-700 hover:text-red-600"
          }`
        }
      >
        Search Donors
      </NavLink>

      {user && (
        <NavLink
          to="/dashboard/funding"
          className={({ isActive }) =>
            `px-3 py-2 rounded-md font-medium ${
              isActive ? "text-red-600" : "text-gray-700 hover:text-red-600"
            }`
          }
        >
          Funding
        </NavLink>
      )}
    </>
  );

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-red-600">🩸 Response Team</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">{navLinks}</div>

        {/* Right side (Login / Avatar) */}
        <div className="hidden md:flex items-center gap-4">
          {!firebaseUser ? (
            <>
              <Link
                to="/login"
                className="px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                Join as Donor
              </Link>
            </>
          ) : (
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="cursor-pointer">
                <img
                  src={user?.avatarUrl}
                  alt="avatar"
                  className="w-10 h-10 rounded-full border-2 border-red-600 object-cover"
                />
              </label>

              <ul
                tabIndex={0}
                className="dropdown-content menu p-3 mt-3 shadow bg-white rounded-md w-52 border"
              >
                <li>
                  <Link to="/dashboard" className="font-medium">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => {
                      import("firebase/auth").then(({ getAuth, signOut }) => {
                        signOut(getAuth());
                      });
                    }}
                    className="text-red-600 font-semibold"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="md:hidden text-2xl text-red-600"
          onClick={() => setOpen(!open)}
        >
          {open ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white border-t shadow-sm pb-4">
          <div className="flex flex-col px-4 gap-3 mt-3">
            {navLinks}

            {!firebaseUser ? (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 border border-red-600 text-red-600 rounded-md text-center"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-red-600 text-white rounded-md text-center"
                >
                  Join as Donor
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-3 mt-2">
                <img
                  src={user?.avatarUrl}
                  className="w-10 h-10 rounded-full object-cover border-2 border-red-600"
                />
                <div>
                  <p className="font-semibold">{user?.name}</p>
                  <Link
                    to="/dashboard"
                    onClick={() => setOpen(false)}
                    className="text-red-600 text-sm"
                  >
                    Dashboard →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
