// src/components/UserHeader.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { LayoutDashboard, LogIn, LogOut } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { FaBars, FaTimes } from "react-icons/fa";

export default function UserHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const name = localStorage.getItem("username") || "User";
    setIsLoggedIn(!!token);
    setUsername(name);
  }, [pathname]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("auth_token");
    localStorage.removeItem("subscriberId");
    localStorage.removeItem("accountId");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    router.push("/userlogin");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 py-3">
        {/* Logo */}
        <div className="flex items-center justify-center text-black font-bold">
          <Link href="/">
            <Image
              src="/tv (2).png"
              alt="logo"
              width={160}
              height={160}
              className="rounded transition-all duration-500 ease-in-out px-2"
            />
          </Link>
        </div>

        {/* Mobile menu button */}
        <div
          className="md:hidden px-4 text-white"
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? (
            <FaTimes className="text-2xl cursor-pointer" />
          ) : (
            <FaBars className="text-2xl cursor-pointer" />
          )}
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <span className="hidden sm:block text-sm text-gray-400">
                <span className="text-white font-semibold">{username}</span>
              </span>
              <button
                onClick={() => router.push("/dashboard")}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-semibold text-sm transition ${
                  pathname === "/dashboard"
                    ? "bg-yellow-500 text-black"
                    : "bg-gray-800 text-white hover:bg-gray-700"
                }`}
              >
                <LayoutDashboard size={16} />
                Dashboard
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-md font-semibold text-sm bg-red-600 hover:bg-red-700 text-white transition"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => router.push("/userlogin")}
              className="flex items-center gap-2 px-4 py-2 rounded-md font-semibold text-sm bg-yellow-500 hover:bg-yellow-600 text-black transition"
            >
              <LogIn size={16} />
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
