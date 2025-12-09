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
    if (Array.isArray(v.items)) return v.items;
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
  const [statsError, setStatsError] = useState("");

  useEffect(() => {
    let mounted = true;

    const fetchStats = async () => {
      setLoading(true);
      setStatsError("");
      try {
        // Stats (admin endpoint) — wrap call in try/catch, don't crash whole flow
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

        // Recent requests: require user email. If no user/email yet, return empty list.
        if (!user?.email) {
          setRecentRequests([]);
          return;
        }

        // Use params so query string is correct
        const rRes = await axiosSecure
          .get("/requests/my", { params: { email: user.email, limit: 3 } })
          .catch((e) => {
            console.warn("/requests/my failed", e?.response?.data || e?.message || e);
            return null;
          });

        if (!mounted) return;

        if (rRes) {
          // axios returns { data: { ok: true, data: [...] } } OR { ok:true, data: [...] } etc.
          // Try multiple shapes
          let candidate = rRes.data ?? rRes;
          // If response has shape { ok: true, data: [...] } prefer .data
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

    fetchStats();
    return () => {
      mounted = false;
    };
  }, [axiosSecure, user?.email]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Welcome, {user?.name || user?.email || "User"}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatsCard title="Total Donors" value={stats.users} />
        <StatsCard title="Total Funds" value={`৳ ${stats.funds ?? 0}`} />
        <StatsCard title="Donation Requests" value={stats.requests} />
      </div>

      <section>
        <h2 className="text-xl font-semibold mb-3">Your recent requests</h2>

        {loading ? (
          <div>Loading...</div>
        ) : !user?.email ? (
          <p className="text-gray-600">Please log in to see your recent requests.</p>
        ) : recentRequests.length ? (
          <div className="space-y-3">
            {recentRequests.map((req) => (
              <RequestCard
                key={req._id || req.id || JSON.stringify(req).slice(0, 10)}
                request={req}
                showActions
              />
            ))}
            <div className="mt-3">
              <a href="/dashboard/my-donation-requests" className="btn btn-outline">
                View my all requests
              </a>
            </div>
          </div>
        ) : (
          <p className="text-gray-600">You have no recent donation requests.</p>
        )}

        {statsError && <p className="text-red-600 mt-3">{statsError}</p>}
      </section>
    </div>
  );
}
