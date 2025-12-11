// this is for public routesss

import React, { useEffect, useState } from "react";
import useAxios from "../../hooks/useAxios";
import RequestCard from "../../Components/Request/RequestCard";

export default function DonationRequests() {
  const axiosSecure = useAxios();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      try {
        // only show pending requests publicly
        const res = await axiosSecure.get("/donation-requests", {
          params: { status: "pending" },
        });

        let arr = res?.data?.data || res?.data || [];
        if (!Array.isArray(arr)) arr = [];
        if (mounted) setRequests(arr);
      } catch (err) {
        console.error("DonationRequests list error:", err);
        if (mounted) setRequests([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [axiosSecure]);

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Blood Donation Requests</h1>

      {loading ? (
        <div>Loading...</div>
      ) : requests.length ? (
        <div className="space-y-4">
          {requests.map((r) => (
            <RequestCard
              key={r._id || r.id}
              request={r}
              showActions={false}   // donors cannot edit here
              showDonor={false}
              showView={true}       // they can open details
              mode="donor"
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No pending donation requests right now.</p>
      )}
    </div>
  );
}
