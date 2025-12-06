import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { getAuth, signOut } from "firebase/auth";
import {
  AiOutlineHome,
  AiOutlineUser,
  AiOutlinePlus,
  AiOutlineUnorderedList,
  AiOutlineSearch,
} from "react-icons/ai";
import { FaUsers, FaDonate } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";

/*
  Sidebar.jsx
  - Role-based menu: donor, volunteer, admin
  - Uses NavLink to apply active styles
  - Fire-and-forget signOut via firebase/auth
*/

export default function Sidebar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      // After sign out, redirect to home
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // Common links for all authenticated users (donor/volunteer/admin)
  const commonLinks = [
    {
      to: "/dashboard",
      label: "Dashboard",
      icon: <AiOutlineHome className="text-lg" />,
    },
    {
      to: "/dashboard/profile",
      label: "Profile",
      icon: <AiOutlineUser className="text-lg" />,
    },
    {
      to: "/dashboard/create-donation-request",
      label: "Create Request",
      icon: <AiOutlinePlus className="text-lg" />,
    },
    {
      to: "/dashboard/my-donation-requests",
      label: "My Requests",
      icon: <AiOutlineUnorderedList className="text-lg" />,
    },
    {
      to: "/search",
      label: "Search Donors",
      icon: <AiOutlineSearch className="text-lg" />,
    },
  ];

  // Volunteer/admin link: view all donation requests (volunteer can only update status)
  const volunteerLinks = [
    {
      to: "/dashboard/all-blood-donation-request",
      label: "All Donation Requests",
      icon: <AiOutlineUnorderedList className="text-lg" />,
    },
  ];

  // Admin-only links
  const adminLinks = [
    {
      to: "/dashboard/all-users",
      label: "All Users",
      icon: <FaUsers className="text-lg" />,
    },
    {
      to: "/dashboard/funding",
      label: "Funding",
      icon: <FaDonate className="text-lg" />,
    },
  ];

  // Helper for active class
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
      isActive ? "bg-red-50 text-red-600 font-semibold" : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <div className="h-full flex flex-col justify-between bg-white">
      <div>
        {/* Brand */}
        <div className="px-4 py-6 flex items-center gap-3 border-b">
          <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-bold">
            🩸
          </div>
          <div>
            <h3 className="text-lg font-semibold text-red-600">Response Team</h3>
            <p className="text-xs text-gray-500">Blood Donation</p>
          </div>
        </div>

        {/* Menu */}
        <nav className="px-2 py-4 space-y-1">
          {commonLinks.map((ln) => (
            <NavLink key={ln.to} to={ln.to} className={linkClass}>
              <span className="text-red-600">{ln.icon}</span>
              <span>{ln.label}</span>
            </NavLink>
          ))}

          {/* Volunteer/Admin shared */}
          {(user?.role === "volunteer" || user?.role === "admin") &&
            volunteerLinks.map((ln) => (
              <NavLink key={ln.to} to={ln.to} className={linkClass}>
                <span className="text-red-600">{ln.icon}</span>
                <span>{ln.label}</span>
              </NavLink>
            ))}

          {/* Admin only */}
          {user?.role === "admin" &&
            adminLinks.map((ln) => (
              <NavLink key={ln.to} to={ln.to} className={linkClass}>
                <span className="text-red-600">{ln.icon}</span>
                <span>{ln.label}</span>
              </NavLink>
            ))}

          {/* Small separator */}
          <div className="my-4 border-t" />
        </nav>
      </div>

      {/* Footer area: user info + logout */}
      <div className="px-4 py-4 border-t">
        <div className="flex items-center gap-3">
          <img
            src={user?.avatarUrl || "https://via.placeholder.com/40?text=User"}
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover border-2 border-red-600"
          />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-800">{user?.name || user?.email}</p>
            <p className="text-xs text-gray-500">Role: <span className="capitalize">{user?.role}</span></p>
          </div>

          <button
            onClick={handleLogout}
            title="Logout"
            className="p-2 rounded-md hover:bg-gray-100 text-red-600"
          >
            <FiLogOut className="text-lg" />
          </button>
        </div>

        {/* Blocked notice */}
        {user?.status === "blocked" && (
          <p className="mt-3 text-xs text-red-600">
            Your account is <strong>blocked</strong>. Contact admin for help.
          </p>
        )}
      </div>
    </div>
  );
}
