// src/components/UserLogin/UserLoginpage.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Shield,
  Zap,
  Loader2,
} from "lucide-react";

const AUTH_KEY = "xqibkznznwb29de15s44";

interface ProfileAccount {
  id: string | number;
  brand_id?: string | number;
  bouque?: unknown[];
}

interface ProfileApiResponse {
  success?: boolean;
  status?: number;
  data?: {
    profile?: {
      sublocation_details?: { operator_id?: string | number };
    };
    accounts?: ProfileAccount[];
  };
}

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      // 1️⃣ LOGIN
      const loginRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });

      const loginData = await loginRes.json();
      console.log("[Login] Login response:", loginData);

      if (
        !loginRes.ok ||
        !loginData.success ||
        !loginData.data?.access_token
      ) {
        console.error(
          "[Login] Failed:",
          (typeof loginData.message === "string" && loginData.message) ||
            loginData.error ||
            "Invalid username or password."
        );
        setLoading(false);
        return;
      }

      const token: string = loginData.data.access_token;
      const subscriberId = String(loginData.data.subscriber_id ?? "0");

      // 2️⃣ Store tokens
      localStorage.setItem("access_token", token);
      if (loginData.data.auth_token) {
        localStorage.setItem("auth_token", loginData.data.auth_token);
      }
      localStorage.setItem("subscriberId", subscriberId);
      localStorage.setItem(
        "username",
        loginData.data.username || username.trim()
      );
      localStorage.setItem("name", loginData.data.name || "");

      // 3️⃣ PROFILE fetch
      const profileRes = await fetch(
        `/api/profile?subscriber_id=${subscriberId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            authkey: AUTH_KEY,
          },
        }
      );

      const profileData: ProfileApiResponse = await profileRes.json();
      console.log("[Login] Profile response:", profileData);

      if (
        profileData.success &&
        (profileRes.status === 200 || profileRes.status === 201) &&
        profileData.data?.accounts?.[0]
      ) {
        const account = profileData.data.accounts[0];
        const operatorId =
          profileData.data.profile?.sublocation_details?.operator_id ?? "";

        localStorage.setItem("accountId", String(account.id));
        localStorage.setItem("brandId", String(account.brand_id ?? ""));
        localStorage.setItem("operatorId", String(operatorId));

        if (account.bouque) {
          localStorage.setItem("packs", JSON.stringify(account.bouque));
        }

        console.log(
          `[Login] Profile stored: accountId=${account.id}, brandId=${account.brand_id}, operatorId=${operatorId}`
        );
      } else {
        const rawAccountId = loginData.data.account_id;
        const accountId = Array.isArray(rawAccountId)
          ? String(rawAccountId[0] ?? subscriberId)
          : String(rawAccountId ?? subscriberId);
        localStorage.setItem("accountId", accountId);
        console.warn("[Login] Profile fetch failed, using login data.");
      }

      // ✅ Success flag — will be shown on dashboard
      localStorage.setItem("show_login_success", "1");
      localStorage.setItem(
        "login_success_name",
        loginData.data.name || loginData.data.username || username.trim()
      );

      setTimeout(() => router.push("/dashboard"), 400);
    } catch (err) {
      console.error("Login Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* ═══════════ LEFT: Hero Panel (CENTER ALIGNED) ═══════════ */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-red-600 via-red-500 to-orange-500 overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-white rounded-full" />
          <div className="absolute top-1/3 -right-32 w-80 h-80 bg-white rounded-full" />
          <div className="absolute -bottom-40 left-1/4 w-96 h-96 bg-white rounded-full" />
        </div>

        {/* ✅ CENTERED CONTENT — everything in middle, text-center */}
        <div className="relative flex flex-col items-center justify-center w-full p-12 text-center">
          {/* Logo at top */}
          <div className="mb-10">
            <Image
              src="/tv (2).png"
              alt="ULKA TV Logo"
              width={260}
              height={130}
              priority
              className="mx-auto object-contain"
            />
          </div>

          {/* Heading — center aligned */}
          <h1 className="text-5xl xl:text-6xl font-black leading-tight text-white mb-5">
            Welcome
            <br />
            Back.
          </h1>

          {/* Subtitle — center aligned */}
          <p className="text-lg text-white/90 font-medium max-w-md leading-relaxed mb-12">
            Manage your cable TV subscription, recharge instantly, and never
            miss your favourite channels.
          </p>

          {/* Feature list — centered column */}
          <div className="space-y-4 w-full max-w-sm">
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/15">
              <div className="w-11 h-11 rounded-xl bg-white/25 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-bold text-sm text-white">
                  Instant Recharge
                </p>
                <p className="text-xs text-white/80">
                  Top up your account in seconds
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/15">
              <div className="w-11 h-11 rounded-xl bg-white/25 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-bold text-sm text-white">
                  Secure Payments
                </p>
                <p className="text-xs text-white/80">
                  Your transactions are always protected
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/15">
              <div className="w-11 h-11 rounded-xl bg-white/25 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-bold text-sm text-white">
                  Manage Everything
                </p>
                <p className="text-xs text-white/80">
                  Packs, channels & account in one place
                </p>
              </div>
            </div>
          </div>

          {/* Copyright — centered */}
          <p className="text-xs text-white/70 font-medium mt-12">
            © {new Date().getFullYear()} ULKA TV — All rights reserved
          </p>
        </div>
      </div>

      {/* ═══════════ RIGHT: Login Form ═══════════ */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex flex-col items-center mb-8">
            <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-lg shadow-red-200 mb-3">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <p className="text-sm font-bold text-gray-900 uppercase tracking-widest">
              ULKA TV
            </p>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-2">
              Sign <span className="text-red-600">In</span>
            </h2>
            <p className="text-sm text-gray-500">
              Enter your credentials to access your account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2">
                Username
              </label>
              <div className="relative group">
                <User
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-600 transition-colors pointer-events-none"
                />
                <input
                  type="text"
                  placeholder="Enter your username"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-gray-900 text-sm font-medium placeholder-gray-400 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all disabled:bg-gray-50"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2">
                Password
              </label>
              <div className="relative group">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-600 transition-colors pointer-events-none"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                  className="w-full pl-12 pr-12 py-3.5 bg-white border border-gray-200 rounded-2xl text-gray-900 text-sm font-medium placeholder-gray-400 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all disabled:bg-gray-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className={`group w-full py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                loading
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white shadow-lg shadow-red-200 hover:shadow-red-300 hover:scale-[1.01]"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-[11px] text-gray-400 mt-10 leading-relaxed">
            By signing in, you agree to our{" "}
            <a href="#" className="text-red-600 hover:underline font-bold">
              Terms
            </a>{" "}
            &amp;{" "}
            <a href="#" className="text-red-600 hover:underline font-bold">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
