import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";
import { FiUsers, FiDollarSign, FiHeart, FiPlus, FiArrowRight, FiMapPin, FiClock } from "react-icons/fi";
import useAuth from "../../hooks/useAuth";
import useAxios from "../../hooks/useAxios";

// Helper to ensure a value is always an array
const ensureArray = (v) => {
  if (!v) return [];
  if (Array.isArray(v)) return v;
  if (typeof v === "object") {
    if (Array.isArray(v.data)) return v.data;
    if (Array.isArray(v.requests)) return v.requests;
    if (Array.isArray(v.results)) return v.results;
    if (Array.isArray(v.items)) return v.items;
  }
  return [v];
};

export default function DashboardHome() {
  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxios();
  const navigate = useNavigate();

  const [stats, setStats] = useState({ users: 0, funds: 0, requests: 0 });
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statsError, setStatsError] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/", { replace: true });
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    let mounted = true;

    const fetchStats = async () => {
      setLoading(true);
      setStatsError("");
      try {
        const sRes = await axiosSecure.get("/admin/stats").catch((e) => {
          console.warn("admin/stats failed", e?.response?.data || e?.message || e);
          return null;
        });

        if (!mounted) return;

        if (sRes?.data) {
          const payload = sRes.data && typeof sRes.data === "object" ? sRes.data : {};
          setStats({
            users: payload.users ?? payload.data?.users ?? 0,
            funds: payload.funds ?? payload.data?.funds ?? 0,
            requests: payload.requests ?? payload.data?.requests ?? 0,
          });
        }

        if (!user?.email) {
          setRecentRequests([]);
          return;
        }

        const rRes = await axiosSecure
          .get("/requests/my", { params: { email: user.email, limit: 3 } })
          .catch((e) => {
            console.warn("/requests/my failed", e?.response?.data || e?.message || e);
            return null;
          });

        if (!mounted) return;

        if (rRes) {
          let candidate = rRes.data ?? rRes;
          if (candidate && candidate.ok && candidate.data) candidate = candidate.data;
          const arr = ensureArray(candidate);
          setRecentRequests(arr);
        } else {
          setRecentRequests([]);
        }
      } catch (err) {
        console.error("DashboardHome fetch error", err);
        setStatsError("Could not load dashboard data");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    if (!authLoading) fetchStats();

    return () => {
      mounted = false;
    };
  }, [axiosSecure, user?.email, authLoading]);

  const statItems = [
    { label: "Total Donors", value: stats.users, icon: FiUsers, gradient: "from-blue-500 to-indigo-600" },
    { label: "Total Funds", value: `৳ ${stats.funds ?? 0}`, icon: FiDollarSign, gradient: "from-emerald-500 to-teal-600" },
    { label: "Donation Requests", value: stats.requests, icon: FiHeart, gradient: "from-red-500 to-rose-600" },
  ];

  const statusStyles = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    inprogress: "bg-blue-50 text-blue-700 border-blue-200",
    done: "bg-green-50 text-green-700 border-green-200",
    cancelled: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome, {user?.name || user?.email || "User"}
          </h1>
          <p className="text-gray-500 text-sm mt-1">Manage your blood donation activities</p>
        </div>
        <Link
          to="/dashboard/create-donation-request"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl font-medium shadow-lg shadow-red-200 hover:shadow-red-300 hover:-translate-y-0.5 transition-all"
        >
          <FiPlus className="text-lg" />
          New Request
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {statItems.map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:border-gray-200 transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{item.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {loading ? (
                    <span className="inline-block w-16 h-8 bg-gray-200 rounded animate-pulse" />
                  ) : (
                    item.value
                  )}
                </p>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                <item.icon className="text-white text-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Requests */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Your Recent Requests</h2>
          <Link
            to="/dashboard/my-donation-requests"
            className="text-sm font-medium text-red-600 hover:text-red-700 flex items-center gap-1 group"
          >
            View All
            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
                <div className="h-6 w-20 bg-gray-200 rounded-full" />
              </div>
            ))}
          </div>
        ) : !user?.email ? (
          <div className="p-12 text-center">
            <p className="text-gray-500">Please log in to see your recent requests.</p>
          </div>
        ) : recentRequests.length > 0 ? (
          <div className="divide-y divide-gray-50">
            {recentRequests.map((req) => (
              <div
                key={req._id || req.id || JSON.stringify(req).slice(0, 10)}
                className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors"
              >
                {/* Blood Group */}
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md shadow-red-200 flex-shrink-0">
                  {req.bloodGroup || "?"}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {req.recipientName || req.patientName || "Unknown Patient"}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 mt-1">
                    <span className="flex items-center gap-1">
                      <FiMapPin className="text-xs" />
                      {req.hospital || req.location || "N/A"}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiClock className="text-xs" />
                      {req.donationDate || req.date
                        ? new Date(req.donationDate || req.date).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                </div>

                {/* Status */}
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full border capitalize flex-shrink-0 ${
                    statusStyles[req.status?.toLowerCase()] || statusStyles.pending
                  }`}
                >
                  {req.status || "Pending"}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FiHeart className="text-red-400 text-2xl" />
            </div>
            <p className="text-gray-900 font-medium mb-1">No requests yet</p>
            <p className="text-gray-500 text-sm mb-4">Create your first blood donation request</p>
            <Link
              to="/dashboard/create-donation-request"
              className="inline-flex items-center gap-2 text-red-600 font-medium hover:text-red-700"
            >
              <FiPlus /> Create Request
            </Link>
          </div>
        )}

        {statsError && (
          <div className="px-6 py-4 bg-red-50 border-t border-red-100">
            <p className="text-sm text-red-600">{statsError}</p>
          </div>
        )}
      </div>
    </div>
  );
}