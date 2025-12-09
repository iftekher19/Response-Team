// src/pages/CreateDonationRequest.jsx
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import useAxios from "../../hooks/useAxios";
import { useNavigate, useLoaderData } from "react-router";

export default function CreateDonationRequest() {
  const { user } = useAuth();
  const axiosSecure = useAxios(); // assumes this returns configured axios instance with baseURL
  const navigate = useNavigate();
  const loaderData = useLoaderData(); // optional districts loader
  const [districts, setDistricts] = useState(() => loaderData?.districts || loaderData || []);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { register, handleSubmit, reset, watch } = useForm({
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

  // Keep form in sync when user info arrives/changes
  useEffect(() => {
    reset((prev) => ({
      ...prev,
      requesterName: user?.name || "",
      requesterEmail: user?.email || "",
    }));
  }, [user, reset]);

  // Load districts.json fallback if loader didn't provide it
  useEffect(() => {
    if (districts && districts.length) return;
    fetch("/districts.json")
      .then((r) => r.json())
      .then((d) => {
        setDistricts(d?.districts || d || []);
      })
      .catch((err) => {
        console.warn("Failed to load districts.json fallback", err);
        setDistricts([]);
      });
  }, [districts]);

  const onSubmit = async (data) => {
    setErrorMessage("");
    setLoading(true);

    try {
      // Ensure requesterEmail always present (server requires it)
      const payload = {
        ...data,
        requesterEmail: data.requesterEmail || user?.email,
        requesterName: data.requesterName || user?.name || "",
        status: "pending",
      };

      if (!payload.requesterEmail) {
        throw new Error("Your account has no email. Please login again or provide an email.");
      }
      if (!payload.recipientName) {
        throw new Error("Recipient name is required.");
      }

      // Use correct endpoint
      const res = await axiosSecure.post("/donation-requests", payload);

      if (res?.data?.ok) {
        navigate("/dashboard/my-donation-requests");
      } else {
        // server responded but not ok
        const msg = res?.data?.message || "Failed to create request";
        setErrorMessage(msg);
        console.warn("Create request returned not ok:", res?.data);
      }
    } catch (err) {
      // Better error reporting
      const serverMsg = err?.response?.data?.message || err?.message || "Failed to create request";
      console.error("Create request error", err);
      setErrorMessage(serverMsg);
    } finally {
      setLoading(false);
    }
  };

  // small convenience: disable submit if recipientName missing
  const recipientName = watch("recipientName");

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Create Donation Request</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded shadow space-y-4">
        <input {...register("requesterName")} type="hidden" />
        <input {...register("requesterEmail")} type="hidden" />

        <div>
          <label className="block mb-1">Recipient Name <span className="text-red-500">*</span></label>
          <input {...register("recipientName", { required: true })} className="input input-bordered w-full" required />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Recipient District</label>
            <select {...register("recipientDistrict")} className="select select-bordered w-full">
              <option value="">Select district</option>
              {districts?.map((d) => (
                <option key={d.id || d.name || d} value={d.name || d}>
                  {d.name || d}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1">Recipient Upazila</label>
            <input {...register("recipientUpazila")} className="input input-bordered w-full" />
          </div>
        </div>

        <div>
          <label className="block mb-1">Hospital Name</label>
          <input {...register("hospitalName")} className="input input-bordered w-full" />
        </div>

        <div>
          <label className="block mb-1">Full Address</label>
          <input {...register("fullAddress")} className="input input-bordered w-full" />
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-1">Blood Group</label>
            <select {...register("bloodGroup")} className="select select-bordered w-full">
              <option value="">Select</option>
              {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1">Date</label>
            <input {...register("donationDate")} type="date" className="input input-bordered w-full" />
          </div>
          <div>
            <label className="block mb-1">Time</label>
            <input {...register("donationTime")} type="time" className="input input-bordered w-full" />
          </div>
        </div>

        <div>
          <label className="block mb-1">Request Message</label>
          <textarea {...register("requestMessage")} className="textarea textarea-bordered w-full" rows="4"></textarea>
        </div>

        {errorMessage && <p className="text-red-600 text-sm">{errorMessage}</p>}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading || !recipientName}
            className="btn bg-red-600 text-white"
          >
            {loading ? "Creating..." : "Create Request"}
          </button>
          <button type="button" onClick={() => navigate("/dashboard")} className="btn btn-ghost">Cancel</button>
        </div>
      </form>
    </div>
  );
}
