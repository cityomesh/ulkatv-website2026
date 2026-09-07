"use client";

import React from "react";
import Image from "next/image";
import { ArrowUpRight, Play, Tv, Wifi } from "lucide-react";

const features = [
  {
    icon: Tv,
    title: "Smart TV",
    text: "Turn any compatible TV into a smarter entertainment experience.",
  },
  {
    icon: Play,
    title: "Live & OTT",
    text: "Watch live channels and enjoy your favorite streaming content.",
  },
  {
    icon: Wifi,
    title: "Connected",
    text: "Simple setup with a connected experience built for your home.",
  },
];

const devices = [
  {
    image: "/Strick1.png",
    tag: "ULKATV STICK",
    title: "UlkaTV Smart Stick",
    text: "Make your TV smarter.",
    dark: false,
  },
  {
    image: "/Strick2.png",
    tag: "SMART ENTERTAINMENT",
    title: "Connected Entertainment",
    text: "Entertainment without limits.",
    dark: true,
  },
];

const StickPage = () => {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f7f7f8] text-black">
      {/* =========================================================
          HERO
      ========================================================== */}
      <section className="relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute -right-32 -top-20 h-[280px] w-[280px] rounded-full bg-red-500/20 blur-[100px] sm:-right-20 sm:-top-28 sm:h-[400px] sm:w-[400px] sm:blur-[120px] lg:right-[-10%] lg:-top-32 lg:h-[500px] lg:w-[500px] lg:blur-[130px]" />

        <div className="absolute -bottom-20 -left-32 h-[250px] w-[250px] rounded-full bg-red-500/10 blur-[90px] sm:h-[350px] sm:w-[350px] lg:-left-[10%] lg:h-[350px] lg:w-[350px] lg:blur-[110px]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-5 py-12 sm:gap-10 sm:px-8 sm:py-16 lg:grid-cols-2 lg:gap-12 lg:px-10 lg:py-24">
          {/* =====================================================
              LEFT CONTENT
          ====================================================== */}
          <div className="relative z-20 max-w-xl">
            {/* Badge */}
            <div className="mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3.5 py-2 text-[10px] font-bold backdrop-blur sm:mb-6 sm:px-4 sm:text-xs">
              <span className="h-2 w-2 shrink-0 rounded-full bg-red-500" />

              <span className="truncate">
                ULKATV SMART ENTERTAINMENT
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-[3.25rem] font-black leading-[0.9] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
              Your TV.
              <br />
              <span className="text-red-500">Your World.</span>
            </h1>

            {/* Description */}
            <p className="mt-6 max-w-lg text-[15px] leading-6 text-gray-600 sm:mt-7 sm:text-lg sm:leading-7">
              Transform your regular television into a powerful entertainment
              hub with UlkaTV. Live TV, OTT and connected entertainment, all
              in one simple experience.
            </p>

            {/* Buttons */}
            <div className="mt-7 grid w-full grid-cols-3 gap-2.5 sm:mt-9 sm:flex sm:flex-wrap sm:gap-3">
              {/* Live TV */}
              <div className="group flex min-h-[48px] items-center justify-center gap-1.5 rounded-full bg-black px-3 py-3 text-xs font-bold text-white transition duration-300 hover:bg-red-600 sm:min-h-0 sm:justify-start sm:gap-3 sm:px-6 sm:py-3.5 sm:text-sm">
                <span>Live TV</span>

                <ArrowUpRight className="h-3.5 w-3.5 shrink-0 transition duration-300 group-hover:rotate-45 sm:h-4 sm:w-4" />
              </div>

              {/* OTT */}
              <div className="group flex min-h-[48px] items-center justify-center gap-1.5 rounded-full bg-black px-3 py-3 text-xs font-bold text-white transition duration-300 hover:bg-red-600 sm:min-h-0 sm:justify-start sm:gap-3 sm:px-6 sm:py-3.5 sm:text-sm">
                <Play className="h-3.5 w-3.5 shrink-0 fill-current sm:h-4 sm:w-4" />

                <span>OTT</span>
              </div>

              {/* Smart */}
              <div className="group flex min-h-[48px] items-center justify-center gap-1.5 rounded-full bg-black px-3 py-3 text-xs font-bold text-white transition duration-300 hover:bg-red-600 sm:min-h-0 sm:justify-start sm:gap-3 sm:px-6 sm:py-3.5 sm:text-sm">
                <Play className="h-3.5 w-3.5 shrink-0 fill-current sm:h-4 sm:w-4" />

                <span>Smart</span>
              </div>
            </div>
          </div>

          {/* =====================================================
              HERO IMAGE
          ====================================================== */}
          <div className="relative z-10 mt-3 flex min-w-0 justify-center sm:mt-5 lg:mt-0">
            {/* Glow */}
            <div className="absolute left-1/2 top-1/2 h-[250px] w-[250px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500/20 blur-[75px] sm:h-[400px] sm:w-[400px] sm:blur-[100px] lg:h-[500px] lg:w-[500px]" />

            <div className="relative w-full max-w-[360px] sm:max-w-[520px] lg:max-w-[650px]">
              {/* TV image */}
              <Image
                src="/Strick3.png"
                alt="UlkaTV Smart TV"
                width={1000}
                height={700}
                priority
                sizes="(max-width: 640px) 92vw, (max-width: 1024px) 80vw, 650px"
                className="relative z-10 mx-auto w-full object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.25)] transition duration-700 hover:scale-[1.03] sm:drop-shadow-[0_35px_50px_rgba(0,0,0,0.3)]"
              />

              {/* Floating card */}
              <div className="absolute right-0 top-1 z-20 rounded-xl border border-white/30 bg-white/75 p-2 shadow-lg backdrop-blur-xl sm:right-3 sm:top-5 sm:rounded-2xl sm:p-3 lg:right-8 lg:top-8">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500 text-white sm:h-10 sm:w-10 sm:rounded-xl">
                    <Tv className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>

                  <div>
                    <p className="text-[8px] text-gray-500 sm:text-[10px]">
                      Experience
                    </p>

                    <p className="text-[11px] font-black sm:text-sm">
                      Smarter TV
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          FEATURES
      ========================================================== */}
      <section className="bg-white px-5 py-14 sm:px-8 sm:py-20 lg:px-10">
        <div className="mx-auto max-w-7xl">
          {/* Heading */}
          <div className="max-w-2xl">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-red-500 sm:text-xs sm:tracking-[0.25em]">
              Entertainment Reimagined
            </p>

            <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight sm:mt-4 sm:text-5xl">
              Everything you love,
              <span className="block text-gray-300">
                right on your TV.
              </span>
            </h2>
          </div>

          {/* Feature cards */}
          <div className="mt-8 grid gap-4 sm:mt-12 sm:gap-5 md:grid-cols-3">
            {features.map(({ icon: Icon, title, text }, i) => (
              <div
                key={title}
                className={`group rounded-[1.7rem] p-6 transition-all duration-500 hover:-translate-y-2 sm:rounded-[2rem] sm:p-8 ${
                  i === 1
                    ? "bg-black text-white hover:bg-red-600"
                    : "bg-[#f5f5f6] hover:bg-black hover:text-white"
                }`}
              >
                {/* Icon */}
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500 text-white sm:h-12 sm:w-12 sm:rounded-2xl">
                  <Icon className="h-5 w-5" />
                </div>

                {/* Title */}
                <h3 className="mt-6 text-xl font-black sm:mt-8 sm:text-2xl">
                  {title}
                </h3>

                {/* Text */}
                <p className="mt-2.5 text-sm leading-6 text-gray-500 transition group-hover:text-gray-400">
                  {text}
                </p>

                {/* Explore */}
                <div className="mt-6 flex items-center gap-2 text-sm font-bold text-red-500 group-hover:text-white sm:mt-8">
                  Explore

                  <ArrowUpRight className="h-4 w-4 transition duration-300 group-hover:rotate-45" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          DEVICES
      ========================================================== */}
      <section className="px-5 py-14 sm:px-8 sm:py-20 lg:px-10">
        <div className="mx-auto max-w-7xl">
          {/* Heading */}
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end md:gap-5">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-red-500 sm:text-xs sm:tracking-[0.25em]">
                Choose Your Experience
              </p>

              <h2 className="mt-2.5 text-3xl font-black leading-tight tracking-tight sm:mt-3 sm:text-5xl">
                Built for entertainment.
              </h2>
            </div>

            <p className="max-w-md text-sm leading-6 text-gray-500">
              Explore the UlkaTV ecosystem and bring smarter entertainment
              into your home.
            </p>
          </div>

          {/* Device cards */}
          <div className="mt-8 grid gap-5 sm:mt-12 sm:gap-6 lg:grid-cols-2">
            {devices.map((device) => (
              <div
                key={device.title}
                className={`group overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] ${
                  device.dark ? "bg-black text-white" : "bg-white"
                }`}
              >
                {/* =================================================
                    DEVICE IMAGE
                ================================================== */}
                <div
                  className={`relative flex h-[250px] items-center justify-center p-5 sm:h-[340px] sm:p-8 ${
                    device.dark
                      ? "bg-gradient-to-br from-[#191919] to-black"
                      : "bg-gradient-to-br from-gray-100 to-white"
                  }`}
                >
                  {/* Tag */}
                  <span className="absolute left-5 top-5 z-10 rounded-full bg-red-500 px-3.5 py-1.5 text-[9px] font-black tracking-wide text-white sm:left-7 sm:top-7 sm:px-4 sm:py-2 sm:text-[10px]">
                    {device.tag}
                  </span>

                  <Image
                    src={device.image}
                    alt={device.title}
                    width={800}
                    height={600}
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 80vw, 600px"
                    className="h-full w-full object-contain transition duration-700 group-hover:scale-105 sm:group-hover:scale-110"
                  />
                </div>

                {/* =================================================
                    DEVICE CONTENT
                ================================================== */}
                <div className="flex items-center justify-between gap-4 p-5 sm:p-8">
                  <div className="min-w-0">
                    <h3 className="text-xl font-black sm:text-2xl">
                      {device.title}
                    </h3>

                    <p
                      className={`mt-1.5 text-sm sm:mt-2 ${
                        device.dark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {device.text}
                    </p>
                  </div>

                  {/* Arrow */}
                  <button
                    aria-label={`Explore ${device.title}`}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-500 text-white transition duration-500 group-hover:rotate-45 sm:h-12 sm:w-12"
                  >
                    <ArrowUpRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default StickPage;
