import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import useAxios from "../../hooks/useAxios";
import useAuth from "../../hooks/useAuth";

export default function RequestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxios();
  const { user, loading: authLoading } = useAuth();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [donateModalOpen, setDonateModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  // If not logged in (after auth finishes), redirect to login
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login", {
        replace: true,
        state: { from: `/donation-requests/${id}` },
      });
    }
  }, [authLoading, user, id, navigate]);

  // Load request details
  useEffect(() => {
    if (!id) return;

    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        // Prefer canonical route; fall back to /requests/:id
        const res = await axiosSecure
          .get(`/donation-requests/${id}`)
          .catch((e) => {
            console.warn(
              "GET /donation-requests/:id failed, trying /requests/:id",
              e?.response?.data || e?.message || e
            );
            return axiosSecure.get(`/requests/${id}`);
          });

        if (!mounted) return;

        let data = res?.data ?? res;
        if (data && data.ok && data.data) data = data.data;

        setRequest(data || null);
      } catch (err) {
        console.error("RequestDetails load error:", err);
        if (mounted) {
          setError("Failed to load donation request details.");
          setRequest(null);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [axiosSecure, id]);

  // Can this user donate?
  const canDonate =
    !!user &&
    !!request &&
    request.status === "pending" &&
    request.requesterEmail !== user.email; // prevent donating to own request

  const openDonateModal = () => {
    if (!user) {
      navigate("/login", { state: { from: `/donation-requests/${id}` } });
      return;
    }
    setDonateModalOpen(true);
  };

  const confirmDonation = async () => {
    if (!user || !request?._id) return;
    setActionLoading(true);
    try {
      const payload = {
        status: "inprogress",
        donorName: user.name || user.displayName || "",
        donorEmail: user.email,
      };

      // server exposes PATCH /requests/:id for status/donor updates
      await axiosSecure.patch(`/requests/${request._id}`, payload);

      // reflect change locally
      setRequest((prev) =>
        prev
          ? {
              ...prev,
              ...payload,
            }
          : prev
      );

      setDonateModalOpen(false);
      alert("Thank you! Donation status is now in progress.");
    } catch (err) {
      console.error("Confirm donation error:", err);
      alert("Could not update donation status. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="p-6 bg-white rounded shadow">
        Loading request details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white rounded shadow text-red-600">
        {error}
      </div>
    );
  }

  if (!request) {
    return (
      <div className="p-6 bg-white rounded shadow text-gray-600">
        Donation request not found.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">
        Blood Donation Request Details
      </h1>

      <div className="bg-white p-6 rounded shadow space-y-4">
        {/* Header: recipient & status */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">{request.recipientName}</h2>
            <p className="text-sm text-gray-600">
              {request.recipientDistrict}{" "}
              {request.recipientUpazila
                ? `• ${request.recipientUpazila}`
                : ""}
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              request.status === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : request.status === "inprogress"
                ? "bg-blue-100 text-blue-800"
                : request.status === "done"
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {request.status}
          </span>
        </div>

        {/* Hospital & address */}
        <div>
          <h3 className="font-medium mb-1">Hospital & Address</h3>
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Hospital:</span>{" "}
            {request.hospitalName || "N/A"}
          </p>
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Full Address:</span>{" "}
            {request.fullAddress || "N/A"}
          </p>
        </div>

        {/* Blood info & schedule */}
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <h3 className="font-medium mb-1">Blood Group</h3>
            <p className="text-lg font-semibold text-red-600">
              {request.bloodGroup || "N/A"}
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-1">Donation Date</h3>
            <p className="text-sm text-gray-700">
              {request.donationDate || "N/A"}
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-1">Donation Time</h3>
            <p className="text-sm text-gray-700">
              {request.donationTime || "N/A"}
            </p>
          </div>
        </div>

        {/* Message */}
        <div>
          <h3 className="font-medium mb-1">Request Message</h3>
          <p className="text-sm text-gray-700 whitespace-pre-line">
            {request.requestMessage || "No additional message provided."}
          </p>
        </div>

        {/* Requester & donor info */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium mb-1">Requested By</h3>
            <p className="text-sm text-gray-700">
              {request.requesterName || "N/A"}
            </p>
            <p className="text-sm text-gray-700">
              {request.requesterEmail || "N/A"}
            </p>
          </div>

          {(request.donorName || request.donorEmail) && (
            <div>
              <h3 className="font-medium mb-1">Donor Information</h3>
              <p className="text-sm text-gray-700">
                {request.donorName || "N/A"}
              </p>
              <p className="text-sm text-gray-700">
                {request.donorEmail || "N/A"}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-ghost"
            type="button"
          >
            Back
          </button>

          {canDonate && (
            <button
              type="button"
              onClick={openDonateModal}
              className="btn bg-red-600 text-white"
            >
              Donate
            </button>
          )}
        </div>
      </div>

      {/* Donate Modal */}
      {donateModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-3">Confirm Donation</h2>
            <p className="text-sm text-gray-600 mb-4">
              Please confirm your information before donating. After
              confirmation, this request status will change from{" "}
              <strong>pending</strong> to <strong>in progress</strong>.
            </p>

            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Donor Name
                </label>
                <input
                  type="text"
                  readOnly
                  className="input input-bordered w-full bg-gray-100"
                  value={user?.name || user?.displayName || ""}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Donor Email
                </label>
                <input
                  type="email"
                  readOnly
                  className="input input-bordered w-full bg-gray-100"
                  value={user?.email || ""}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setDonateModalOpen(false)}
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn bg-red-600 text-white"
                onClick={confirmDonation}
                disabled={actionLoading}
              >
                {actionLoading ? "Confirming..." : "Confirm Donation"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
