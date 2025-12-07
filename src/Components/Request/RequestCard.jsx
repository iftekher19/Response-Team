import React from "react";
import useAxios from "../../hooks/useAxios";
import { useNavigate } from "react-router";

export default function RequestCard({ request, showActions = false, showDonor = false }) {
  const axiosSecure = useAxios();
  const navigate = useNavigate();

  const changeStatus = async (id, status) => {
    try {
      await axiosSecure.patch(`/requests/${id}/status`, { status }); // MODIFY endpoint
      // For simplicity, reload or navigate to refresh list
      window.location.reload();
    } catch (err) {
      console.error("Change status failed", err);
      alert("Action failed");
    }
  };

  const deleteRequest = async (id) => {
    if (!confirm("Delete this request?")) return;
    try {
      await axiosSecure.delete(`/requests/${id}`); // MODIFY endpoint
      window.location.reload();
    } catch (err) {
      console.error("Delete failed", err);
      alert("Delete failed");
    }
  };

  return (
    <div className="border rounded p-4 bg-white">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-lg">{request.recipientName}</h3>
          <p className="text-sm text-gray-600">{request.recipientDistrict} • {request.recipientUpazila}</p>
          <p className="text-sm">Hospital: {request.hospitalName}</p>
          <p className="text-sm">Date: {request.donationDate} {request.donationTime}</p>
          <p className="text-sm">Blood Group: <strong>{request.bloodGroup}</strong></p>
          <p className="text-sm text-gray-700 mt-2">{request.requestMessage?.slice(0, 200)}</p>
        </div>

        <div className="text-right">
          <p className={`px-2 py-1 rounded text-sm ${request.status === "pending" ? "bg-yellow-100 text-yellow-800" : request.status === "inprogress" ? "bg-blue-100 text-blue-800" : request.status === "done" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
            {request.status}
          </p>
          {showDonor && request.donor && (
            <div className="mt-2 text-sm">
              <p>Donor: {request.donor.name}</p>
              <p>{request.donor.email}</p>
            </div>
          )}
        </div>
      </div>

      {showActions && (
        <div className="mt-3 flex gap-2">
          {request.status === "inprogress" && (
            <>
              <button onClick={() => changeStatus(request._id || request.id, "done")} className="btn btn-sm bg-green-600 text-white">Mark Done</button>
              <button onClick={() => changeStatus(request._id || request.id, "canceled")} className="btn btn-sm bg-gray-300">Cancel</button>
            </>
          )}

          <button onClick={() => navigate(`/dashboard/create-donation-request`)} className="btn btn-sm btn-ghost">Edit</button>
          <button onClick={() => deleteRequest(request._id || request.id)} className="btn btn-sm btn-outline text-red-600">Delete</button>
          <button onClick={() => navigate(`/donation-requests/${request._id || request.id}`)} className="btn btn-sm">View</button>
        </div>
      )}
    </div>
  );
}
