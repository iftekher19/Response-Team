// src/pages/Dashboard/AllDonationRequests.jsx
import React, { useEffect, useState } from "react";
import useAxios from "../../hooks/useAxios";
import useAuth from "../../hooks/useAuth";
import RequestCard from "../../Components/Request/RequestCard";

export default function AllDonationRequests() {
  const axiosSecure = useAxios();
  const { user } = useAuth();

  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("pending");
  const [loading, setLoading] = useState(true);

  // Determine mode by role
  const mode = user?.role === "admin" ? "admin" : "volunteer";

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      try {
        // backend /requests returns { ok: true, data: [...] }
        const res = await axiosSecure.get("/requests", {
          params: { status: filter },
        });

        if (!mounted) return;

        const arr = res?.data?.data || res?.data || [];
        setRequests(Array.isArray(arr) ? arr : []);
      } catch (err) {
        console.error("All requests error", err);
        if (mounted) setRequests([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [axiosSecure, filter]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">All Donation Requests</h1>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Filter by status:</span>
          <select
            className="select select-bordered"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="pending">Pending</option>
            <option value="inprogress">In Progress</option>
            <option value="done">Done</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : requests.length ? (
        <div className="space-y-4">
          {requests.map((r) => (
            <RequestCard
              key={r._id || r.id}
              request={r}
              showActions
              showDonor
              mode={mode} // admin or volunteer
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No requests found for this filter.</p>
      )}
    </div>
  );
}
