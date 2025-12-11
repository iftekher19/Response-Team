// src/pages/Dashboard/FundingSuccess.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import useAxios from "../../hooks/useAxios";

export default function FundingSuccess() {
  const axiosSecure = useAxios();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    if (!sessionId) {
      setMessage("Missing session id in URL.");
      setLoading(false);
      return;
    }

    const reconcile = async () => {
      try {
        // idempotent reconcile: server will insert only if not already recorded
        const resp = await axiosSecure.get(`/checkout-session?session_id=${encodeURIComponent(sessionId)}`);
        const data = resp?.data || resp;

        if (!mounted) return;

        if (data.ok) {
          if (data.recorded) {
            setMessage("Thank you — your donation was recorded successfully.");
          } else {
            setMessage("Donation was already recorded. Thank you!");
          }
        } else {
          // server responded but reported problem
          setMessage("Payment processed but we could not record it automatically. We'll retry.");
        }
      } catch (err) {
        console.error("FundingSuccess error:", err);
        setMessage("There was a problem verifying your donation. We will reconcile this soon.");
      } finally {
        if (mounted) {
          setLoading(false);
          // navigate back to funding page after short delay so user sees message
          setTimeout(() => {
            navigate("/dashboard/funding", { replace: true });
          }, 3500);
        }
      }
    };

    reconcile();
    return () => { mounted = false; };
  }, [sessionId, axiosSecure, navigate]);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Donation status</h1>

      {loading ? (
        <div className="text-gray-600">Verifying payment & recording donation... Please wait.</div>
      ) : (
        <div>
          <div className="p-4 bg-green-50 border border-green-200 rounded mb-4">
            <div className="text-lg font-medium">{message}</div>
            <div className="text-sm text-gray-600 mt-2">You will be redirected to the Funding page shortly.</div>
          </div>

          <div>
            <button className="btn" onClick={() => navigate("/dashboard/funding")}>Go to Funding page now</button>
          </div>
        </div>
      )}
    </div>
  );
}
