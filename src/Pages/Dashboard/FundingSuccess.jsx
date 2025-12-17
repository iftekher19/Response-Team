import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import useAxios from "../../hooks/useAxios";

export default function FundingSuccess() {
  const axiosSecure = useAxios();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState(null);
  const [currency, setCurrency] = useState("usd");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let mounted = true;

    if (!sessionId) {
      setMessage("Invalid payment session.");
      setLoading(false);
      return;
    }

    const loadDonationInfo = async () => {
      try {
        const res = await axiosSecure.get(
          `/checkout-session?session_id=${encodeURIComponent(sessionId)}`
        );

        if (!mounted) return;

        if (res.data?.ok && res.data?.donation) {
          setAmount(res.data.donation.amount);
          setCurrency(res.data.donation.currency);
          setMessage("Thank you for your contribution!");
        } else {
          setMessage("Payment completed successfully.");
        }
      } catch (err) {
        console.error("FundingSuccess error:", err);
        setMessage("Payment completed. Thank you for your support!");
      } finally {
        if (mounted) {
          setLoading(false);
          setTimeout(() => {
            navigate("/dashboard/funding", { replace: true });
          }, 4000);
        }
      }
    };

    loadDonationInfo();
    return () => { mounted = false; };
  }, [sessionId, axiosSecure, navigate]);

  return (
    <div className="max-w-xl mx-auto p-6 text-center">
      {loading ? (
        <p className="text-gray-600">Finalizing your donation…</p>
      ) : (
        <div className="bg-white shadow rounded p-6">
          <h1 className="text-2xl font-bold text-green-600 mb-3">
            🎉 Payment Successful
          </h1>

          <p className="text-lg mb-2">{message}</p>

          {amount !== null && (
            <p className="text-xl font-semibold mb-4">
              Donated Amount:{" "}
              <span className="text-red-600">
                ৳ {amount.toFixed(2)}
              </span>
            </p>
          )}

          <p className="text-sm text-gray-500 mb-4">
            We truly appreciate your support. You will be redirected shortly.
          </p>

          <button
            className="btn bg-red-600 text-white"
            onClick={() => navigate("/dashboard/funding")}
          >
            Go to Dashboard
          </button>
        </div>
      )}
    </div>
  );
}
