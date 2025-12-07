// src/pages/Auth/Register/Register.jsx
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../../hooks/useAuth";
import axios from "axios";
import { useNavigate, useLoaderData } from "react-router";

const Register = () => {
  const auth = useAuth();
  const registerUser = auth?.registerUser || auth?.register; // MODIFIED: tolerant naming
  const navigate = useNavigate();
  const districtsData = useLoaderData(); // loader returns fetch('/districts.json').then(res=>res.json())

  const [districts, setDistricts] = useState([]);
  const [allUpazilas, setAllUpazilas] = useState([]); // MODIFIED: store full upazila list
  const [upazilas, setUpazilas] = useState([]);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  // MODIFIED: Load districts supporting both shapes: { districts: [...] } or [...]
  useEffect(() => {
    const applyData = (data) => {
      if (!data) return setDistricts([]);
      if (Array.isArray(data)) {
        setDistricts(data);
      } else if (data.districts && Array.isArray(data.districts)) {
        setDistricts(data.districts);
      } else {
        setDistricts([]);
      }
    };

    if (districtsData) {
      applyData(districtsData);
    } else {
      fetch("/districts.json")
        .then(res => res.json())
        .then(data => applyData(data))
        .catch(err => {
          console.error("Failed to load districts fallback:", err);
          setDistricts([]);
        });
    }
  }, [districtsData]);

  // MODIFIED: Fetch upazilas.json (full list) on mount
  useEffect(() => {
    fetch("/upazilas.json")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setAllUpazilas(data);
        } else if (Array.isArray(data.upazilas)) {
          setAllUpazilas(data.upazilas);
        } else {
          console.error("Unexpected upazilas.json structure:", data);
          setAllUpazilas([]);
        }
      })
      .catch(err => {
        console.error("Could not load upazilas.json:", err);
        setAllUpazilas([]);
      });
  }, []);

  // When district changes: find district id and filter upazilas
  const selectedDistrict = watch("district");
  useEffect(() => {
    if (!selectedDistrict) {
      setUpazilas([]);
      return;
    }

    // find the district object to get its id
    // district list objects use .id and .name in your districts.json
    const foundDistrict = districts.find(
      (d) => (d?.name && d.name === selectedDistrict) || (d?.bn_name && d.bn_name === selectedDistrict)
    );

    if (!foundDistrict) {
      // If user selected value that isn't matching name, clear upazilas
      setUpazilas([]);
      return;
    }

    const districtIdStr = String(foundDistrict.id); // ensure string compare
    // Filter upazilas where upazila.district_id === districtId
    const filtered = allUpazilas.filter(
      (u) => String(u.district_id) === districtIdStr || String(u.district_id) === districtIdStr
    );
    setUpazilas(filtered);
  }, [selectedDistrict, districts, allUpazilas]);

  // Upload avatar to ImageBB (env: VITE_IMAGEBB_KEY)
  const uploadImage = async (file) => {
    if (!file) return "";
    const key = import.meta.env.VITE_image_host_key;
    if (!key) {
      console.warn("VITE_IMAGEBB_KEY is not set. Skipping image upload.");
      return "";
    }

    const form = new FormData();
    form.append("image", file);

    try {
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${key}`,
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return res?.data?.data?.url || "";
    } catch (err) {
      console.error("Image upload failed:", err?.response?.data || err.message || err);
      return "";
    }
  };

  // Form submit
  const onSubmit = async (data) => {
    if (data.password !== data.confirm_password) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);

    let avatarUrl = "";

    try {
      if (data.avatar && data.avatar[0]) {
        avatarUrl = await uploadImage(data.avatar[0]);
      }

      const newUser = {
        name: data.name,
        email: data.email,
        password: data.password,
        avatar: avatarUrl,
        bloodGroup: data.bloodGroup,
        district: data.district,
        upazila: data.upazila || "",
        role: "donor",
        status: "active",
      };

      if (typeof registerUser !== "function") {
        console.error("Auth register function not found on context. Did you export register or registerUser?");
        alert("Registration currently unavailable (auth not configured).");
        setLoading(false);
        return;
      }

      const result = await registerUser(newUser); // expects { ok: true } or similar

      setLoading(false);

      if (result?.ok) {
        navigate("/dashboard");
      } else {
        console.error("Registration result:", result);
        alert(result?.error?.message || "Registration failed. Check console for details.");
      }
    } catch (err) {
      setLoading(false);
      console.error("Registration error:", err);
      alert("Registration failed due to an unexpected error.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded-lg my-10">
      <h2 className="text-3xl font-bold text-red-600 mb-4">Create Account</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block mb-1">Full Name</label>
          <input
            type="text"
            className="input input-bordered w-full"
            {...register("name", { required: true })}
          />
          {errors.name && <p className="text-red-500 text-sm">Name is required</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            className="input input-bordered w-full"
            {...register("email", { required: true })}
          />
          {errors.email && <p className="text-red-500 text-sm">Email is required</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block mb-1">Password</label>
          <input
            type="password"
            className="input input-bordered w-full"
            {...register("password", { required: true, minLength: 6 })}
          />
          {errors.password && <p className="text-red-500 text-sm">Password is required (min 6 chars)</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block mb-1">Confirm Password</label>
          <input
            type="password"
            className="input input-bordered w-full"
            {...register("confirm_password", {
              required: true,
              validate: (value) =>
                value === watch("password") || "Passwords do not match",
            })}
          />
          {errors.confirm_password && <p className="text-red-500 text-sm">{errors.confirm_password.message || "Confirm password required"}</p>}
        </div>

        {/* Avatar */}
        <div>
          <label className="block mb-1">Avatar (Optional)</label>
          <input
            type="file"
            className="file-input file-input-bordered w-full"
            {...register("avatar")}
            onInput={(e) => {
              if (e.target.files[0]) {
                setPreview(URL.createObjectURL(e.target.files[0]));
              }
            }}
          />
          {preview && <img src={preview} className="w-20 h-20 rounded-full mt-2 object-cover" alt="avatar preview" />}
        </div>

        {/* Blood Group */}
        <div>
          <label className="block mb-1">Blood Group</label>
          <select
            className="select select-bordered w-full"
            {...register("bloodGroup", { required: true })}
          >
            <option value="">Choose Blood Group</option>
            {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map((bg) => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </select>
          {errors.bloodGroup && <p className="text-red-500 text-sm">Select blood group</p>}
        </div>

        {/* District */}
        <div>
          <label className="block mb-1">District</label>
          <select
            className="select select-bordered w-full"
            {...register("district", { required: true })}
          >
            <option value="">Select District</option>
            {districts?.map((d) => {
              // District object has { id, division_id, name, bn_name, ... }
              const name = d?.name || d?.district || d?.bn_name;
              return <option key={d.id || name} value={name}>{name}</option>;
            })}
          </select>
          {errors.district && <p className="text-red-500 text-sm">Select district</p>}
        </div>

        {/* Upazila */}
        <div>
          <label className="block mb-1">Upazila</label>
          <select
            className="select select-bordered w-full"
            {...register("upazila", { required: !!(upazilas && upazilas.length) })}
            disabled={!upazilas || upazilas.length === 0}
          >
            <option value="">{upazilas && upazilas.length ? "Select Upazila" : "No upazila data"}</option>
            {upazilas?.map((u) => (
              <option key={u.id || u.name || u} value={u.name || u}>
                {u.name || u}
              </option>
            ))}
          </select>
          {(!upazilas || upazilas.length === 0) && (
            <p className="text-sm text-gray-500 mt-1">
              Upazila data loaded from <code>/upazilas.json</code>. If you don't see any, ensure the file contains records.
            </p>
          )}
          {errors.upazila && <p className="text-red-500 text-sm">Select upazila</p>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="btn bg-red-600 text-white w-full hover:bg-red-700"
          disabled={loading}
        >
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>

      <p className="mt-3 text-sm text-gray-600">
        Already have an account?{" "}
        <a href="/login" className="text-red-600 font-semibold">
          Login
        </a>
      </p>
    </div>
  );
};

export default Register;
