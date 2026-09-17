// src/components/UserLogin/UserLoginpage.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const AUTH_KEY = "xqibzknznwb29de15s44";

// ✅ LoginApiData interface REMOVED (was unused)

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
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // 1️⃣ LOGIN with authkey header
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
        setError(
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

      // 3️⃣ PROFILE fetch — account_id, brand_id, operator_id
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
        // Fallback to login data
        const rawAccountId = loginData.data.account_id;
        const accountId = Array.isArray(rawAccountId)
          ? String(rawAccountId[0] ?? subscriberId)
          : String(rawAccountId ?? subscriberId);
        localStorage.setItem("accountId", accountId);
        console.warn("[Login] Profile fetch failed, using login data.");
      }

      setSuccess("Login successful!");
      setTimeout(() => router.push("/dashboard"), 400);
    } catch (err) {
      console.error("Login Error:", err);
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-xl p-8 bg-black rounded-lg shadow-lg">
        <div className="text-center mb-6">
          <Image
            src="/tv (2).png"
            alt="ULKA TV Logo"
            width={300}
            height={150}
            priority
            className="mx-auto bg-black"
          />
        </div>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            autoComplete="username"
            className="w-full p-3 mb-3 bg-white text-black rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
            required
          />
          <input
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            className="w-full p-3 mb-3 bg-white text-black rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />
          {error && (
            <div className="mb-3 rounded-md bg-red-950 border border-red-700 p-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
          {success && (
            <div className="mb-3 rounded-md bg-green-950 border border-green-700 p-3">
              <p className="text-green-400 text-sm">{success}</p>
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white font-bold py-3 rounded-md transition ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="flex justify-between text-sm mt-4 text-gray-400">
          <a href="#" className="hover:text-white transition">
            Signup/Register
          </a>
          <a href="/forgotpassword" className="hover:text-white transition">
            Forgot password?
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
