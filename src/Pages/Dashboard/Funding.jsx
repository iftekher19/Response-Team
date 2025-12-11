// src/pages/Dashboard/Funding.jsx
import React, { useEffect, useState } from "react";
import useAxios from "../../hooks/useAxios";
import useAuth from "../../hooks/useAuth";

export default function Funding() {
  const axiosSecure = useAxios(); // assumes this axios instance uses baseURL or full backend URL
  const { user } = useAuth();

  const [funds, setFunds] = useState([]);
  const [summary, setSummary] = useState({ total: 0, count: 0 });
  const [amount, setAmount] = useState(""); // major units e.g. 500.00
  const [loading, setLoading] = useState(false);

  // load existing funds and summary
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const [resFunds, resSummary] = await Promise.all([
          axiosSecure.get("/funds").catch(() => ({ data: [] })),
          axiosSecure.get("/funds/summary").catch(() => ({ data: { total: 0, count: 0 } })),
        ]);
        if (!mounted) return;
        setFunds(resFunds?.data?.data || resFunds?.data || []);
        setSummary(resSummary?.data?.data || resSummary?.data || { total: 0, count: 0 });
      } catch (err) {
        console.error("Failed to load funds:", err);
      }
    };
    load();
    return () => { mounted = false; };
  }, [axiosSecure]);

  const startCheckout = async (ev) => {
    ev.preventDefault();
    if (!amount || Number(amount) <= 0) {
      alert("Enter a valid amount");
      return;
    }
    if (!user?.email) {
      alert("Please login to give fund");
      return;
    }

    setLoading(true);
    try {
      const payload = { amount: Number(amount), userEmail: user.email, name: user.name || "Donation" };
      const res = await axiosSecure.post("/create-checkout-session", payload);

      // server returns { ok: true, url, id }
      if (res?.data?.url) {
        // Redirect browser to Stripe Checkout (server-hosted checkout page)
        window.location.href = res.data.url;
      } else {
        throw new Error("No session url returned");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Could not start checkout. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Funding</h1>
        <div className="text-right">
          <div className="text-sm text-gray-500">Total funds</div>
          <div className="text-xl font-bold">৳ {summary.total ?? 0}</div>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow mb-6">
        <form onSubmit={startCheckout} className="grid md:grid-cols-3 gap-3 items-end">
          <div className="md:col-span-2">
            <label className="block text-sm mb-1">Amount (BDT)</label>
            <input
              type="number"
              step="0.01"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input input-bordered w-full"
              placeholder="e.g. 500.00"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              You will be redirected to Stripe to complete the payment. Amount is in BDT (display only). Stripe currency is controlled on the server.
            </p>
          </div>

          <div>
            <button type="submit" className="btn bg-red-600 text-white w-full" disabled={loading}>
              {loading ? "Processing..." : "Give Fund"}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-3">Recent donations</h2>

        {funds.length ? (
          <div className="space-y-2">
            {funds.map((f) => (
              <div key={f._id || f.transactionId} className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{f.donorName || f.userEmail}</div>
                  <div className="text-xs text-gray-500">{f.createdAt ? new Date(f.createdAt).toLocaleString() : ""}</div>
                </div>
                <div className="font-semibold">৳ {typeof f.amount === "number" ? f.amount.toFixed(2) : f.amount}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No donations yet.</p>
        )}
      </div>
    </div>
  );
}
