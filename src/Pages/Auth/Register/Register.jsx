import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../../hooks/useAuth";
import axios from "axios";
import { useNavigate, useLoaderData } from "react-router";

const Register = () => {
  const auth = useAuth();
  const registerUser = auth?.register || auth?.registerUser;
  const navigate = useNavigate();
  const districtsData = useLoaderData(); 

  const [districts, setDistricts] = useState([]);
  const [allUpazilas, setAllUpazilas] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  // Load districts from loader data or fallback to /districts.json
  useEffect(() => {
    const applyData = (data) => {
      if (!data) return setDistricts([]);
      if (Array.isArray(data)) return setDistricts(data);
      if (data.districts && Array.isArray(data.districts)) return setDistricts(data.districts);
      const arr = Object.values(data).find((v) => Array.isArray(v));
      return setDistricts(arr || []);
    };

    if (districtsData) {
      applyData(districtsData);
    } else {
      fetch("/districts.json")
        .then((r) => r.json())
        .then((d) => applyData(d))
        .catch((err) => {
          console.warn("Failed to load districts.json fallback:", err);
          setDistricts([]);
        });
    }
  }, [districtsData]);

  // load upazilas.json (full list)
  useEffect(() => {
    fetch("/upazilas.json")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setAllUpazilas(data);
        else if (Array.isArray(data.upazilas)) setAllUpazilas(data.upazilas);
        else {
          const arr = Object.values(data).find((v) => Array.isArray(v));
          setAllUpazilas(arr || []);
        }
      })
      .catch((err) => {
        console.warn("Could not load /upazilas.json", err);
        setAllUpazilas([]);
      });
  }, []);

  // When district selection changes, filter upazilas
  const selectedDistrict = watch("district");
  useEffect(() => {
    if (!selectedDistrict) {
      setUpazilas([]);
      return;
    }
    const found = districts.find(
      (d) => d.name === selectedDistrict || d.bn_name === selectedDistrict || String(d.id) === String(selectedDistrict)
    );
    const districtId = found?.id || found?.district_id || null;
    const filtered = allUpazilas.filter(
      (u) =>
        String(u.district_id) === String(districtId) ||
        u.district_name === selectedDistrict ||
        u.district === selectedDistrict
    );
    setUpazilas(filtered);
  }, [selectedDistrict, districts, allUpazilas]);

  // watch avatar file input and set preview via effect 
  const watchedAvatar = watch("avatar");
  useEffect(() => {
    if (watchedAvatar && watchedAvatar[0]) {
      const file = watchedAvatar[0];
      const url = URL.createObjectURL(file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreview(null);
    }
  }, [watchedAvatar]);

  // Upload avatar to imgbb 
  const uploadImage = async (file) => {
    if (!file) return "";
    const key = import.meta.env.VITE_image_host_key || import.meta.env.VITE_IMAGE_HOST_KEY || import.meta.env.VITE_IMAGEBB_KEY;
    if (!key) {
      console.warn("Image host key not set (VITE_image_host_key). Skipping image upload.");
      return "";
    }

    const form = new FormData();
    form.append("image", file);

    try {
      const res = await axios.post(`https://api.imgbb.com/1/upload?key=${key}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res?.data?.data?.url || "";
    } catch (err) {
      console.error("Image upload failed:", err?.response?.data || err.message || err);
      return "";
    }
  };

  const onSubmit = async (data) => {
    // basic client validation for password match
    if (data.password !== data.confirm_password) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      // upload avatar file if present and set avatarUrl
      let avatarUrl = "";
      if (data.avatar && data.avatar[0]) {
        avatarUrl = await uploadImage(data.avatar[0]);
      }

      // Build payload matching AuthProvider.register signature
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        avatarUrl: avatarUrl || "", 
        bloodGroup: data.bloodGroup || "",
        district: data.district || "",
        upazila: data.upazila || "",
      };

      if (typeof registerUser !== "function") {
        console.error("Auth register function not found on context. AuthProvider may not be wired correctly.");
        alert("Registration unavailable (auth not configured).");
        setLoading(false);
        return;
      }

      // Call provider register 
      const result = await registerUser(payload);

      setLoading(false);

      if (result?.ok) {
        navigate("/dashboard");
      } else {
        console.error("Registration failed result:", result);
        const msg = result?.error?.message || (result?.error && result.error.toString()) || "Registration failed";
        alert(msg);
      }
    } catch (err) {
      console.error("Registration error:", err);
      alert("Registration failed. See console for details.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded-lg my-10">
      <h2 className="text-3xl font-bold text-red-600 mb-4">Create Account</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block mb-1 text-gray-700 font-medium">Full Name</label>
          <input type="text" className="input input-bordered w-full" {...register("name", { required: true })} />
          {errors.name && <p className="text-red-500 text-sm">Name is required</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1 text-gray-700 font-medium">Email</label>
          <input type="email" className="input input-bordered w-full" {...register("email", { required: true })} />
          {errors.email && <p className="text-red-500 text-sm">Email is required</p>}
        </div>

        {/* Password */}
        <div>
          <label className="block mb-1 text-gray-700 font-medium">Password</label>
          <input type="password" className="input input-bordered w-full" {...register("password", { required: true, minLength: 6 })} />
          {errors.password && <p className="text-red-500 text-sm">Password is required (min 6 chars)</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block mb-1 text-gray-700 font-medium">Confirm Password</label>
          <input
            type="password"
            className="input input-bordered w-full"
            {...register("confirm_password", {
              required: true,
              validate: (val) => val === watch("password") || "Passwords do not match",
            })}
          />
          {errors.confirm_password && <p className="text-red-500 text-sm">{errors.confirm_password.message || "Confirm password required"}</p>}
        </div>

        {/* Avatar */}
        <div>
          <label className="block mb-1 text-gray-700 font-medium">Avatar (Optional)</label>
          <input type="file" className="file-input file-input-bordered w-full" {...register("avatar")} />
          {preview && <img src={preview} className="w-20 h-20 rounded-full mt-2 object-cover" alt="avatar preview" />}
        </div>

        {/* Blood Group */}
        <div>
          <label className="block mb-1 text-gray-700 font-medium">Blood Group</label>
          <select className="select select-bordered w-full" {...register("bloodGroup", { required: true })}>
            <option value="">Choose Blood Group</option>
            {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map((bg) => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </select>
          {errors.bloodGroup && <p className="text-red-500 text-sm">Select blood group</p>}
        </div>

        {/* District */}
        <div>
          <label className="block mb-1 text-gray-700 font-medium">District</label>
          <select className="select select-bordered w-full" {...register("district", { required: true })}>
            <option value="">Select District</option>
            {districts?.map((d) => {
              const name = d?.name || d?.district || d?.bn_name || d;
              return <option key={d.id || name} value={name}>{name}</option>;
            })}
          </select>
          {errors.district && <p className="text-red-500 text-sm">Select district</p>}
        </div>

        {/* Upazila */}
        <div>
          <label className="block mb-1 text-gray-700 font-medium">Upazila</label>
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
          {errors.upazila && <p className="text-red-500 text-sm">Select upazila</p>}
          {/* {(!upazilas || upazilas.length === 0) && (
            <p className="text-sm text-gray-500 mt-1">Upazila data loaded from <code>/upazilas.json</code>. If absent, ensure the file contains records.</p>
          )} */}
        </div>

        <button type="submit" className="btn bg-red-600 text-white w-full hover:bg-red-700" disabled={loading}>
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>

      <p className="mt-3 text-sm text-gray-600">
        Already have an account?{" "}
        <a href="/login" className="text-red-600 font-semibold">Login</a>
      </p>
    </div>
  );
};

export default Register;
