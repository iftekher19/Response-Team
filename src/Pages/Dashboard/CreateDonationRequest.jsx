import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import useAxios from "../../hooks/useAxios";
import { useNavigate, useLoaderData } from "react-router";

export default function CreateDonationRequest() {
  const { user } = useAuth();
  const axiosSecure = useAxios();
  const navigate = useNavigate();
  const loader = useLoaderData?.(); // optional districts loader
  const [districts, setDistricts] = useState(loader || []);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit } = useForm({
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

  useEffect(() => {
    if (!loader) {
      fetch("/districts.json").then(r => r.json()).then(d => setDistricts(d?.districts || d || [])).catch(() => {});
    }
  }, [loader]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // MODIFY endpoint
      const res = await axiosSecure.post("/requests", { ...data, status: "pending" });
      if (res?.data) {
        navigate("/dashboard/my-donation-requests");
      } else {
        alert("Failed to create request");
      }
    } catch (err) {
      console.error("Create request error", err);
      alert("Failed to create request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold mb-4">Create Donation Request</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded shadow space-y-4">
        <input {...register("requesterName")} type="hidden" />
        <input {...register("requesterEmail")} type="hidden" />
        <div>
          <label className="block mb-1">Recipient Name</label>
          <input {...register("recipientName")} className="input input-bordered w-full" required />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Recipient District</label>
            <select {...register("recipientDistrict")} className="select select-bordered w-full">
              <option value="">Select district</option>
              {districts?.map(d => <option key={d.id || d.name} value={d.name || d}>{d.name || d}</option>)}
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
              {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map(b => <option key={b} value={b}>{b}</option>)}
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

        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="btn bg-red-600 text-white">{loading ? "Creating..." : "Create Request"}</button>
          <button type="button" onClick={() => navigate("/dashboard")} className="btn btn-ghost">Cancel</button>
        </div>
      </form>
    </div>
  );
}
