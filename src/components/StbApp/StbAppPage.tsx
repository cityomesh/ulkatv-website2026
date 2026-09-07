"use client";

import Image from "next/image";
import React from "react";
import {
  ShieldCheck,
  Server,
  MonitorSmartphone,
  Tv,
  Sparkles,
  CheckCircle2,
  Settings2,
} from "lucide-react";

const StbAppPage = () => {
  const features = [
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      text: "We have developed AOSP (Android Open Source Platform) STBs with a customized launcher that complies with TRAI regulations.",
    },
    {
      icon: <Server className="w-6 h-6" />,
      text: "OTT apps are available to users, and their placement is managed by our DRM Application Server or a dedicated OTA server to ensure scalability.",
    },
    {
      icon: <MonitorSmartphone className="w-6 h-6" />,
      text: "Ulka Lite App is available on Google TV / Android TV Play Stores, usable within our partner network. Alternatively, it can be downloaded from our website and installed manually on AOSP STBs or Smart TVs (Android versions 7.1 to 13).",
    },
    {
      icon: <Tv className="w-6 h-6" />,
      text: "UlkaTV App is approved in the Samsung App Store and complies with all regulatory requirements.",
    },
    {
      icon: <Settings2 className="w-6 h-6" />,
      text: "Our DRM solution supports Tizen OS version 3.0 and above, covering Samsung TV models from 2016 to 2024.",
    },
    {
      icon: <CheckCircle2 className="w-6 h-6" />,
      text: "UlkaTV App is approved in the LG App Store and works on all models running WebOS 3.0 and above. Currently, only FTA channels are enabled, and fingerprint compliance is under development.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">

      {/* HERO */}
      <section className="relative bg-gradient-to-br from-red-800 via-red-600 to-red-800 pt-32 pb-24 overflow-hidden">

        <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/15 rounded-full blur-3xl" />

        <div className="absolute top-1/2 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

        <div className="absolute -bottom-20 left-1/3 w-72 h-72 bg-white/10 rounded-full blur-3xl" />

        <div className="absolute top-24 right-20 w-20 h-20 border border-white/20 rounded-full" />

        <div className="absolute top-36 right-32 w-10 h-10 bg-white/10 rounded-full" />

        <div className="absolute bottom-20 left-16 w-16 h-16 border border-white/20 rounded-full" />

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

          <div className="text-center">

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight">
              Set-Top-Box
            </h1>

            <p className="mt-5 text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              Advanced AOSP-based Set-Top-Box solutions designed for
              reliable and secure digital entertainment.
            </p>

          </div>

        </div>

        {/* WHITE WAVE */}
        <div className="absolute bottom-0 left-0 w-full">

          <svg
            viewBox="0 0 1440 100"
            className="w-full h-auto"
            preserveAspectRatio="none"
          >
            <path
              d="M0,70 C250,20 400,100 720,55 C1000,15 1200,80 1440,40 L1440,100 L0,100 Z"
              fill="white"
            />
          </svg>

        </div>

      </section>

      {/* IMAGES */}
      <section className="relative py-10 sm:py-14 px-4 sm:px-6 lg:px-8 bg-white">

        <div className="max-w-7xl mx-auto">

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">

            {/* MAIN IMAGE */}
            <div className="md:col-span-3">

              <div className="group relative bg-white rounded-3xl overflow-hidden shadow-xl transition-all duration-500 hover:-translate-y-1">

                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-700 via-white to-red-700 z-10" />

                <Image
                  src="/ulkatv_home_screen.png"
                  alt="UlkaTV Home Screen"
                  width={900}
                  height={600}
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  priority
                />

              </div>

            </div>

            {/* STB IMAGE */}
            <div className="md:col-span-2">

              <div className="group relative bg-white rounded-3xl overflow-hidden shadow-xl transition-all duration-500 hover:-translate-y-1 h-full">

                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-white via-red-600 to-white z-10" />

                <Image
                  src="/Set_top_box.png"
                  alt="Set Top Box"
                  width={900}
                  height={600}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* FEATURES */}
      <section className="relative py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-red-50 to-white overflow-hidden">

        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl opacity-80" />

        <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-100 rounded-full blur-3xl opacity-70" />

        <div className="relative z-10 max-w-7xl mx-auto">

          <div className="text-center mb-12">

            <div className="inline-flex items-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-full mb-5 shadow-lg shadow-red-200">

              <Sparkles className="w-4 h-4" />

              <span className="text-sm font-semibold">
                Our Capabilities
              </span>

            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-red-700">
              Powerful Features
            </h2>

            <div className="flex items-center justify-center gap-2 mt-4">

              <span className="h-1 w-10 bg-red-600 rounded-full" />

              <span className="h-1 w-20 bg-red-200 rounded-full" />

              <span className="h-1 w-10 bg-red-600 rounded-full" />

            </div>

            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Simple, secure and scalable entertainment solutions
              designed for modern digital networks.
            </p>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {features.map((feature, index) => {

              const isRed = index % 2 === 0;

              return (
                <div
                  key={index}
                  className={`
                    group
                    relative
                    rounded-3xl
                    p-6
                    min-h-[250px]
                    flex
                    flex-col
                    justify-between
                    overflow-hidden
                    transition-all
                    duration-500
                    hover:-translate-y-2
                    hover:shadow-2xl
                    ${
                      isRed
                        ? "bg-gradient-to-br from-red-700 via-red-600 to-red-700 text-white shadow-lg shadow-red-200"
                        : "bg-white text-gray-800 border-2 border-red-100 shadow-lg hover:border-red-300"
                    }
                  `}
                >

                  <div
                    className={`
                      absolute
                      -top-16
                      -right-16
                      w-40
                      h-40
                      rounded-full
                      blur-2xl
                      transition-all
                      duration-500
                      group-hover:scale-150
                      ${
                        isRed
                          ? "bg-white/15"
                          : "bg-red-100"
                      }
                    `}
                  />

                  {isRed && (
                    <div className="absolute inset-0 rounded-3xl border border-white/20 pointer-events-none" />
                  )}

                  <div className="relative z-10 flex items-center justify-between">

                    <div
                      className={`
                        w-14
                        h-14
                        rounded-2xl
                        flex
                        items-center
                        justify-center
                        shadow-lg
                        transition-all
                        duration-300
                        group-hover:rotate-3
                        group-hover:scale-110
                        ${
                          isRed
                            ? "bg-white text-red-600"
                            : "bg-red-600 text-white"
                        }
                      `}
                    >
                      {feature.icon}
                    </div>

                    <span
                      className={`
                        text-5xl
                        font-black
                        ${
                          isRed
                            ? "text-white/20"
                            : "text-red-100"
                        }
                      `}
                    >
                      0{index + 1}
                    </span>

                  </div>

                  <p
                    className={`
                      relative
                      z-10
                      mt-6
                      text-sm
                      sm:text-base
                      leading-relaxed
                      font-medium
                      ${
                        isRed
                          ? "text-white/95"
                          : "text-gray-700"
                      }
                    `}
                  >
                    {feature.text}
                  </p>

                  <div
                    className={`
                      relative
                      z-10
                      mt-6
                      h-1
                      w-12
                      rounded-full
                      transition-all
                      duration-500
                      group-hover:w-24
                      ${
                        isRed
                          ? "bg-white"
                          : "bg-red-600"
                      }
                    `}
                  />

                </div>
              );
            })}

          </div>

        </div>

      </section>

      {/* ULKATV SECTION */}
      <section className="relative py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden">

        <div className="absolute top-10 left-0 w-72 h-72 bg-red-50 rounded-full blur-3xl" />

        <div className="absolute bottom-0 right-0 w-80 h-80 bg-red-100 rounded-full blur-3xl opacity-60" />

        <div className="relative z-10 max-w-5xl mx-auto">

          <div className="relative rounded-[2rem] bg-gradient-to-br from-red-800 via-red-600 to-red-700 p-8 sm:p-12 shadow-2xl text-white overflow-hidden">

            <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />

            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

            <div className="absolute inset-0 rounded-[2rem] border border-white/20 pointer-events-none" />

            <div className="relative z-10">

              <div className="flex items-center gap-4 mb-6">

                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-lg">

                  <Tv className="w-7 h-7 text-red-600" />

                </div>

                <div>

                  <p className="text-white/70 text-sm font-medium">
                    Digital Entertainment Platform
                  </p>

                  <h2 className="text-2xl sm:text-3xl font-bold">
                    UlkaTV
                  </h2>

                </div>

              </div>

              <p className="text-white/90 text-base sm:text-lg leading-relaxed max-w-4xl">
                UlkaTV is a digital television service provider that
                delivers live TV channels, video-on-demand, and OTT
                content through its own app and platform. It supports
                Smart TVs, Set-Top Boxes, Android TV and AOSP-based
                systems.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">

                <div className="group bg-white/10 hover:bg-white rounded-2xl p-5 border border-white/15 hover:border-white transition-all duration-300">

                  <div className="w-11 h-11 rounded-xl bg-white text-red-600 flex items-center justify-center mb-3 group-hover:bg-red-600 group-hover:text-white transition-all duration-300">

                    <ShieldCheck className="w-6 h-6" />

                  </div>

                  <p className="text-sm font-semibold group-hover:text-red-700 transition-colors">
                    Secure & DRM Protected
                  </p>

                </div>

                <div className="group bg-white/10 hover:bg-white rounded-2xl p-5 border border-white/15 hover:border-white transition-all duration-300">

                  <div className="w-11 h-11 rounded-xl bg-white text-red-600 flex items-center justify-center mb-3 group-hover:bg-red-600 group-hover:text-white transition-all duration-300">

                    <Tv className="w-6 h-6" />

                  </div>

                  <p className="text-sm font-semibold group-hover:text-red-700 transition-colors">
                    Multi Device Support
                  </p>

                </div>

                <div className="group bg-white/10 hover:bg-white rounded-2xl p-5 border border-white/15 hover:border-white transition-all duration-300">

                  <div className="w-11 h-11 rounded-xl bg-white text-red-600 flex items-center justify-center mb-3 group-hover:bg-red-600 group-hover:text-white transition-all duration-300">

                    <Server className="w-6 h-6" />

                  </div>

                  <p className="text-sm font-semibold group-hover:text-red-700 transition-colors">
                    Scalable Platform
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
};

export default StbAppPage;