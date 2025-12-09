// src/pages/Dashboard/Profile.jsx
import React, { useEffect, useState } from "react";
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
    email: user?.email || firebaseUser?.email || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm({
      name: user?.name || "",
      avatar: user?.avatar || "",
      district: user?.district || "",
      upazila: user?.upazila || "",
      bloodGroup: user?.bloodGroup || "",
      email: user?.email || firebaseUser?.email || "",
    });
  }, [user, firebaseUser]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const save = async () => {
    setError("");
    setSaving(true);

    try {
      // Build payload (do not send email to PATCH)
      const payload = {
        name: form.name,
        avatar: form.avatar,
        district: form.district,
        upazila: form.upazila,
        bloodGroup: form.bloodGroup,
      };

      // Prefer backend id, otherwise fall back to email (user.email || firebaseUser.email)
      const backendId = user?._id || user?.id || null;
      const emailForUpsert = form.email || firebaseUser?.email || user?.email || null;

      if (backendId) {
        // PATCH /users/:id
        // Note: server's PATCH returns { ok: true, data: ... } (not necessarily updated doc)
        await axiosSecure.patch(`/users/${backendId}`, payload);
        // Attempt to fetch fresh user by email (if available) to get latest doc
        if (emailForUpsert) {
          try {
            const fetchRes = await axiosSecure.get("/users", { params: { email: emailForUpsert } });
            const docs = Array.isArray(fetchRes?.data?.data) ? fetchRes.data.data : fetchRes?.data || [];
            const latest = Array.isArray(docs) ? docs[0] : docs;
            if (latest) {
              setUser(latest);
            } else {
              setUser((prev) => ({ ...(prev || {}), ...payload }));
            }
          } catch (e) {
            console.warn("Could not fetch updated user after PATCH:", e);
            setUser((prev) => ({ ...(prev || {}), ...payload }));
          }
        } else {
          setUser((prev) => ({ ...(prev || {}), ...payload }));
        }
      } else if (emailForUpsert) {
        // POST /users (upsert by email)
        const upsertBody = {
          email: emailForUpsert,
          ...payload,
        };
        await axiosSecure.post("/users", upsertBody);

        // Fetch the created/updated doc
        try {
          const fetchRes = await axiosSecure.get("/users", { params: { email: emailForUpsert } });
          const docs = Array.isArray(fetchRes?.data?.data) ? fetchRes.data.data : fetchRes?.data || [];
          const latest = Array.isArray(docs) ? docs[0] : docs;
          if (latest) setUser(latest);
          else setUser((prev) => ({ ...(prev || {}), ...payload, email: emailForUpsert }));
        } catch (e) {
          console.warn("Could not fetch upserted user after POST:", e);
          setUser((prev) => ({ ...(prev || {}), ...payload, email: emailForUpsert }));
        }
      } else {
        // No id and no email — can't save
        throw new Error(
          "No user id or email available to save profile. Make sure you're logged in. Debug: " +
            JSON.stringify({ backendId, emailForUpsert, firebaseEmail: firebaseUser?.email })
        );
      }

      setEditing(false);

      // try refreshUser to re-sync tokens/backend state
      try {
        await refreshUser?.();
      } catch (e) {
        console.warn("refreshUser failed:", e);
      }
    } catch (err) {
      console.error("Save profile error:", err);
      setError(err?.response?.data?.message || err?.message || "Could not save profile");
      alert(err?.response?.data?.message || err?.message || "Could not save profile. Check console.");
    } finally {
      setSaving(false);
    }
  };

  const cancelEdit = () => {
    setForm({
      name: user?.name || "",
      avatar: user?.avatar || "",
      district: user?.district || "",
      upazila: user?.upazila || "",
      bloodGroup: user?.bloodGroup || "",
      email: user?.email || firebaseUser?.email || "",
    });
    setEditing(false);
    setError("");
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Your Profile</h1>

      <div className="bg-white p-6 rounded shadow">
        <div className="flex items-center gap-4 mb-4">
          <img
            src={form.avatar || user?.avatar || "https://via.placeholder.com/80"}
            alt="avatar"
            className="w-20 h-20 rounded-full object-cover border-2 border-red-600"
          />
          <div>
            <h3 className="text-lg font-semibold">{user?.name || "—"}</h3>
            <p className="text-sm text-gray-600">{user?.email || firebaseUser?.email || "—"}</p>
            <p className="text-sm text-gray-600">Role: <span className="capitalize">{user?.role || "user"}</span></p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              disabled={!editing}
              name="name"
              value={form.name}
              onChange={onChange}
              className={`input input-bordered w-full ${!editing ? "bg-gray-100" : ""}`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Email (cannot edit)</label>
            <input
              disabled
              name="email"
              value={form.email}
              readOnly
              className="input input-bordered w-full bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Avatar URL</label>
            <input
              disabled={!editing}
              name="avatar"
              value={form.avatar}
              onChange={onChange}
              placeholder="https://..."
              className={`input input-bordered w-full ${!editing ? "bg-gray-100" : ""}`}
            />
            <p className="text-xs text-gray-500 mt-1">Provide a direct image URL or use registration avatar upload.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">District</label>
              <input
                disabled={!editing}
                name="district"
                value={form.district}
                onChange={onChange}
                className={`input input-bordered w-full ${!editing ? "bg-gray-100" : ""}`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Upazila</label>
              <input
                disabled={!editing}
                name="upazila"
                value={form.upazila}
                onChange={onChange}
                className={`input input-bordered w-full ${!editing ? "bg-gray-100" : ""}`}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Blood Group</label>
            <input
              disabled={!editing}
              name="bloodGroup"
              value={form.bloodGroup}
              onChange={onChange}
              className={`input input-bordered w-full ${!editing ? "bg-gray-100" : ""}`}
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div className="mt-4 flex gap-3">
            {!editing ? (
              <button onClick={() => setEditing(true)} className="btn btn-outline">Edit</button>
            ) : (
              <>
                <button onClick={save} disabled={saving} className="btn bg-red-600 text-white">
                  {saving ? "Saving..." : "Save"}
                </button>
                <button onClick={cancelEdit} disabled={saving} className="btn btn-ghost">Cancel</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
