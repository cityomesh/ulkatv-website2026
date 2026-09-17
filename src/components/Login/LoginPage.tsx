"use client";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import Image from "next/image";

// ======================================================
// TYPES
// ======================================================

interface LoginApiData {
  access_token?: string;
  auth_token?: string;
  token?: string;
}

interface LoginApiResponse {
  success?: boolean;
  message?: string;
  error?: string;

  data?: LoginApiData;
}

// ======================================================
// COMPONENT
// ======================================================

const Login = () => {
  const [
    username,
    setUsername,
  ] = useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    error,
    setError,
  ] = useState("");

  const [
    success,
    setSuccess,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  const router =
    useRouter();

  // ====================================================
  // LOGIN
  // ====================================================

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (loading) {
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // ==================================================
      // ULKA LOGIN
      // ==================================================

      const response =
        await fetch(
          "https://partners.ulka.tv/api/railtel.php/v1/user/login?vr=railtel1.1",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Accept:
                "application/json",
            },

            body:
              JSON.stringify({
                LoginForm: {
                  username:
                    username.trim(),

                  password,
                },
              }),
          }
        );

      // ==================================================
      // READ RESPONSE
      // ==================================================

      const text =
        await response.text();

      let data:
        LoginApiResponse;

      try {
        data =
          JSON.parse(
            text
          ) as LoginApiResponse;
      } catch {
        throw new Error(
          "ULKA server returned an invalid response."
        );
      }

      console.log(
        "ULKA LOGIN RESPONSE:",
        data
      );

      // ==================================================
      // GET TOKEN
      // ==================================================

      const accessToken =
        data.data?.access_token;

      const authToken =
        data.data?.auth_token;

      const fallbackToken =
        data.data?.token;

      const token =
        accessToken ||
        authToken ||
        fallbackToken;

      // ==================================================
      // LOGIN SUCCESS
      // ==================================================

      if (
        response.ok &&
        data.success &&
        token
      ) {
        // ================================================
        // CLEAR OLD TOKENS
        // ================================================

        localStorage.removeItem(
          "access_token"
        );

        localStorage.removeItem(
          "auth_token"
        );

        localStorage.removeItem(
          "ulka_token"
        );

        // ================================================
        // SAVE ACCESS TOKEN
        // ================================================

        if (
          accessToken
        ) {
          localStorage.setItem(
            "access_token",
            accessToken
          );
        }

        // ================================================
        // SAVE AUTH TOKEN
        // ================================================

        if (
          authToken
        ) {
          localStorage.setItem(
            "auth_token",
            authToken
          );
        }

        // ================================================
        // SAVE FALLBACK TOKEN
        // ================================================

        if (
          fallbackToken
        ) {
          localStorage.setItem(
            "ulka_token",
            fallbackToken
          );
        }

        console.log(
          "ULKA LOGIN SUCCESSFUL"
        );

        console.log(
          "access_token:",
          Boolean(accessToken)
        );

        console.log(
          "auth_token:",
          Boolean(authToken)
        );

        setSuccess(
          "User login successful!"
        );

        // ================================================
        // GO TO BOUQUETS
        // ================================================

        router.push(
          "/pagebouquets"
        );

        return;
      }

      // ==================================================
      // LOGIN FAILED
      // ==================================================

      console.error(
        "ULKA LOGIN FAILED:",
        data
      );

      setError(
        data.message ||
          data.error ||
          "Invalid username or password. Please try again."
      );
    } catch (
      error: unknown
    ) {
      console.error(
        "ULKA LOGIN ERROR:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again later."
      );
    } finally {
      setLoading(
        false
      );
    }
  };

  // ======================================================
  // UI
  // ======================================================

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">

      <div className="w-full max-w-xl p-8 bg-black rounded-lg shadow-lg">

        {/* LOGO */}

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

        {/* LOGIN FORM */}

        <form
          onSubmit={
            handleLogin
          }
        >

          {/* USERNAME */}

          <input
            type="text"
            placeholder="Username"
            autoComplete="username"
            className="w-full p-3 mb-3 bg-white text-black rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
            value={
              username
            }
            onChange={(
              e
            ) =>
              setUsername(
                e.target.value
              )
            }
            disabled={
              loading
            }
            required
          />

          {/* PASSWORD */}

          <input
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            className="w-full p-3 mb-3 bg-white text-black rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
            value={
              password
            }
            onChange={(
              e
            ) =>
              setPassword(
                e.target.value
              )
            }
            disabled={
              loading
            }
            required
          />

          {/* ERROR */}

          {error && (
            <div className="mb-3 rounded-md bg-red-950 border border-red-700 p-3">

              <p className="text-red-400 text-sm">
                {error}
              </p>

            </div>
          )}

          {/* SUCCESS */}

          {success && (
            <div className="mb-3 rounded-md bg-green-950 border border-green-700 p-3">

              <p className="text-green-400 text-sm">
                {success}
              </p>

            </div>
          )}

          {/* BUTTON */}

          <button
            type="submit"
            disabled={
              loading
            }
            className={`w-full text-white font-bold py-3 rounded-md transition ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>

        {/* LINKS */}

        <div className="flex justify-between text-sm mt-4 text-gray-400">

          <a
            href="#"
            className="hover:text-white transition"
          >
            Signup/Register
          </a>

          <a
            href="/forgotpassword"
            className="hover:text-white transition"
          >
            Forgot password?
          </a>

        </div>

      </div>

    </div>
  );
};

export default Login;
