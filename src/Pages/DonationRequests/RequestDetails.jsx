// src/pages/Dashboard/RequestDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import useAxios from "../../hooks/useAxios";
import useAuth from "../../hooks/useAuth";

export default function RequestDetails() {
  const { id } = useParams();
  const axiosSecure = useAxios();
  const { user } = useAuth();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const res = await axiosSecure.get(`/donation-requests/${id}`).catch(() => null);
        let payload = res?.data ?? res;
        if (payload?.ok && payload.data) payload = payload.data;
        if (mounted) setRequest(payload);
      } catch (err) {
        console.error("RequestDetails fetch error", err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [axiosSecure, id]);

  if (loading) return <div>Loading request...</div>;
  if (!request) return <div>Request not found.</div>;

  const isAdmin = user?.role === "admin";
  const isVolunteer = user?.role === "volunteer";

  const changeStatus = async (newStatus) => {
    try {
      await axiosSecure.patch(`/donation-requests/${id}`, { status: newStatus });
      setRequest((p) => ({ ...p, status: newStatus }));
    } catch (err) {
      console.error("changeStatus err", err);
      alert("Could not change status");
    }
  };

  return (
    <div>
      <button className="btn btn-ghost mb-3" onClick={() => navigate(-1)}>Back</button>
      <h1 className="text-2xl font-semibold mb-2">{request.recipientName}</h1>

      <div className="bg-white p-4 rounded shadow space-y-3">
        <p><strong>Location:</strong> {request.recipientDistrict} • {request.recipientUpazila}</p>
        <p><strong>Hospital:</strong> {request.hospitalName}</p>
        <p><strong>When:</strong> {request.donationDate} {request.donationTime}</p>
        <p><strong>Blood group:</strong> {request.bloodGroup}</p>
        <p><strong>Message:</strong> {request.requestMessage}</p>
        <p><strong>Status:</strong> {request.status}</p>

        {request.status === "inprogress" && (isAdmin || isVolunteer) && (
          <div className="flex gap-2">
            <button className="btn bg-green-600 text-white" onClick={() => changeStatus("done")}>Mark Done</button>
            <button className="btn" onClick={() => changeStatus("canceled")}>Cancel</button>
          </div>
        )}

        {/* Donor info shown when assigned */}
        {request.donorEmail && (
          <div className="mt-3">
            <h3 className="font-semibold">Assigned Donor</h3>
            <p>{request.donorName || "-"}</p>
            <p className="text-sm text-gray-600">{request.donorEmail}</p>
          </div>
        )}
      </div>
    </div>
  );
}
