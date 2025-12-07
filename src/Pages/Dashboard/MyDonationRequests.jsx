// src/pages/Dashboard/MyDonationRequests.jsx
import React, { useEffect, useState } from "react";
import useAxios from "../../hooks/useAxios";
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
  const [requests, setRequests] = useState([]); // always array
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadRequests = async () => {
      setLoading(true);
      try {
        const res = await axiosSecure.get("/requests/my").catch((e) => {
          console.warn("GET /requests/my failed:", e?.response?.data || e.message);
          return null;
        });

        if (!mounted) return;

        const raw = res?.data ?? res;  
        const arr = ensureArray(raw);

        setRequests(arr); // always array
      } catch (err) {
        console.error("MyDonationRequests error:", err);
        setRequests([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadRequests();
    return () => { mounted = false; };
  }, [axiosSecure]);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">My Donation Requests</h1>

      {loading ? (
        <div>Loading...</div>
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
