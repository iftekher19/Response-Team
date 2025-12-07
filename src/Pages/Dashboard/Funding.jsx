import React, { useEffect, useState } from "react";
import useAxios from "../../hooks/useAxios";

export default function Funding() {
  const axiosSecure = useAxios();
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const res = await axiosSecure.get("/funds"); // MODIFY: endpoint for listing funds
        if (mounted && res?.data) setFunds(res.data);
      } catch (err) {
        console.error("Funds load error", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [axiosSecure]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Funding</h1>
        <button className="btn bg-red-600 text-white">Give Fund</button> {/* implement stripe flow */}
      </div>

      {loading ? <div>Loading...</div> : (
        <div className="bg-white rounded shadow p-4 overflow-auto">
          <table className="min-w-full">
            <thead><tr><th className="p-2 text-left">User</th><th className="p-2 text-left">Amount</th><th className="p-2 text-left">Date</th></tr></thead>
            <tbody>
              {funds.map(f => (
                <tr key={f._id || f.id} className="border-t">
                  <td className="p-2">{f.user?.name || f.userEmail}</td>
                  <td className="p-2">৳ {f.amount}</td>
                  <td className="p-2">{new Date(f.createdAt || f.date).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
