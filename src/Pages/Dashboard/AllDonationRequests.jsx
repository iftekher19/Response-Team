import React, { useEffect, useState } from "react";
import useAxios from "../../hooks/useAxios";
import RequestCard from "../../components/dashboard/RequestCard";

export default function AllDonationRequests() {
  const axiosSecure = useAxios();
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("pending");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const res = await axiosSecure.get(`/requests?status=${filter}`); // MODIFY: endpoint
        if (mounted && res?.data) setRequests(res.data);
      } catch (err) {
        console.error("All requests error", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [axiosSecure, filter]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">All Donation Requests</h1>
        <div>
          <select className="select select-bordered" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="pending">Pending</option>
            <option value="inprogress">In Progress</option>
            <option value="done">Done</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>
      </div>

      {loading ? <div>Loading...</div> : (
        requests.length ? (
          <div className="space-y-4">
            {requests.map(r => <RequestCard key={r._id || r.id} request={r} showActions showDonor />)}
          </div>
        ) : <p className="text-gray-600">No requests found for this filter.</p>
      )}
    </div>
  );
}
