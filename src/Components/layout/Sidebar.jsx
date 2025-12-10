// src/components/Sidebar.jsx
import React, { useState } from "react";
import { NavLink, useNavigate, Link } from "react-router";
import useAuth from "../../hooks/useAuth";
import { getAuth, signOut as firebaseSignOut } from "firebase/auth";
import {
  FiHome,
  FiUser,
  FiPlus,
  FiList,
  FiSearch,
  FiUsers,
  FiDollarSign,
  FiLogOut,
  FiLogIn,
  FiChevronLeft,
  FiChevronRight,
  FiDroplet,
  FiHeart,
  FiSettings,
  FiHelpCircle,
  FiFileText,
} from "react-icons/fi";

export default function Sidebar({ collapsed, setCollapsed }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(collapsed || false);

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await firebaseSignOut(auth);
      localStorage.removeItem("appToken");
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    if (setCollapsed) setCollapsed(!isCollapsed);
  };

  // Menu Configuration
  const commonLinks = [
    { to: "/dashboard", label: "Dashboard", icon: FiHome },
    { to: "/dashboard/profile", label: "Profile", icon: FiUser },
    { to: "/dashboard/create-donation-request", label: "Create Request", icon: FiPlus },
    { to: "/dashboard/my-donation-requests", label: "My Requests", icon: FiList },
  ];

  const volunteerLinks = [
    { to: "/dashboard/all-blood-donation-request", label: "All Requests", icon: FiFileText },
  ];

  const adminLinks = [
    { to: "AllUsers", label: "All Users", icon: FiUsers },
    { to: "/dashboard/content-management", label: "Content", icon: FiSettings },
  ];

  const fundingLink = { to: "/dashboard/funding", label: "Funding", icon: FiDollarSign };

  // Role badge colors
  const getRoleBadge = (role) => {
    const badges = {
      admin: { bg: "bg-purple-100", text: "text-purple-700", label: "Admin" },
      volunteer: { bg: "bg-blue-100", text: "text-blue-700", label: "Volunteer" },
      donor: { bg: "bg-green-100", text: "text-green-700", label: "Donor" },
    };
    return badges[role] || badges.donor;
  };

  // Avatar fallback
  const getAvatar = (u) => {
    if (u?.avatar || u?.avatarUrl) return u.avatar || u.avatarUrl;
    const name = (u?.name || u?.email || "U").trim();
    const initial = name.charAt(0).toUpperCase();
    return `https://ui-avatars.com/api/?name=${initial}&background=dc2626&color=fff&bold=true`;
  };

  const NavItem = ({ to, label, icon: Icon, end = false }) => (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
          isActive
            ? "bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg shadow-red-200"
            : "text-gray-600 hover:bg-red-50 hover:text-red-600"
        } ${isCollapsed ? "justify-center" : ""}`
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            className={`text-xl flex-shrink-0 ${
              isActive ? "text-white" : "text-gray-400 group-hover:text-red-500"
            }`}
          />
          {!isCollapsed && (
            <span className="font-medium text-sm">{label}</span>
          )}
          {isCollapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
              {label}
            </div>
          )}
        </>
      )}
    </NavLink>
  );

  const SectionTitle = ({ children }) =>
    !isCollapsed ? (
      <p className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
        {children}
      </p>
    ) : (
      <div className="my-2 mx-3 border-t border-gray-200" />
    );

  return (
    <aside
      className={`h-screen sticky top-0 flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3"}`}>
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-200 flex-shrink-0">
              <FiDroplet className="text-white text-xl" />
            </div>
            {!isCollapsed && (
              <div>
                <h3 className="text-lg font-bold text-gray-900">Response</h3>
                <p className="text-xs text-gray-500 -mt-0.5">Blood Donation</p>
              </div>
            )}
          </Link>
        </div>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={toggleCollapse}
        className="absolute -right-3 top-20 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:shadow-md hover:border-red-300 transition-all z-10"
      >
        {isCollapsed ? (
          <FiChevronRight className="text-gray-500 text-sm" />
        ) : (
          <FiChevronLeft className="text-gray-500 text-sm" />
        )}
      </button>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {user ? (
          <>
            {/* Main Menu */}
            <SectionTitle>Menu</SectionTitle>
            {commonLinks.map((link) => (
              <NavItem
                key={link.to}
                to={link.to}
                label={link.label}
                icon={link.icon}
                end={link.to === "/dashboard"}
              />
            ))}

            {/* Quick Actions */}
            <SectionTitle>Quick Actions</SectionTitle>
            <NavItem to="/search" label="Search Donors" icon={FiSearch} />
            <NavItem to="/dashboard/all-blood-donation-request" label="Browse Requests" icon={FiHeart} />

            {/* Volunteer/Admin Section */}
            {(user.role === "volunteer" || user.role === "admin") && (
              <>
                <SectionTitle>Management</SectionTitle>
                {volunteerLinks.map((link) => (
                  <NavItem key={link.to} to={link.to} label={link.label} icon={link.icon} />
                ))}
                {user.role === "admin" &&
                  adminLinks.map((link) => (
                    <NavItem key={link.to} to={link.to} label={link.label} icon={link.icon} />
                  ))}
              </>
            )}

            {/* Funding - for logged in users */}
            <SectionTitle>Support</SectionTitle>
            <NavItem to={fundingLink.to} label={fundingLink.label} icon={fundingLink.icon} />
          </>
        ) : (
          <>
            {/* Public Links */}
            <SectionTitle>Explore</SectionTitle>
            <NavItem to="/" label="Home" icon={FiHome} />
            <NavItem to="/search" label="Search Donors" icon={FiSearch} />
            <NavItem to="/donation-requests" label="Donation Requests" icon={FiHeart} />
          </>
        )}
      </nav>

      {/* Help Link */}
      <div className="p-3 border-t border-gray-100">
        <NavItem to="/help" label="Help & Support" icon={FiHelpCircle} />
      </div>

      {/* User Section */}
      <div className="p-3 border-t border-gray-100">
        {user ? (
          <div
            className={`${
              isCollapsed ? "flex flex-col items-center gap-2" : "flex items-center gap-3"
            }`}
          >
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <img
                src={getAvatar(user)}
                alt={user?.name || "User"}
                className="w-10 h-10 rounded-xl object-cover ring-2 ring-red-100"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
            </div>

            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.name || user?.email?.split("@")[0]}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span
                    className={`inline-flex items-center px-1.5 py-0.5 text-[10px] font-semibold rounded ${
                      getRoleBadge(user?.role).bg
                    } ${getRoleBadge(user?.role).text}`}
                  >
                    {getRoleBadge(user?.role).label}
                  </span>
                  {user?.bloodGroup && (
                    <span className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-bold rounded bg-red-100 text-red-600">
                      {user.bloodGroup}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              title="Logout"
              className={`p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors ${
                isCollapsed ? "mt-1" : ""
              }`}
            >
              <FiLogOut className="text-lg" />
            </button>
          </div>
        ) : (
          <div className={`${isCollapsed ? "flex flex-col items-center gap-2" : ""}`}>
            {!isCollapsed && (
              <p className="text-xs text-gray-500 mb-2">Join our community</p>
            )}
            <button
              onClick={() => navigate("/login")}
              className={`flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl font-medium shadow-lg shadow-red-200 hover:shadow-red-300 transition-all ${
                isCollapsed ? "w-10 h-10 p-0" : "w-full py-2.5 px-4"
              }`}
            >
              <FiLogIn className="text-lg" />
              {!isCollapsed && <span>Login</span>}
            </button>
          </div>
        )}

        {/* Blocked Warning */}
        {user?.status === "blocked" && !isCollapsed && (
          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-xs text-red-600">
              ⚠️ Account blocked. Contact admin.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}