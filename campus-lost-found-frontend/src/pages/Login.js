import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import { toast } from "react-toastify";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await API.post("/auth/login", { email, password });
      const user = res.data.user;
      const token = res.data.token;

      if (user.role === "student" && !user.isVerified) {
        toast.error("Your account is not verified yet. Please wait for admin approval.");
        return;
      }

      localStorage.setItem("user", JSON.stringify({ ...user, token }));
      toast.success(`Welcome, ${user.name}!`);
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      toast.error(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#e0f2fe_0%,#f8fafc_48%,#dbeafe_100%)] px-4 py-12">
      <div className="mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-2">
        <div className="hidden lg:block">
          <div className="rounded-[2rem] bg-slate-900 p-10 text-white shadow-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-200">Campus Connect</p>
            <h1 className="mt-4 text-4xl font-bold leading-tight">Pick up where your campus left off.</h1>
            <p className="mt-4 text-slate-300">
              Sign in to report items, review claims, and keep your lost-and-found board organized.
            </p>
          </div>
        </div>

        <div className="mx-auto w-full max-w-md rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-xl backdrop-blur">
          <h2 className="text-center text-3xl font-bold text-slate-900">Sign in</h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            Or{" "}
            <Link to="/signup" className="font-medium text-sky-700 hover:text-sky-600">
              create a new account
            </Link>
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 block w-full rounded-2xl border border-slate-200 px-4 py-3 shadow-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="mt-1 block w-full rounded-2xl border border-slate-200 px-4 py-3 shadow-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full justify-center rounded-full bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:bg-slate-400"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
