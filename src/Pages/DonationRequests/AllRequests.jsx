// src/pages/Dashboard/AllRequests.jsx
import React, { useEffect, useState } from "react";
import useAxios from "../../hooks/useAxios";
import RequestCard from "../../Components/Request/RequestCard";

export default function AllRequests() {
  const axiosSecure = useAxios();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Optional filters
  const [filter, setFilter] = useState({
    status: "",
    bloodGroup: "",
    district: "",
    upazila: "",
    requesterEmail: "",
  });

  const fetchRequests = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await axiosSecure.get("/donation-requests", {
        params: {
          status: filter.status || undefined,
          bloodGroup: filter.bloodGroup || undefined,
          district: filter.district || undefined,
          upazila: filter.upazila || undefined,
          requesterEmail: filter.requesterEmail || undefined,
          limit: 200,
        },
      });

      setRequests(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (err) {
      console.error("Failed to load requests", err);
      setError(err?.response?.data?.message || "Failed to load requests");
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleFilterChange = (e) =>
    setFilter({ ...filter, [e.target.name]: e.target.value });

  const applyFilters = () => fetchRequests();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">All Donation Requests</h1>

      {/* ---------- Filters UI ---------- */}
      <div className="bg-white p-4 rounded shadow grid md:grid-cols-4 gap-4">
        <select
          name="status"
          value={filter.status}
          onChange={handleFilterChange}
          className="select select-bordered w-full"
        >
          <option value="">Status</option>
          <option value="pending">Pending</option>
          <option value="inprogress">In Progress</option>
          <option value="done">Done</option>
          <option value="canceled">Canceled</option>
        </select>

        <select
          name="bloodGroup"
          value={filter.bloodGroup}
          onChange={handleFilterChange}
          className="select select-bordered w-full"
        >
          <option value="">Blood Group</option>
          {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map((bg) => (
            <option key={bg} value={bg}>{bg}</option>
          ))}
        </select>

        <input
          name="district"
          value={filter.district}
          onChange={handleFilterChange}
          className="input input-bordered w-full"
          placeholder="District"
        />

        <input
          name="upazila"
          value={filter.upazila}
          onChange={handleFilterChange}
          className="input input-bordered w-full"
          placeholder="Upazila"
        />

        <input
          name="requesterEmail"
          value={filter.requesterEmail}
          onChange={handleFilterChange}
          className="input input-bordered w-full md:col-span-2"
          placeholder="Requester Email"
        />

        <button
          className="btn bg-blue-600 text-white md:col-span-2"
          onClick={applyFilters}
        >
          Apply Filters
        </button>
      </div>

      {/* ---------- Results ---------- */}
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : requests.length ? (
        <div className="space-y-4">
          {requests.map((req) => (
            <RequestCard
              key={req._id}
              request={req}
              showActions={false} // change to true if admin wants actions
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No donation requests found.</p>
      )}
    </div>
  );
}
