// src/pages/Dashboard/DashboardHome.jsx
import React, { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import useAxios from "../../hooks/useAxios";
import StatsCard from "../Dashboard/StatsCard";
import RequestCard from "../../Components/Request/RequestCard";

// Helper to ensure a value is always an array
const ensureArray = (v) => {
  if (!v) return [];
  if (Array.isArray(v)) return v;
  // If backend returns object with list property, try common names
  if (typeof v === "object") {
    if (Array.isArray(v.data)) return v.data;
    if (Array.isArray(v.requests)) return v.requests;
    if (Array.isArray(v.results)) return v.results;
  }
  // otherwise wrap single item
  return [v];
};

// Create an inline SVG data URL avatar (safe — no external network)
const getAvatarDataUrl = (name = "U") => {
  const letter = encodeURIComponent((name || "U").charAt(0).toUpperCase());
  const bg = encodeURIComponent("#ef4444"); // red-600
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40'><rect width='100%' height='100%' fill='${bg}'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='18' fill='white' font-family='Arial, Helvetica, sans-serif'>${letter}</text></svg>`;
  return `data:image/svg+xml;utf8,${svg}`;
};

export default function DashboardHome() {
  const { user } = useAuth();
  const axiosSecure = useAxios();
  const [stats, setStats] = useState({ users: 0, funds: 0, requests: 0 });
  const [recentRequests, setRecentRequests] = useState([]); // always array
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchStats = async () => {
      setLoading(true);
      try {
        // FIX: guard each request and normalize shapes
        const sRes = await axiosSecure.get("/admin/stats").catch((e) => {
          console.warn("admin/stats failed", e?.response?.data || e.message || e);
          return null;
        });

        const rRes = await axiosSecure.get("/requests/my?limit=3").catch((e) => {
          console.warn("/requests/my failed", e?.response?.data || e.message || e);
          return null;
        });

        if (!mounted) return;

        // FIX: normalize stats (server might return { data: {...} } or {...})
        if (sRes?.data) {
          // expected shape: { users, funds, requests } or { data: { ... } }
          const payload = sRes.data && typeof sRes.data === "object" ? sRes.data : {};
          setStats({
            users: payload.users ?? payload.data?.users ?? 0,
            funds: payload.funds ?? payload.data?.funds ?? 0,
            requests: payload.requests ?? payload.data?.requests ?? 0,
          });
        }

        // FIX: normalize recent requests to always be an array
        if (rRes) {
          const candidate = rRes.data ?? rRes; // axios returns .data
          const arr = ensureArray(candidate);
          setRecentRequests(arr);
        } else {
          setRecentRequests([]);
        }

        // DEBUG (optional) — remove in production
        // console.log("stats response:", sRes);
        // console.log("recent requests response:", rRes);
      } catch (err) {
        console.error("DashboardHome fetch error", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchStats();
    return () => {
      mounted = false;
    };
  }, [axiosSecure]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Welcome, {user?.name || user?.email}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatsCard title="Total Donors" value={stats.users} />
        <StatsCard title="Total Funds" value={`৳ ${stats.funds ?? 0}`} />
        <StatsCard title="Donation Requests" value={stats.requests} />
      </div>

      <section>
        <h2 className="text-xl font-semibold mb-3">Your recent requests</h2>
        {loading ? (
          <div>Loading...</div>
        ) : recentRequests.length ? (
          <div className="space-y-3">
            {recentRequests.map((req) => (
              <RequestCard key={req._id || req.id || JSON.stringify(req).slice(0, 10)} request={req} showActions />
            ))}
          </div>
        ) : (
          <p className="text-gray-600">You have no recent donation requests.</p>
        )}
      </section>
    </div>
  );
}
