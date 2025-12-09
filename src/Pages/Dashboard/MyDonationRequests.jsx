// src/pages/Dashboard/MyDonationRequests.jsx
import React, { useEffect, useState } from "react";
import useAxios from "../../hooks/useAxios";
import useAuth from "../../hooks/useAuth";
import RequestCard from "../../Components/Request/RequestCard";

// always returns an array from whatever shape server returns
const ensureArray = (v) => {
  if (!v) return [];
  if (Array.isArray(v)) return v;
  if (typeof v === "object") {
    if (Array.isArray(v.data)) return v.data;
    if (Array.isArray(v.requests)) return v.requests;
    if (Array.isArray(v.items)) return v.items;
    if (Array.isArray(v.result)) return v.result;
  }
  return [];
};

export default function MyDonationRequests() {
  const axiosSecure = useAxios();
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadRequests = async () => {
      setLoading(true);
      setError("");
      setRequests([]);

      // IMPORTANT: server requires ?email=...
      if (!user?.email) {
        setError("Please login to see your requests.");
        setLoading(false);
        return;
      }

      try {
        // Use axios params to attach email query string properly
        const res = await axiosSecure.get("/requests/my", { params: { email: user.email, limit: 50 } });

        if (!mounted) return;

        // Normalize shapes:
        // common server shapes: { ok:true, data: [..] } OR { data: [...] } OR [...]
        let payload = res?.data ?? res;
        if (payload && payload.ok && payload.data) payload = payload.data;

        const arr = ensureArray(payload);
        setRequests(arr);
      } catch (err) {
        console.error("MyDonationRequests error:", err);

        // Friendly error message, with server message if available
        const serverMsg = err?.response?.data?.message || err?.response?.data || err?.message;
        setError(typeof serverMsg === "string" ? serverMsg : JSON.stringify(serverMsg));

        // Helpful console debug — uncomment if you need further details
        // console.debug("Axios error response:", err?.response);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadRequests();
    return () => {
      mounted = false;
    };
  }, [axiosSecure, user?.email]);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">My Donation Requests</h1>

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="p-3 bg-yellow-50 text-yellow-800 rounded">{error}</div>
      ) : requests.length ? (
        <div className="space-y-4">
          {requests.map((req) => (
            <RequestCard key={req._id || req.id || JSON.stringify(req).slice(0, 8)} request={req} showActions />
          ))}
        </div>
      ) : (
        <p className="text-gray-600">You have no donation requests.</p>
      )}
    </div>
  );
}
