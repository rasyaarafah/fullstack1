"use client";

import React, { useState } from "react";
import { AuthLayout } from "@/components/templates/AuthLayout";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid email or password");
        setLoading(false);
        return;
      }

      // Save logged-in user info to localStorage for global client access
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      // Use window.location.href instead of router.push for mobile cookie synchronization
      const targetPath = data.user.role === "ADMIN" ? "/admin" : "/";
      window.location.href = targetPath;

    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Sign in">
      {/* Brand Header */}
      <h1 className="text-5xl sm:text-6xl font-serif text-black font-normal tracking-tight text-center mb-2">
        Let2Kop
      </h1>
      <h2 className="text-2xl sm:text-3xl font-serif text-black font-normal mb-10 text-center">
        Sign in
      </h2>

      {/* Auth Form */}
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
        {/* Error Notification Banner */}
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-100 rounded-lg text-center font-sans">
            {error}
          </div>
        )}

        {/* Email Field */}
        <div className="flex flex-col gap-2">
          <label className="text-base font-bold text-black font-sans">
            Email Address
          </label>
          <input
            type="email"
            required
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-5 py-2.5 rounded-full border border-stone-400 bg-white text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all font-sans shadow-xs"
          />
        </div>

        {/* Password Field */}
        <div className="flex flex-col gap-2">
          <label className="text-base font-bold text-black font-sans">
            Password
          </label>
          <input
            type="password"
            required
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-5 py-2.5 rounded-full border border-stone-400 bg-white text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all font-sans shadow-xs"
          />
          <div className="text-right mt-1">
            <button
              type="button"
              onClick={() => alert("Password reset link sent!")}
              className="text-sm text-[#7D5C7B] hover:text-black transition-colors font-sans"
            >
              Forgot password?
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 py-3 rounded-full bg-black text-white font-serif text-lg font-normal hover:bg-stone-900 transition-all shadow-md active:scale-[0.99] cursor-pointer disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </AuthLayout>
  );
}