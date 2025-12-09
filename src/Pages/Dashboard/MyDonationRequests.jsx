// src/pages/Dashboard/MyDonationRequests.jsx
import React, { useEffect, useState } from "react";
import useAxios from "../../hooks/useAxios";
import useAuth from "../../hooks/useAuth";
import RequestCard from "../../Components/Request/RequestCard";

// Normalizer: ALWAYS returns an array
const ensureArray = (v) => {
  if (!v) return [];
  if (Array.isArray(v)) return v;
  if (typeof v === "object") {
    if (Array.isArray(v.data)) return v.data;
    if (Array.isArray(v.requests)) return v.requests;
    if (Array.isArray(v.result)) return v.result;
    if (Array.isArray(v.items)) return v.items;
  }
  return []; // safest default
};

export default function MyDonationRequests() {
  const axiosSecure = useAxios();
  const { user, loading: authLoading } = useAuth();
  const [requests, setRequests] = useState([]); // always array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadRequests = async () => {
      // Don't try to fetch until we have a user email
      if (!user?.email) {
        // If auth is still loading, wait; otherwise show empty state
        if (authLoading) return;
        setRequests([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        // Use axios params to include the required email query
        const res = await axiosSecure.get("/requests/my", {
          params: { email: user.email, limit: 50 },
        });

        if (!mounted) return;

        // axios response typical shape: { data: { ok: true, data: [...] } }
        // We want to normalize to an array of request docs
        const raw = res?.data ?? res;
        const arr = ensureArray(raw);

        setRequests(arr);
      } catch (err) {
        console.error("MyDonationRequests error:", err);
        const serverMsg = err?.response?.data?.message || err?.message || "Failed to load requests";
        setError(serverMsg);
        setRequests([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadRequests();

    // If you want auto-refresh when user changes, include user.email in deps:
    return () => {
      mounted = false;
    };
  }, [axiosSecure, user?.email, authLoading]);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">My Donation Requests</h1>

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-600">Error: {error}</div>
      ) : requests.length ? (
        <div className="space-y-4">
          {requests.map((req) => (
            <RequestCard
              key={req._id || req.id || JSON.stringify(req).slice(0, 10)}
              request={req}
              showActions
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-600">You have no donation requests.</p>
      )}
    </div>
  );
}
