import React, { useState } from "react";
import useAuth from "../../hooks/useAuth";
import useAxios from "../../hooks/useAxios";

export default function Profile() {
  const { user, setUser, firebaseUser, refreshUser } = useAuth();
  const axiosSecure = useAxios();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    avatar: user?.avatar || "",
    district: user?.district || "",
    upazila: user?.upazila || "",
    bloodGroup: user?.bloodGroup || "",
  });
  const [saving, setSaving] = useState(false);

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const save = async () => {
    setSaving(true);
    try {
      // MODIFY: update profile endpoint
      const res = await axiosSecure.put(`/users/${user._id || user.email}/profile`, form).catch(() => null);
      if (res?.data) {
        setUser(res.data);
      } else {
        // fallback: optimistic update locally
        setUser((p) => ({ ...p, ...form }));
      }
      setEditing(false);
      await refreshUser?.();
    } catch (err) {
      console.error("Save profile error", err);
      alert("Could not save profile. Check console.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold mb-4">Your Profile</h1>

      <div className="bg-white p-6 rounded shadow">
        <div className="flex items-center gap-4 mb-4">
          <img src={form.avatar || user?.avatar || "https://via.placeholder.com/80"} alt="avatar" className="w-20 h-20 rounded-full object-cover border-2 border-red-600" />
          <div>
            <h3 className="text-lg font-semibold">{user?.name}</h3>
            <p className="text-sm text-gray-600">{user?.email}</p>
            <p className="text-sm text-gray-600">Role: <span className="capitalize">{user?.role}</span></p>
          </div>
        </div>

        <div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input disabled={!editing} name="name" value={form.name} onChange={onChange} className={`input input-bordered w-full ${!editing && "bg-gray-100"}`} />
            </div>

            <div>
              <label className="block text-sm font-medium">District</label>
              <input disabled={!editing} name="district" value={form.district} onChange={onChange} className={`input input-bordered w-full ${!editing && "bg-gray-100"}`} />
            </div>

            <div>
              <label className="block text-sm font-medium">Upazila</label>
              <input disabled={!editing} name="upazila" value={form.upazila} onChange={onChange} className={`input input-bordered w-full ${!editing && "bg-gray-100"}`} />
            </div>

            <div>
              <label className="block text-sm font-medium">Blood Group</label>
              <input disabled={!editing} name="bloodGroup" value={form.bloodGroup} onChange={onChange} className={`input input-bordered w-full ${!editing && "bg-gray-100"}`} />
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            {!editing ? (
              <button onClick={() => setEditing(true)} className="btn btn-outline">Edit</button>
            ) : (
              <>
                <button onClick={save} disabled={saving} className="btn bg-red-600 text-white">{saving ? "Saving..." : "Save"}</button>
                <button onClick={() => { setEditing(false); setForm({ name: user?.name || "", avatar: user?.avatar || "", district: user?.district || "", upazila: user?.upazila || "", bloodGroup: user?.bloodGroup || "" }); }} className="btn btn-ghost">Cancel</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
