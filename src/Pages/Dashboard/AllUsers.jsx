import React, { useEffect, useState } from "react";
import useAxios from "../../hooks/useAxios";

export default function AllUsers() {
  const axiosSecure = useAxios();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const res = await axiosSecure.get("/users"); // MODIFY: endpoint
        if (mounted && res?.data) setUsers(res.data);
      } catch (err) {
        console.error("All users error", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [axiosSecure]);

  const toggleBlock = async (u) => {
    try {
      await axiosSecure.patch(`/users/${u._id || u.email}/status`, { status: u.status === "active" ? "blocked" : "active" });
      setUsers((prev) => prev.map(p => (p._id === u._id ? { ...p, status: p.status === "active" ? "blocked" : "active" } : p)));
    } catch (err) {
      console.error("Toggle block error", err);
      alert("Action failed");
    }
  };

  const changeRole = async (u, role) => {
    try {
      await axiosSecure.patch(`/users/${u._id || u.email}/role`, { role });
      setUsers((prev) => prev.map(p => (p._id === u._id ? { ...p, role } : p)));
    } catch (err) {
      console.error("Change role error", err);
      alert("Action failed");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">All Users</h1>
      {loading ? <div>Loading...</div> : (
        <div className="overflow-auto bg-white rounded shadow p-2">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="p-2 text-left">Avatar</th>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Role</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id || u.email} className="border-t">
                  <td className="p-2"><img src={u.avatar || "https://via.placeholder.com/40"} alt="" className="w-10 h-10 rounded-full" /></td>
                  <td className="p-2">{u.name}</td>
                  <td className="p-2">{u.email}</td>
                  <td className="p-2 capitalize">{u.role}</td>
                  <td className="p-2">{u.status}</td>
                  <td className="p-2 space-x-2">
                    <button onClick={() => toggleBlock(u)} className="btn btn-sm">{u.status === "active" ? "Block" : "Unblock"}</button>
                    <button onClick={() => changeRole(u, "volunteer")} className="btn btn-sm">Make Volunteer</button>
                    <button onClick={() => changeRole(u, "admin")} className="btn btn-sm">Make Admin</button>
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
