// src/pages/Dashboard/AllUsers.jsx
import React, { useEffect, useState } from "react";
import useAxios from "../../hooks/useAxios";
import useAuth from "../../hooks/useAuth";

export default function AllUsers() {
  const axiosSecure = useAxios();
  const { user } = useAuth();

  const [users, setUsers] = useState([]);
  const [statusFilter, setStatusFilter] = useState(""); // "", "active", "blocked"
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const params = {};
        if (statusFilter) params.status = statusFilter;
        const res = await axiosSecure.get("/users", { params }).catch((e) => { console.warn(e); return null; });
        let payload = res?.data ?? res;
        if (payload?.ok && payload.data) payload = payload.data;
        const arr = Array.isArray(payload) ? payload : (Array.isArray(payload?.data) ? payload.data : []);
        if (mounted) setUsers(arr);
      } catch (err) {
        console.error("AllUsers load error", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    if (user?.role === "admin") load();
    return () => { mounted = false; };
  }, [axiosSecure, statusFilter, user?.role]);

  if (!user) return <div>Please login.</div>;
  if (user.role !== "admin") return <div>You do not have permission to view users.</div>;

  const changeRole = async (id, newRole) => {
    try {
      await axiosSecure.patch(`/users/${id}/role`, { role: newRole });
      setUsers(p => p.map(u => (String(u._id) === String(id) ? { ...u, role: newRole } : u)));
    } catch (err) {
      console.error("changeRole err", err);
      alert("Could not change role");
    }
  };

  const changeStatus = async (id, newStatus) => {
    try {
      await axiosSecure.patch(`/users/${id}/status`, { status: newStatus });
      setUsers(p => p.map(u => (String(u._id) === String(id) ? { ...u, status: newStatus } : u)));
    } catch (err) {
      console.error("changeStatus err", err);
      alert("Could not change status");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">All Users</h1>

      <div className="mb-4 flex gap-3">
        <select className="select select-bordered" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>

      {loading ? <div>Loading users...</div> : (
        <div className="bg-white rounded shadow overflow-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="text-left">
                <th className="p-2">Avatar</th>
                <th className="p-2">Email</th>
                <th className="p-2">Name</th>
                <th className="p-2">Role</th>
                <th className="p-2">Status</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id} className="border-t">
                  <td className="p-2">
                    <img src={u.avatar || `https://via.placeholder.com/40?text=${(u.name||'U').charAt(0)}`} alt="av" className="w-8 h-8 rounded-full" />
                  </td>
                  <td className="p-2">{u.email}</td>
                  <td className="p-2">{u.name}</td>
                  <td className="p-2 capitalize">{u.role}</td>
                  <td className="p-2 capitalize">{u.status}</td>
                  <td className="p-2 flex gap-2">
                    {u.status === "active" ? (
                      <button className="btn btn-sm btn-outline" onClick={() => changeStatus(u._id, "blocked")}>Block</button>
                    ) : (
                      <button className="btn btn-sm" onClick={() => changeStatus(u._id, "active")}>Unblock</button>
                    )}

                    {u.role !== "volunteer" && (
                      <button className="btn btn-sm" onClick={() => changeRole(u._id, "volunteer")}>Make Volunteer</button>
                    )}
                    {u.role !== "admin" && (
                      <button className="btn btn-sm" onClick={() => changeRole(u._id, "admin")}>Make Admin</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
