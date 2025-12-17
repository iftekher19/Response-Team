import React, { useEffect, useState } from "react";
import useAxios from "../../hooks/useAxios";
import useAuth from "../../hooks/useAuth";
import RequestCard from "../../Components/Request/RequestCard";
import { Link, useNavigate } from "react-router";

export default function AllRequests() {
  const axiosSecure = useAxios();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState(""); 
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const params = { page, limit };
        if (statusFilter) params.status = statusFilter;
        if (!user) {
          setRequests([]);
          return;
        }
        // call backend
        const res = await axiosSecure.get("/donation-requests", { params }).catch((e) => {
          console.warn("GET /donation-requests failed", e?.response?.data || e?.message || e);
          return null;
        });

        if (!mounted) return;
        let payload = res?.data ?? res;
        if (payload?.ok && payload.data) payload = payload.data;
        // normalize
        const arr = Array.isArray(payload) ? payload : (Array.isArray(payload?.data) ? payload.data : []);
        setRequests(arr);
      } catch (err) {
        console.error("AllRequests load error", err);
        setError("Failed to load requests");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [axiosSecure, statusFilter, page, limit, user]);

  // actions
  const changeStatus = async (id, newStatus) => {
    try {
      await axiosSecure.patch(`/donation-requests/${id}`, { status: newStatus });
      setRequests((p) => p.map(r => (r._id === id ? { ...r, status: newStatus } : r)));
    } catch (err) {
      console.error("changeStatus err", err);
      alert("Could not change status");
    }
  };

  const deleteRequest = async (id) => {
    if (!confirm("Delete this request?")) return;
    try {
      await axiosSecure.delete(`/donation-requests/${id}`);
      setRequests((p) => p.filter(r => r._id !== id));
    } catch (err) {
      console.error("deleteRequest err", err);
      alert("Could not delete request");
    }
  };

  // permission guard (only admins & volunteers should use this page)
  if (!user) {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <p className="text-gray-500 mb-3">Please sign in to view requests</p>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl font-medium shadow-lg shadow-red-200 hover:shadow-red-300 transition-all"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}
  if (!["admin","volunteer"].includes(user.role)) {
    return <div className="text-gray-600">You do not have permission to view all requests.</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">All Donation Requests</h1>

      <div className="mb-4 flex items-center gap-3">
        <select className="select select-bordered" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="inprogress">In Progress</option>
          <option value="done">Done</option>
          <option value="canceled">Canceled</option>
        </select>

        <button className="btn btn-ghost" onClick={() => { setStatusFilter(""); setPage(1); }}>Reset</button>
      </div>

      {loading ? (
        <div>Loading requests...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : requests.length ? (
        <div className="space-y-3">
          {requests.map(r => (
            <div key={r._id || r.id} className="bg-white p-3 rounded shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold">{r.recipientName} <span className="text-sm text-gray-500">({r.bloodGroup})</span></h3>
                  <p className="text-sm text-gray-600">{r.recipientDistrict} • {r.recipientUpazila}</p>
                  <p className="text-sm mt-1">{r.requestMessage?.slice(0, 200)}</p>
                </div>

                <div className="text-right ml-4">
                  <p className="text-sm mb-2">{r.donationDate} {r.donationTime}</p>
                  <p className="px-2 py-1 rounded text-sm bg-gray-100">{r.status}</p>
                </div>
              </div>

              <div className="mt-3 flex gap-2">
                {/* Admin can mark done/cancel from inprogress */}
                {r.status === "inprogress" && (
                  <>
                    <button className="btn btn-sm bg-green-600 text-white" onClick={() => changeStatus(r._id, "done")}>Mark Done</button>
                    <button className="btn btn-sm" onClick={() => changeStatus(r._id, "canceled")}>Cancel</button>
                  </>
                )}

                {/* Edit / View */}
                <button className="btn btn-sm btn-ghost" onClick={() => navigate(`/donation-requests/${r._id}`)}>View</button>
                <button className="btn btn-sm btn-ghost" onClick={() => navigate(`/dashboard/create-donation-request?edit=${r._id}`)}>Edit</button>

                {/* Delete */}
                <button className="btn btn-sm btn-outline text-red-600" onClick={() => deleteRequest(r._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No donation requests found.</p>
      )}

      <div className="mt-4 flex gap-2 items-center">
        <button className="btn btn-sm" onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}>Prev</button>
        <span>Page {page}</span>
        <button className="btn btn-sm" onClick={() => setPage(p => p+1)}>Next</button>
      </div>
    </div>
  );
}
