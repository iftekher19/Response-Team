import React, { useEffect, useState } from "react";
import useAxios from "../../hooks/useAxios";
import { toast } from "react-hot-toast";
import AOS from "aos";
import "aos/dist/aos.css";
import { motion, AnimatePresence } from "framer-motion";

// React Icons
import {
  FiSearch,
  FiDownload,
  FiRefreshCw,
  FiMapPin,
  FiMail,
  FiUser,
  FiUsers,
  FiCheckCircle,
  FiXCircle,
  FiEye,
  FiTrendingUp,
  FiAward,
  FiHeart,
  FiActivity,
  FiFilter,
  FiChevronDown,
  FiGrid,
  FiList,
} from "react-icons/fi";
import {
  FaHeart,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaCrown,
  FaHandsHelping,
  FaTint,
  FaUserShield,
  FaChartLine,
} from "react-icons/fa";
import {
  HiOutlineSparkles,
  HiOutlineBadgeCheck,
  HiOutlineClipboardList,
} from "react-icons/hi";
import { BiDonateBlood } from "react-icons/bi";
import { RiAdminLine, RiUserHeartLine } from "react-icons/ri";
import { MdVolunteerActivism } from "react-icons/md";

export default function ContentManagement() {
  const axiosSecure = useAxios();
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [viewMode, setViewMode] = useState("table");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-out-cubic",
      once: true,
      offset: 50,
    });
  }, []);

  useEffect(() => {
    fetchData();
  }, [axiosSecure]);

  const fetchData = async () => {
    try {
      const [uRes, rRes] = await Promise.all([
        axiosSecure.get("/users"),
        axiosSecure.get("/donation-requests?limit=5000"),
      ]);
      setUsers(uRes.data?.data || []);
      setRequests(rRes.data?.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load user data.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchData();
    setTimeout(() => setIsRefreshing(false), 1000);
    toast.success("Data refreshed successfully!");
  };

  const getUserStats = (email) => {
    const userReqs = requests.filter((r) => r.requesterEmail === email);
    const total = userReqs.length;
    const completed = userReqs.filter((r) => r.status === "done").length;
    const ratingPercent = total ? Math.round((completed / total) * 100) : 0;
    const starRating = Math.round((ratingPercent / 20) * 10) / 10;
    return { total, completed, ratingPercent, starRating };
  };

  // Calculate overall stats
  const totalDonations = requests.length;
  const completedDonations = requests.filter((r) => r.status === "done").length;
  const activeUsers = users.filter((u) => u.status === "active").length;
  const adminCount = users.filter((u) => u.role === "admin").length;

  // Filter users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  if (loading) return <LoadingSpinner />;

  if (!users.length) return <EmptyState />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50/30 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-red-200 to-pink-200 rounded-full filter blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-200 to-blue-200 rounded-full filter blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-red-100 to-orange-100 rounded-full filter blur-3xl"
        />
      </div>

      <div className="relative z-10 p-4 md:p-6 lg:p-8">
        {/* Header Section */}
        <motion.header
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 via-red-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-red-500/40">
                  <BiDonateBlood className="w-8 h-8 text-white" />
                </div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white flex items-center justify-center shadow-lg"
                >
                  <FiCheckCircle className="w-3 h-3 text-white" />
                </motion.div>
              </motion.div>
              <div>
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-600 via-red-500 to-pink-500 bg-clip-text text-transparent"
                >
                  Content Management
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-gray-500 mt-1 flex items-center gap-2"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  Real-time user & donation analytics
                </motion.p>
              </div>
            </div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-3"
            >
              {/* <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="px-5 py-2.5 bg-white/80 backdrop-blur-xl border border-gray-200 rounded-xl text-gray-600 hover:bg-white hover:border-gray-300 hover:shadow-lg transition-all duration-300 flex items-center gap-2 shadow-sm"
              >
                <FiDownload className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </motion.button> */}
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center gap-2 shadow-xl shadow-red-500/30 disabled:opacity-70"
              >
                <motion.div
                  animate={{ rotate: isRefreshing ? 360 : 0 }}
                  transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0, ease: "linear" }}
                >
                  <FiRefreshCw className="w-4 h-4" />
                </motion.div>
                <span className="hidden sm:inline">Refresh</span>
              </motion.button>
            </motion.div>
          </div>
        </motion.header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <StatsCard
            title="Total Users"
            value={users.length}
            icon={FiUsers}
            gradient="from-blue-500 to-indigo-600"
            shadowColor="shadow-blue-500/25"
            delay={0}
          />
          <StatsCard
            title="Active Users"
            value={activeUsers}
            icon={FiCheckCircle}
            gradient="from-green-500 to-emerald-600"
            shadowColor="shadow-green-500/25"
            delay={0.1}
            trend={`${Math.round((activeUsers / users.length) * 100)}%`}
          />
          <StatsCard
            title="Total Requests"
            value={totalDonations}
            icon={HiOutlineClipboardList}
            gradient="from-orange-500 to-amber-600"
            shadowColor="shadow-orange-500/25"
            delay={0.2}
          />
          <StatsCard
            title="Completed"
            value={completedDonations}
            icon={FaHeart}
            gradient="from-red-500 to-pink-600"
            shadowColor="shadow-red-500/25"
            delay={0.3}
            percentage={totalDonations ? Math.round((completedDonations / totalDonations) * 100) : 0}
          />
        </div>

        {/* Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          data-aos="fade-up"
          className="bg-white/70 backdrop-blur-xl rounded-2xl p-4 md:p-5 mb-6 shadow-xl shadow-gray-200/50 border border-white/50"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative group">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-red-500 transition-colors duration-200" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 focus:bg-white transition-all duration-300 placeholder:text-gray-400"
              />
              {searchTerm && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={() => setSearchTerm("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FiXCircle className="w-5 h-5" />
                </motion.button>
              )}
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              {[
                { key: "all", label: "All", icon: FiFilter },
                { key: "admin", label: "Admin", icon: RiAdminLine },
                { key: "volunteer", label: "Volunteer", icon: MdVolunteerActivism },
                { key: "donor", label: "Donor", icon: RiUserHeartLine },
              ].map((item) => (
                <motion.button
                  key={item.key}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setFilterRole(item.key)}
                  className={`px-4 py-3 rounded-xl font-medium capitalize transition-all duration-300 flex items-center gap-2 ${
                    filterRole === item.key
                      ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30"
                      : "bg-gray-100/80 text-gray-600 hover:bg-gray-200/80 hover:shadow-md"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </motion.button>
              ))}
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode("table")}
                className={`p-2.5 rounded-lg transition-all duration-200 ${
                  viewMode === "table"
                    ? "bg-white text-red-600 shadow-md"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <FiList className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode("grid")}
                className={`p-2.5 rounded-lg transition-all duration-200 ${
                  viewMode === "grid"
                    ? "bg-white text-red-600 shadow-md"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <FiGrid className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {viewMode === "table" ? (
            <TableView
              users={filteredUsers}
              getUserStats={getUserStats}
              totalUsers={users.length}
            />
          ) : (
            <GridView
              users={filteredUsers}
              getUserStats={getUserStats}
              totalUsers={users.length}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ---------- Loading Spinner ---------- */
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50 flex items-center justify-center">
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center"
    >
      <div className="relative w-24 h-24 mx-auto mb-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border-4 border-red-200 rounded-full border-t-red-500"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="absolute inset-4 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center"
        >
          <FaHeart className="w-8 h-8 text-white" />
        </motion.div>
      </div>
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-xl font-semibold text-gray-700"
      >
        Loading Statistics
      </motion.h3>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-gray-500 mt-2"
      >
        Please wait while we fetch the data...
      </motion.p>
    </motion.div>
  </div>
);

/* ---------- Empty State ---------- */
const EmptyState = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50 flex items-center justify-center p-4">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center p-10 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl max-w-md"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-7xl mb-6"
      >
        🔍
      </motion.div>
      <h3 className="text-2xl font-bold text-gray-700 mb-2">No Users Found</h3>
      <p className="text-gray-500">The database appears to be empty.</p>
    </motion.div>
  </div>
);

/* ---------- Stats Card ---------- */
const StatsCard = ({ title, value, icon: Icon, gradient, shadowColor, delay, percentage, trend }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    whileHover={{ y: -5, scale: 1.02 }}
    data-aos="zoom-in"
    data-aos-delay={delay * 1000}
    className={`relative overflow-hidden bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl ${shadowColor} border border-white/50 group cursor-pointer`}
  >
    <div className="flex items-start justify-between relative z-10">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.2 }}
          className="text-3xl font-bold text-gray-800"
        >
          {value.toLocaleString()}
        </motion.h3>
        {percentage !== undefined && (
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + 0.3 }}
            className="text-sm text-green-600 mt-2 flex items-center gap-1"
          >
            <FiTrendingUp className="w-4 h-4" />
            {percentage}% success rate
          </motion.p>
        )}
        {trend && (
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + 0.3 }}
            className="text-sm text-blue-600 mt-2 flex items-center gap-1"
          >
            <FiActivity className="w-4 h-4" />
            {trend} active
          </motion.p>
        )}
      </div>
      <motion.div
        whileHover={{ rotate: 15, scale: 1.1 }}
        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}
      >
        <Icon className="w-7 h-7 text-white" />
      </motion.div>
    </div>
    
    {/* Animated background decoration */}
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 0.1 }}
      transition={{ delay: delay + 0.4 }}
      className={`absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br ${gradient} rounded-full`}
    />
    
    {/* Hover effect line */}
    <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
  </motion.div>
);

/* ---------- Table View ---------- */
const TableView = ({ users, getUserStats, totalUsers }) => (
  <motion.div
    key="table"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
    data-aos="fade-up"
    className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl shadow-gray-200/50 border border-white/50 overflow-hidden"
  >
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gradient-to-r from-gray-50 to-gray-100/80">
            <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
            <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Contact</th>
            <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Blood</th>
            <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Location</th>
            <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
            <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-5 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Performance</th>
            <th className="px-6 py-5 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Rating</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {users.map((u, idx) => {
            const { total, completed, ratingPercent, starRating } = getUserStats(u.email);
            return (
              <motion.tr
                key={u._id || idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ backgroundColor: "rgba(254, 242, 242, 0.5)" }}
                className="group transition-all duration-300"
              >
                {/* User Cell */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="relative"
                    >
                      {u.avatar ? (
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="h-12 w-12 rounded-xl object-cover border-2 border-gray-100 group-hover:border-red-200 transition-all duration-300 shadow-md"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-red-400 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-red-500/30">
                          {u.name?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                      )}
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-sm ${u.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}>
                        {u.status === 'active' && (
                          <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75" />
                        )}
                      </div>
                    </motion.div>
                    <div>
                      <h3 className="font-semibold text-gray-800 group-hover:text-red-600 transition-colors duration-200">
                        {u.name}
                      </h3>
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <FiUser className="w-3 h-3" />
                        ID: {u._id?.slice(-6) || "N/A"}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Contact Cell */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FiMail className="w-4 h-4 text-gray-400" />
                    {u.email}
                  </div>
                </td>

                {/* Blood Group Cell */}
                <td className="px-6 py-4">
                  <BloodGroupBadge group={u.bloodGroup} />
                </td>

                {/* Location Cell */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <FiMapPin className="w-4 h-4 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">{u.district || "—"}</p>
                      <p className="text-xs text-gray-400">{u.upazila || "—"}</p>
                    </div>
                  </div>
                </td>

                {/* Role Cell */}
                <td className="px-6 py-4">
                  <RoleBadge role={u.role} />
                </td>

                {/* Status Cell */}
                <td className="px-6 py-4">
                  <StatusBadge status={u.status} />
                </td>

                {/* Performance Cell */}
                <td className="px-6 py-4">
                  <PerformanceBar completed={completed} total={total} />
                </td>

                {/* Rating Cell */}
                <td className="px-6 py-4">
                  <StarRating value={starRating} />
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>

    {/* Table Footer */}
    <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100/80 border-t border-gray-100">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm text-gray-500 flex items-center gap-2">
          <HiOutlineSparkles className="w-4 h-4 text-yellow-500" />
          Showing <span className="font-semibold text-gray-700">{users.length}</span> of{" "}
          <span className="font-semibold text-gray-700">{totalUsers}</span> users
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">View mode:</span>
          <span className="px-3 py-1.5 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-amber-200">
            <FiEye className="w-3.5 h-3.5" />
            Read Only
          </span>
        </div>
      </div>
    </div>
  </motion.div>
);

/* ---------- Grid View ---------- */
const GridView = ({ users, getUserStats, totalUsers }) => (
  <motion.div
    key="grid"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
    className="space-y-6"
  >
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {users.map((u, idx) => {
        const { total, completed, starRating } = getUserStats(u.email);
        return (
          <motion.div
            key={u._id || idx}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            whileHover={{ y: -5, scale: 1.02 }}
            data-aos="fade-up"
            data-aos-delay={idx * 50}
            className="bg-white/80 backdrop-blur-xl rounded-2xl p-5 shadow-xl shadow-gray-200/50 border border-white/50 group hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-300"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="relative">
                {u.avatar ? (
                  <img
                    src={u.avatar}
                    alt={u.name}
                    className="h-16 w-16 rounded-xl object-cover border-2 border-gray-100 shadow-lg"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-red-400 to-pink-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-red-500/30">
                    {u.name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                )}
                <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white shadow-sm flex items-center justify-center ${u.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}>
                  {u.status === 'active' && <FiCheckCircle className="w-3 h-3 text-white" />}
                </div>
              </div>
              <RoleBadge role={u.role} />
            </div>

            {/* User Info */}
            <h3 className="font-bold text-gray-800 text-lg mb-1 group-hover:text-red-600 transition-colors">
              {u.name}
            </h3>
            <p className="text-sm text-gray-500 flex items-center gap-1 mb-3">
              <FiMail className="w-3.5 h-3.5" />
              {u.email}
            </p>

            {/* Blood Group & Location */}
            <div className="flex items-center gap-2 mb-4">
              <BloodGroupBadge group={u.bloodGroup} />
              <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                <FiMapPin className="w-3 h-3" />
                {u.district || "N/A"}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-gray-800">{total}</p>
                <p className="text-xs text-gray-500">Requests</p>
              </div>
              <div className="bg-green-50 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-green-600">{completed}</p>
                <p className="text-xs text-gray-500">Completed</p>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center justify-center">
              <StarRating value={starRating} />
            </div>
          </motion.div>
        );
      })}
    </div>

    {/* Footer */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="bg-white/70 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-white/50"
    >
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">
          Showing <span className="font-semibold">{users.length}</span> of {totalUsers} users
        </p>
        <span className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg text-xs font-semibold flex items-center gap-1.5">
          <FiEye className="w-3.5 h-3.5" />
          Read Only
        </span>
      </div>
    </motion.div>
  </motion.div>
);

/* ---------- Blood Group Badge ---------- */
const BloodGroupBadge = ({ group }) => {
  if (!group) return <span className="text-gray-400 text-sm">—</span>;
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl shadow-sm"
    >
      <FaTint className="w-3.5 h-3.5 text-red-500" />
      <span className="font-bold text-red-600 text-sm">{group}</span>
    </motion.div>
  );
};

/* ---------- Role Badge ---------- */
const RoleBadge = ({ role }) => {
  const config = {
    admin: {
      bg: "bg-gradient-to-r from-purple-500 to-indigo-600",
      icon: FaCrown,
      shadow: "shadow-purple-500/30"
    },
    volunteer: {
      bg: "bg-gradient-to-r from-blue-500 to-cyan-600",
      icon: FaHandsHelping,
      shadow: "shadow-blue-500/30"
    },
    donor: {
      bg: "bg-gradient-to-r from-red-500 to-pink-600",
      icon: FaHeart,
      shadow: "shadow-red-500/30"
    },
  };
  const c = config[role] || { bg: "bg-gray-500", icon: FiUser, shadow: "shadow-gray-500/30" };
  const Icon = c.icon;

  return (
    <motion.span
      whileHover={{ scale: 1.05 }}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold ${c.bg} text-white shadow-lg ${c.shadow}`}
    >
      <Icon className="w-3.5 h-3.5" />
      <span className="capitalize">{role}</span>
    </motion.span>
  );
};

/* ---------- Status Badge ---------- */
const StatusBadge = ({ status }) => {
  const isActive = status === "active";
  return (
    <motion.span
      whileHover={{ scale: 1.05 }}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold ${
        isActive
          ? "bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border border-green-200"
          : "bg-gradient-to-r from-gray-50 to-slate-50 text-gray-600 border border-gray-200"
      }`}
    >
      <span className="relative flex h-2 w-2">
        {isActive && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${isActive ? "bg-green-500" : "bg-gray-400"}`} />
      </span>
      <span className="capitalize">{status}</span>
    </motion.span>
  );
};

/* ---------- Performance Bar ---------- */
const PerformanceBar = ({ completed, total }) => {
  const percent = total ? (completed / total) * 100 : 0;
  
  const getGradient = () => {
    if (percent >= 75) return "from-green-400 to-emerald-500";
    if (percent >= 50) return "from-yellow-400 to-orange-500";
    if (percent >= 25) return "from-orange-400 to-red-500";
    return "from-red-400 to-pink-500";
  };

  return (
    <div className="w-32 mx-auto">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs font-medium text-gray-500">{completed}/{total}</span>
        <span className={`text-xs font-bold ${percent >= 50 ? "text-green-600" : "text-gray-600"}`}>
          {Math.round(percent)}%
        </span>
      </div>
      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full bg-gradient-to-r ${getGradient()} rounded-full`}
        />
      </div>
    </div>
  );
};

/* ---------- Star Rating ---------- */
const StarRating = ({ value = 0 }) => {
  const fullStars = Math.floor(value);
  const hasHalf = value - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[...Array(fullStars)].map((_, i) => (
          <motion.div
            key={`f${i}`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <FaStar className="w-4 h-4 text-yellow-400 drop-shadow-sm" />
          </motion.div>
        ))}
        {hasHalf && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: fullStars * 0.1 }}
          >
            <FaStarHalfAlt className="w-4 h-4 text-yellow-400 drop-shadow-sm" />
          </motion.div>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <motion.div
            key={`e${i}`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: (fullStars + (hasHalf ? 1 : 0) + i) * 0.1 }}
          >
            <FaRegStar className="w-4 h-4 text-gray-300" />
          </motion.div>
        ))}
      </div>
      <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
        {value.toFixed(1)}
      </span>
    </div>
  );
};

export { ContentManagement };