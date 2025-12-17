import React, { useEffect, useState } from "react";
import useAxios from "../../hooks/useAxios";
import useAuth from "../../hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiUsers, FiSearch, FiShield, FiUserCheck, 
  FiUserX, FiLoader, FiAlertCircle 
} from "react-icons/fi";
import { FaCrown, FaHandsHelping, FaHeart } from "react-icons/fa";

export default function AllUsers() {
  const axiosSecure = useAxios();
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const params = statusFilter ? { status: statusFilter } : {};
        const res = await axiosSecure.get("/users", { params });
        let payload = res?.data?.data || res?.data || [];
        if (mounted) setUsers(Array.isArray(payload) ? payload : []);
      } catch (err) {
        console.error("AllUsers load error", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    if (user?.role === "admin") load();
    return () => { mounted = false; };
  }, [axiosSecure, statusFilter, user?.role]);

  // Permission checks
  if (!user) return <MessageBox icon={FiAlertCircle} message="Please login to continue." />;
  if (user.role !== "admin") return <MessageBox icon={FiShield} message="Admin access required." />;

  const changeRole = async (id, newRole) => {
    try {
      await axiosSecure.patch(`/users/${id}/role`, { role: newRole });
      setUsers(p => p.map(u => (u._id === id ? { ...u, role: newRole } : u)));
    } catch (err) {
      alert("Could not change role");
    }
  };

  const changeStatus = async (id, newStatus) => {
    try {
      await axiosSecure.patch(`/users/${id}/status`, { status: newStatus });
      setUsers(p => p.map(u => (u._id === id ? { ...u, status: newStatus } : u)));
    } catch (err) {
      alert("Could not change status");
    }
  };

  // Filter users
  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50/30 p-4 md:p-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/30">
            <FiUsers className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">All Users</h1>
            <p className="text-sm text-gray-500">{users.length} total users</p>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
          />
        </div>
        <select
          className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 bg-white"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </select>
      </motion.div>

      {/* Table */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
      >
        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-500">
            <FiLoader className="w-6 h-6 animate-spin mr-2" />
            Loading users...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {["User", "Email", "Role", "Status", "Actions"].map((h) => (
                    <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                <AnimatePresence>
                  {filteredUsers.map((u, idx) => (
                    <motion.tr
                      key={u._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="hover:bg-red-50/30 transition-colors"
                    >
                      {/* User */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={u.avatar || `https://ui-avatars.com/api/?name=${u.name}&background=ef4444&color=fff`}
                            alt=""
                            className="w-10 h-10 rounded-full object-cover border-2 border-gray-100"
                          />
                          <span className="font-medium text-gray-800">{u.name}</span>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-6 py-4 text-gray-600 text-sm">{u.email}</td>

                      {/* Role */}
                      <td className="px-6 py-4">
                        <RoleBadge role={u.role} />
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <StatusBadge status={u.status} />
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {u.status === "active" ? (
                            <ActionBtn 
                              onClick={() => changeStatus(u._id, "blocked")}
                              variant="danger"
                              icon={<FiUserX className="w-3.5 h-3.5" />}
                            >
                              Block
                            </ActionBtn>
                          ) : (
                            <ActionBtn 
                              onClick={() => changeStatus(u._id, "active")}
                              variant="success"
                              icon={<FiUserCheck className="w-3.5 h-3.5" />}
                            >
                              Unblock
                            </ActionBtn>
                          )}
                          
                          {u.role !== "volunteer" && (
                            <ActionBtn onClick={() => changeRole(u._id, "volunteer")}>
                              Make Volunteer
                            </ActionBtn>
                          )}
                          {u.role !== "admin" && (
                            <ActionBtn onClick={() => changeRole(u._id, "admin")} variant="primary">
                             Make Admin
                            </ActionBtn>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No users found.
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}

/* ---------- Helper Components ---------- */

const MessageBox = ({ icon: Icon, message }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
      <Icon className="w-12 h-12 text-red-500 mx-auto mb-4" />
      <p className="text-gray-600">{message}</p>
    </div>
  </div>
);

const RoleBadge = ({ role }) => {
  const config = {
    admin: { bg: "bg-purple-100 text-purple-700", icon: <FaCrown className="w-3 h-3" /> },
    volunteer: { bg: "bg-blue-100 text-blue-700", icon: <FaHandsHelping className="w-3 h-3" /> },
    donor: { bg: "bg-red-100 text-red-700", icon: <FaHeart className="w-3 h-3" /> },
  };
  const c = config[role] || { bg: "bg-gray-100 text-gray-700", icon: null };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${c.bg}`}>
      {c.icon}
      <span className="capitalize">{role}</span>
    </span>
  );
};

const StatusBadge = ({ status }) => {
  const isActive = status === "active";
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
      isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-green-500" : "bg-gray-400"}`} />
      <span className="capitalize">{status}</span>
    </span>
  );
};

const ActionBtn = ({ children, onClick, variant = "default", icon }) => {
  const variants = {
    default: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    primary: "bg-purple-100 text-purple-700 hover:bg-purple-200",
    success: "bg-green-100 text-green-700 hover:bg-green-200",
    danger: "bg-red-100 text-red-700 hover:bg-red-200",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${variants[variant]}`}
    >
      {icon}
      {children}
    </motion.button>
  );
};