// src/pages/Dashboard/RequestDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import useAxios from "../../hooks/useAxios";

export default function RequestDetails() {
  const { id } = useParams();               // get request ID from route
  const axiosSecure = useAxios();
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRequest = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await axiosSecure.get(`/donation-requests/${id}`);
      setRequest(res.data?.data || null);
    } catch (err) {
      console.error("Failed to load request", err);
      setError(err?.response?.data?.message || "Failed to load request");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequest();
  }, [id]);

  const changeStatus = async (status) => {
    try {
      await axiosSecure.patch(`/donation-requests/:id`, { status });
      await loadRequest(); // refresh
    } catch (err) {
      console.error("Status update failed", err);
      alert("Failed to update status");
    }
  };

  const deleteRequest = async () => {
    if (!confirm("Are you sure you want to delete this request?")) return;

    try {
      await axiosSecure.delete(`/donation-requests/${id}`);
      navigate("/dashboard/my-donation-requests");
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete");
    }
  };

  if (loading) return <div>Loading request...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!request) return <div>No request found</div>;

  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-2xl font-semibold">Request Details</h1>

      <div className="bg-white p-6 rounded shadow space-y-3">
        <p><strong>Recipient:</strong> {request.recipientName}</p>
        <p><strong>Location:</strong> {request.recipientDistrict} • {request.recipientUpazila}</p>
        <p><strong>Hospital:</strong> {request.hospitalName}</p>
        <p><strong>Address:</strong> {request.fullAddress}</p>

        <p><strong>Blood Group:</strong> {request.bloodGroup}</p>
        <p><strong>Date & Time:</strong> {request.donationDate} at {request.donationTime}</p>

        <p><strong>Message:</strong> {request.requestMessage}</p>

        <p>
          <strong>Status:</strong>{" "}
          <span className={`px-2 py-1 rounded text-sm ${
            request.status === "pending" ? "bg-yellow-100 text-yellow-700" :
            request.status === "inprogress" ? "bg-blue-100 text-blue-700" :
            request.status === "done" ? "bg-green-100 text-green-700" :
            "bg-gray-100 text-gray-700"
          }`}>
            {request.status}
          </span>
        </p>

        {request.donorName && (
          <div className="mt-3 bg-gray-50 p-3 rounded">
            <p><strong>Donor Name:</strong> {request.donorName}</p>
            <p><strong>Donor Email:</strong> {request.donorEmail}</p>
          </div>
        )}

        {/* ACTION BUTTONS */}
        <div className="flex gap-3 mt-4">
          {request.status === "pending" && (
            <button
              className="btn bg-blue-600 text-white"
              onClick={() => changeStatus("inprogress")}
            >
              Mark In Progress
            </button>
          )}

          {request.status === "inprogress" && (
            <>
              <button
                className="btn bg-green-600 text-white"
                onClick={() => changeStatus("done")}
              >
                Mark Done
              </button>
              <button
                className="btn bg-gray-400"
                onClick={() => changeStatus("canceled")}
              >
                Cancel
              </button>
            </>
          )}

          <button
            className="btn btn-outline text-red-600"
            onClick={deleteRequest}
          >
            Delete
          </button>

          <button
            className="btn btn-ghost"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
