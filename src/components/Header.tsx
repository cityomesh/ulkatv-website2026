// Header.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FaBars,
  FaTimes,
  FaChevronDown,
} from "react-icons/fa";

const Header = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [technologyDropdownOpen, setTechnologyDropdownOpen] =
    useState(false);
  const [signinDropdownOpen, setSigninDropdownOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
    setAboutDropdownOpen(false);
    setTechnologyDropdownOpen(false);
    setSigninDropdownOpen(false);
  };

  const toggleAboutDropdown = () => {
    setAboutDropdownOpen((prev) => !prev);
    setTechnologyDropdownOpen(false);
    setSigninDropdownOpen(false);
  };

  const toggleTechnologyDropdown = () => {
    setTechnologyDropdownOpen((prev) => !prev);
    setAboutDropdownOpen(false);
    setSigninDropdownOpen(false);
  };

  const toggleSigninDropdown = () => {
    setSigninDropdownOpen((prev) => !prev);
    setAboutDropdownOpen(false);
    setTechnologyDropdownOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (!target.closest(".dropdown-container")) {
        setAboutDropdownOpen(false);
        setTechnologyDropdownOpen(false);
        setSigninDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="bg-black">
      <header
        className={`fixed top-0 left-0 w-full z-50 shadow-md transition-all duration-500 ease-in-out ${
          isScrolled
            ? "bg-black py-2"
            : "bg-black py-3 md:py-5"
        }`}
      >
        <div className="container mx-auto flex items-center justify-between">
          {/* ================= LOGO ================= */}
          <div
            className={`flex items-center justify-center text-black font-bold transition-all duration-500 ${
              isScrolled ? "p-1 rounded-md" : ""
            }`}
          >
            <Link href="/">
              <Image
                src="/tv (2).png"
                alt="logo"
                width={isScrolled ? 140 : 220}
                height={isScrolled ? 140 : 220}
                className="rounded transition-all duration-500 ease-in-out px-2"
              />
            </Link>
          </div>

          {/* ================= MOBILE MENU BUTTON ================= */}
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

          {/* ================= NAVIGATION ================= */}
          <ul
            className={`absolute text-[14px] md:static top-[60px] left-0 w-full bg-black md:w-auto md:flex md:items-center md:space-x-5 text-blue-900 font-semibold transition-all duration-300 ease-in-out ${
              isMobileMenuOpen ? "block" : "hidden"
            }`}
          >
            {/* HOME */}
            <li className="cursor-pointer py-1.5 px-4 md:py-0 md:px-0 text-left md:text-center">
              <Link
                href="/"
                className="inline-block bg-transparent text-white hover:bg-white hover:text-black px-4 py-1.5 rounded-md font-bold transition-all duration-300 text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                HOME
              </Link>
            </li>

            {/* BOUQUETS */}
            <li className="cursor-pointer py-1.5 px-4 md:py-0 md:px-0 text-left md:text-center">
              <Link
                href="/pagebouquets"
                className="inline-block bg-transparent text-white hover:bg-white hover:text-black px-2 py-1.5 rounded-md font-bold transition-all duration-300 text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                BOUQUETS
              </Link>
            </li>

            {/* ================================================= */}
            {/* TECHNOLOGY DROPDOWN */}
            {/* ================================================= */}
            <li className="relative dropdown-container cursor-pointer py-1.5 px-4 md:py-0 md:px-0 text-left md:text-center">
              <button
                onClick={toggleTechnologyDropdown}
                className="inline-flex items-center bg-transparent text-white hover:bg-white hover:text-black px-2 py-1.5 rounded-md font-bold transition-all duration-300 text-sm"
              >
                TECHNOLOGY
                <FaChevronDown
                  className={`ml-1 text-[10px] transition-transform duration-300 ${
                    technologyDropdownOpen
                      ? "rotate-180"
                      : ""
                  }`}
                />
              </button>

              {technologyDropdownOpen && (
                <ul className="absolute left-0 md:left-1/2 md:-translate-x-1/2 mt-1 w-48 bg-black border border-gray-700 rounded-md shadow-lg z-20 overflow-hidden">

                  {/* TECHNOLOGY */}
                  <li>
                    <Link
                      href="/technology"
                      className="block px-4 py-2.5 text-white hover:bg-white hover:text-black transition-all duration-300 text-sm font-semibold"
                      onClick={() => {
                        setTechnologyDropdownOpen(false);
                        setMobileMenuOpen(false);
                      }}
                    >
                      TECHNOLOGY
                    </Link>
                  </li>

                  {/* SMART TV */}
                  <li>
                    <Link
                      href="/smarttv"
                      className="block px-4 py-2.5 text-white hover:bg-white hover:text-black transition-all duration-300 text-sm font-semibold"
                      onClick={() => {
                        setTechnologyDropdownOpen(false);
                        setMobileMenuOpen(false);
                      }}
                    >
                      SMART TV
                    </Link>
                  </li>

                  {/* SMART MOBILE */}
                  <li>
                    <Link
                      href="/smartmobile"
                      className="block px-4 py-2.5 text-white hover:bg-white hover:text-black transition-all duration-300 text-sm font-semibold"
                      onClick={() => {
                        setTechnologyDropdownOpen(false);
                        setMobileMenuOpen(false);
                      }}
                    >
                      SMART MOBILE
                    </Link>
                  </li>

                  {/* SET TOP BOX */}
                  <li>
                    <Link
                      href="/stb"
                      className="block px-4 py-2.5 text-white hover:bg-white hover:text-black transition-all duration-300 text-sm font-semibold"
                      onClick={() => {
                        setTechnologyDropdownOpen(false);
                        setMobileMenuOpen(false);
                      }}
                    >
                      SET TOP BOX
                    </Link>
                  </li>

                  {/* ULKA STICK */}
                  <li>
                    <Link
                      href="/stick"
                      className="block px-4 py-2.5 text-white hover:bg-white hover:text-black transition-all duration-300 text-sm font-semibold"
                      onClick={() => {
                        setTechnologyDropdownOpen(false);
                        setMobileMenuOpen(false);
                      }}
                    >
                      ULKA STICK
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* ================================================= */}
            {/* ABOUT US DROPDOWN */}
            {/* ================================================= */}
            <li className="relative dropdown-container cursor-pointer py-1.5 px-4 md:py-0 md:px-0 text-left md:text-center">
              <button
                onClick={toggleAboutDropdown}
                className="inline-flex items-center bg-transparent text-white hover:bg-white hover:text-black px-2 py-1.5 rounded-md font-bold transition-all duration-300 text-sm"
              >
                ABOUT US
                <FaChevronDown className="ml-1 text-[10px]" />
              </button>

              {aboutDropdownOpen && (
                <ul className="absolute left-0 md:left-1/2 md:-translate-x-1/2 mt-1 w-44 bg-black border border-gray-700 rounded-md shadow-lg z-20 overflow-hidden">

                  {/* ABOUT */}
                  <li>
                    <Link
                      href="/about"
                      className="block px-4 py-2 text-white hover:bg-white hover:text-black transition-all duration-300 text-sm"
                      onClick={() => {
                        setAboutDropdownOpen(false);
                        setMobileMenuOpen(false);
                      }}
                    >
                      ABOUT
                    </Link>
                  </li>

                  {/* PRIVACY POLICY */}
                  <li>
                    <Link
                      href="/policy"
                      className="block px-4 py-2 text-white hover:bg-white hover:text-black transition-all duration-300 text-sm"
                      onClick={() => {
                        setAboutDropdownOpen(false);
                        setMobileMenuOpen(false);
                      }}
                    >
                      PRIVACY POLICY
                    </Link>
                  </li>

                  {/* TERMS */}
                  <li>
                    <Link
                      href="/terms"
                      className="block px-4 py-2 text-white hover:bg-white hover:text-black transition-all duration-300 text-sm"
                      onClick={() => {
                        setAboutDropdownOpen(false);
                        setMobileMenuOpen(false);
                      }}
                    >
                      TERMS
                    </Link>
                  </li>

                  {/* FAQ */}
                  <li>
                    <a
                      href="/faq"
                      className="block px-4 py-2 text-white hover:bg-white hover:text-black transition-all duration-300 text-sm"
                      onClick={() => {
                        setAboutDropdownOpen(false);
                        setMobileMenuOpen(false);
                      }}
                    >
                      FAQ
                    </a>
                  </li>
                </ul>
              )}
            </li>

            {/* PARTNERS */}
            <li className="cursor-pointer py-1.5 px-4 md:py-0 md:px-0 text-left md:text-center">
              <Link
                href="/partners"
                className="inline-block bg-transparent text-white hover:bg-white hover:text-black px-2 py-1.5 rounded-md font-bold transition-all duration-300 text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                PARTNERS
              </Link>
            </li>

            {/* CONTACT US */}
            <li className="cursor-pointer py-2 px-4 md:py-0 md:px-0 text-left md:text-center">
              <Link
                href="/contact"
                className="inline-block bg-transparent text-white hover:bg-white hover:text-black px-2 py-2 rounded-md font-bold transition-all duration-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                CONTACT US
              </Link>
            </li>

            {/* ================================================= */}
            {/* SIGN IN DROPDOWN */}
            {/* ================================================= */}
            <li className="relative dropdown-container cursor-pointer py-1.5 px-4 md:py-0 md:px-0 text-left md:text-center">
              <button
                onClick={toggleSigninDropdown}
                className="inline-flex items-center bg-red-600 text-white px-4 py-1.5 rounded-md font-bold transition-all duration-300 hover:bg-red-700 text-sm"
              >
                SIGN IN
                <FaChevronDown className="ml-1 text-[10px]" />
              </button>

              {signinDropdownOpen && (
                <ul className="absolute left-0 md:left-1/2 md:-translate-x-1/2 mt-1 w-44 bg-black border border-gray-700 rounded-md shadow-lg z-20 overflow-hidden">

                  {/* USER LOGIN */}
                  <li>
                    <Link
                      href="/login"
                      className="block px-4 py-2 text-white hover:bg-white hover:text-black transition-all duration-300 text-sm"
                      onClick={() => {
                        setSigninDropdownOpen(false);
                        setMobileMenuOpen(false);
                      }}
                    >
                      USER LOGIN
                    </Link>
                  </li>

                  {/* PARTNER LOGIN */}
                  <li>
                    <a
                      href="https://partners.ulka.tv/"
                      className="block px-4 py-2 text-white hover:bg-white hover:text-black transition-all duration-300 text-sm"
                      onClick={() => {
                        setSigninDropdownOpen(false);
                        setMobileMenuOpen(false);
                      }}
                    >
                      PARTNER LOGIN
                    </a>
                  </li>
                </ul>
              )}
            </li>
          </ul>
        </div>
      </header>
    </div>
  );
};

export default Header;
