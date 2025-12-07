// src/pages/Auth/Login/Login.jsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router";
import useAuth from "../../../hooks/useAuth";

export default function Login() {
  const auth = useAuth();
  // tolerant lookup for the login function (some implementations name it `login`)
  const loginFn = auth?.login || auth?.signIn || auth?.loginUser;
  const navigate = useNavigate();
  const location = useLocation();
  const from = location?.state?.from?.pathname || "/dashboard";

  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const onSubmit = async (data) => {
    setServerError("");
    if (!loginFn) {
      setServerError("Authentication not configured. Check your AuthProvider.");
      return;
    }

    setLoading(true);
    try {
      const res = await loginFn(data.email, data.password); // expect { ok: true } or similar
      setLoading(false);

      // handle outcome flexibly
      if (res?.ok || res === true) {
        navigate(from, { replace: true });
      } else if (res?.error) {
        setServerError(res.error.message || "Login failed");
      } else {
        setServerError("Login failed. Please check your credentials.");
      }
    } catch (err) {
      setLoading(false);
      console.error("Login error:", err);
      setServerError(err?.message || "Unexpected error during login.");
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium">Email</label>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            className="input input-bordered w-full"
            placeholder="you@example.com"
          />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Password</label>
          <input
            type="password"
            {...register("password", { required: "Password is required" })}
            className="input input-bordered w-full"
            placeholder="••••••••"
          />
          {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
        </div>

        {serverError && <p className="text-sm text-red-600">{serverError}</p>}

        <button
          type="submit"
          className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <div className="mt-3 text-sm text-center text-gray-600">
          <p>
            Don't have an account?{" "}
            <a href="/register" className="text-red-600 font-semibold">Register</a>
          </p>
        </div>
      </form>
    </div>
  );
}
