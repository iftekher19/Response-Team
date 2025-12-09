// src/components/Request/RequestCard.jsx
import React from "react";
import useAxios from "../../hooks/useAxios";
import { useNavigate } from "react-router";

export default function RequestCard({ request, showActions = false, showDonor = false, onChanged }) {
  const axiosSecure = useAxios();
  const navigate = useNavigate();

  // getId: prefer _id string, otherwise id
  const getId = (r) => {
    if (!r) return null;
    if (typeof r._id === "string") return r._id;
    if (r._id && typeof r._id === "object" && r._id.toString) return r._id.toString();
    return r.id || null;
  };

  const changeStatus = async (id, status) => {
    try {
      // server endpoint: PATCH /donation-requests/:id with allowed fields
      await axiosSecure.patch(`/donation-requests/${id}`, { status });
      if (typeof onChanged === "function") {
        onChanged();
      } else {
        // fallback: reload page to refresh list
        window.location.reload();
      }
    } catch (err) {
      console.error("Change status failed", err);
      alert(err?.response?.data?.message || "Action failed");
    }
  };

  const deleteRequest = async (id) => {
    if (!window.confirm("Delete this request?")) return;
    try {
      await axiosSecure.delete(`/donation-requests/${id}`);
      if (typeof onChanged === "function") {
        onChanged();
      } else {
        window.location.reload();
      }
    } catch (err) {
      console.error("Delete failed", err);
      alert(err?.response?.data?.message || "Delete failed");
    }
  };

  const id = getId(request);

  return (
    <div className="border rounded p-4 bg-white">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-lg">{request.recipientName || "—"}</h3>
          <p className="text-sm text-gray-600">{request.recipientDistrict || "—"} {request.recipientUpazila ? `• ${request.recipientUpazila}` : ""}</p>
          {request.hospitalName && <p className="text-sm">Hospital: {request.hospitalName}</p>}
          <p className="text-sm">Date: {request.donationDate || "—"} {request.donationTime || ""}</p>
          <p className="text-sm">Blood Group: <strong>{request.bloodGroup || "—"}</strong></p>
          {request.requestMessage && <p className="text-sm text-gray-700 mt-2">{String(request.requestMessage).slice(0, 200)}</p>}
        </div>

        <div className="text-right">
          <p
            className={`px-2 py-1 rounded text-sm ${
              request.status === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : request.status === "inprogress"
                ? "bg-blue-100 text-blue-800"
                : request.status === "done"
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {request.status || "pending"}
          </p>

          {showDonor && request.donor && (
            <div className="mt-2 text-sm">
              <p>Donor: {request.donor.name || "—"}</p>
              <p>{request.donor.email || "—"}</p>
            </div>
          )}
        </div>
      </div>

      {showActions && (
        <div className="mt-3 flex gap-2 flex-wrap">
          {request.status === "inprogress" && (
            <>
              <button onClick={() => changeStatus(id, "done")} className="btn btn-sm bg-green-600 text-white">Mark Done</button>
              <button onClick={() => changeStatus(id, "canceled")} className="btn btn-sm bg-gray-300">Cancel</button>
            </>
          )}

          {/* Edit - navigate to an edit route if you have one (change path if needed) */}
          <button onClick={() => navigate(`/donation-requests/${id}`)} className="btn btn-sm btn-ghost">Edit</button>

          <button onClick={() => deleteRequest(id)} className="btn btn-sm btn-outline text-red-600">Delete</button>

          <button onClick={() => navigate(`/donation-requests/${id}`)} className="btn btn-sm">View</button>
        </div>
      )}
    </div>
  );
}
