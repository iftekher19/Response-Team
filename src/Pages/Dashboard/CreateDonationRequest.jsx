// src/pages/Dashboard/CreateDonationRequest.jsx
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import useAxios from "../../hooks/useAxios";
import { useNavigate, useLoaderData, useLocation } from "react-router";

export default function CreateDonationRequest() {
  const { user } = useAuth();
  const axiosSecure = useAxios();
  const navigate = useNavigate();
  const loader = useLoaderData?.(); // optional districts loader
  const location = useLocation();

  // If we came from "Edit" button, request object is here
  const editingRequest = location.state?.request || null;
  const isEdit = !!editingRequest;

  const [districts, setDistricts] = useState(loader || []);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      requesterName: user?.name || "",
      requesterEmail: user?.email || "",
      recipientName: "",
      recipientDistrict: "",
      recipientUpazila: "",
      hospitalName: "",
      fullAddress: "",
      bloodGroup: "",
      donationDate: "",
      donationTime: "",
      requestMessage: "",
    },
  });

  // Apply form values when user or editingRequest changes
  useEffect(() => {
    if (isEdit && editingRequest) {
      reset({
        requesterName: editingRequest.requesterName || user?.name || "",
        requesterEmail: editingRequest.requesterEmail || user?.email || "",
        recipientName: editingRequest.recipientName || "",
        recipientDistrict: editingRequest.recipientDistrict || "",
        recipientUpazila: editingRequest.recipientUpazila || "",
        hospitalName: editingRequest.hospitalName || "",
        fullAddress: editingRequest.fullAddress || "",
        bloodGroup: editingRequest.bloodGroup || "",
        donationDate: editingRequest.donationDate || "",
        donationTime: editingRequest.donationTime || "",
        requestMessage: editingRequest.requestMessage || "",
      });
    } else {
      reset({
        requesterName: user?.name || "",
        requesterEmail: user?.email || "",
        recipientName: "",
        recipientDistrict: "",
        recipientUpazila: "",
        hospitalName: "",
        fullAddress: "",
        bloodGroup: "",
        donationDate: "",
        donationTime: "",
        requestMessage: "",
      });
    }
  }, [isEdit, editingRequest, user, reset]);

  // Load districts if not provided through loader
  useEffect(() => {
    if (!loader) {
      fetch("/districts.json")
        .then((r) => r.json())
        .then((d) => setDistricts(d?.districts || d || []))
        .catch(() => {});
    }
  }, [loader]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
        ...data,
      };

      // For create, ensure requester info & status set here
      if (!isEdit) {
        payload.requesterName = user?.name || data.requesterName || "";
        payload.requesterEmail = user?.email || data.requesterEmail || "";
        payload.status = "pending";
      }

      if (isEdit) {
        // EDIT MODE: update existing request
        const id = editingRequest._id || editingRequest.id;
        // Backend PATCH /requests/:id only allows certain fields
        // (status, donorName, donorEmail, donationDate, donationTime, requestMessage)
        // If you also allowed other fields on backend, this payload will update them.
        const res = await axiosSecure.patch(`/requests/${id}`, payload);
        if (res?.data?.ok) {
          // After admin edit, go back to All Requests, for donor back to My Requests
          if (user?.role === "admin" || user?.role === "volunteer") {
            navigate("/dashboard/all-blood-donation-request");
          } else {
            navigate("/dashboard/my-donation-requests");
          }
        } else {
          alert("Failed to update request");
        }
      } else {
        // CREATE MODE: create new request
        const res = await axiosSecure.post("/requests", payload);
        if (res?.data?.ok) {
          navigate("/dashboard/my-donation-requests");
        } else {
          alert("Failed to create request");
        }
      }
    } catch (err) {
      console.error(isEdit ? "Update request error" : "Create request error", err);
      alert(isEdit ? "Failed to update request" : "Failed to create request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold mb-4">
        {isEdit ? "Edit Donation Request" : "Create Donation Request"}
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded shadow space-y-4"
      >
        {/* keep requester hidden (comes from auth / existing request) */}
        <input {...register("requesterName")} type="hidden" />
        <input {...register("requesterEmail")} type="hidden" />

        <div>
          <label className="block mb-1">Recipient Name</label>
          <input
            {...register("recipientName")}
            className="input input-bordered w-full"
            required
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Recipient District</label>
            <select
              {...register("recipientDistrict")}
              className="select select-bordered w-full"
            >
              <option value="">Select district</option>
              {districts?.map((d) => (
                <option key={d.id || d.name} value={d.name || d}>
                  {d.name || d}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1">Recipient Upazila</label>
            <input
              {...register("recipientUpazila")}
              className="input input-bordered w-full"
            />
          </div>
        </div>

        <div>
          <label className="block mb-1">Hospital Name</label>
          <input
            {...register("hospitalName")}
            className="input input-bordered w-full"
          />
        </div>

        <div>
          <label className="block mb-1">Full Address</label>
          <input
            {...register("fullAddress")}
            className="input input-bordered w-full"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-1">Blood Group</label>
            <select
              {...register("bloodGroup")}
              className="select select-bordered w-full"
            >
              <option value="">Select</option>
              {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1">Date</label>
            <input
              {...register("donationDate")}
              type="date"
              className="input input-bordered w-full"
            />
          </div>
          <div>
            <label className="block mb-1">Time</label>
            <input
              {...register("donationTime")}
              type="time"
              className="input input-bordered w-full"
            />
          </div>
        </div>

        <div>
          <label className="block mb-1">Request Message</label>
          <textarea
            {...register("requestMessage")}
            className="textarea textarea-bordered w-full"
            rows="4"
          ></textarea>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="btn bg-red-600 text-white"
          >
            {loading
              ? isEdit
                ? "Updating..."
                : "Creating..."
              : isEdit
              ? "Update Request"
              : "Create Request"}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn btn-ghost"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
