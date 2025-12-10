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

  const [districts, setDistricts] = useState([]);
  const [allUpazilas, setAllUpazilas] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
  } = useForm({
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

  // ---------- DISTRICTS: loader or fallback ----------
  useEffect(() => {
    const applyDistricts = (data) => {
      if (!data) {
        setDistricts([]);
        return;
      }
      if (Array.isArray(data)) {
        setDistricts(data);
      } else if (Array.isArray(data.districts)) {
        setDistricts(data.districts);
      } else {
        const arr = Object.values(data).find((v) => Array.isArray(v));
        setDistricts(arr || []);
      }
    };

    if (loader) {
      applyDistricts(loader);
    } else {
      fetch("/districts.json")
        .then((r) => r.json())
        .then((d) => applyDistricts(d))
        .catch(() => setDistricts([]));
    }
  }, [loader]);

  // ---------- UPAZILAS: load master list ----------
  useEffect(() => {
    fetch("/upazilas.json")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setAllUpazilas(data);
        else if (Array.isArray(data.upazilas)) setAllUpazilas(data.upazilas);
        else setAllUpazilas([]);
      })
      .catch(() => setAllUpazilas([]));
  }, []);

  // ---------- FORM RESET: create vs edit ----------
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

  // ---------- UPAZILA FILTERING BASED ON SELECTED DISTRICT ----------
  const selectedDistrict = watch("recipientDistrict");

  useEffect(() => {
    if (!selectedDistrict) {
      setUpazilas([]);
      setValue("recipientUpazila", "");
      return;
    }

    // Find district object in districts.json
    const found = districts.find(
      (d) =>
        d.name === selectedDistrict ||
        d.bn_name === selectedDistrict ||
        String(d.id) === String(selectedDistrict)
    );

    const districtId = found?.id || found?.district_id || null;

    const filtered = allUpazilas.filter(
      (u) =>
        String(u.district_id) === String(districtId) ||
        u.district_name === selectedDistrict ||
        u.district === selectedDistrict
    );

    setUpazilas(filtered);

    // If user changed district, clear previous upazila selection
    setValue("recipientUpazila", "");
  }, [selectedDistrict, districts, allUpazilas, setValue]);

  // ---------- SUBMIT ----------
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = { ...data };

      // For create, ensure requester info & status set here
      if (!isEdit) {
        payload.requesterName = user?.name || data.requesterName || "";
        payload.requesterEmail = user?.email || data.requesterEmail || "";
        payload.status = "pending";
      }

      if (isEdit) {
        // EDIT MODE: update existing request
        const id = editingRequest._id || editingRequest.id;
        const res = await axiosSecure.patch(`/requests/${id}`, payload);
        if (res?.data?.ok) {
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
        {/* hidden requester (from auth or existing request) */}
        <input {...register("requesterName")} type="hidden" />
        <input {...register("requesterEmail")} type="hidden" />

        <div>
          <label className="block mb-1">Recipient Name</label>
          <input
            {...register("recipientName", { required: true })}
            className="input input-bordered w-full"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Recipient District</label>
            <select
              {...register("recipientDistrict", { required: true })}
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
            <select
              {...register("recipientUpazila", {
                required: !!(upazilas && upazilas.length),
              })}
              className="select select-bordered w-full"
              disabled={!upazilas || upazilas.length === 0}
            >
              <option value="">
                {upazilas && upazilas.length ? "Select upazila" : "No upazila data"}
              </option>
              {upazilas?.map((u) => (
                <option key={u.id || u.name || u} value={u.name || u}>
                  {u.name || u}
                </option>
              ))}
            </select>
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
              {...register("bloodGroup", { required: true })}
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
