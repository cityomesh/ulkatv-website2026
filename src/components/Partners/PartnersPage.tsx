"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const PartnersPage: React.FC = () => {
  const [selectedState, setSelectedState] = useState("Andhra Pradesh");

  const states = [
    "Andhra Pradesh",
    "Telangana",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
  ];

  const images = {
    "/patone.png": "SDC Logo",
    "/ptatwo.png": "SDC1 Logo",
    "/pta3.png": "SDC2 Logo",
    "/fastnet.png": "SDC3 Logo",
    "/gnet.png": "SDC4 Logo",
    "/onetfiber.png": "SDC5 Logo",
    "/ulkaone.png": "Ulka One",
    "/ulkatwo.png": "Ulka Two",
    "/ulkathree.png": "Ulka Three",
    "/ulkafour.png": "Ulka Four",
    "/ulkafive.png": "Ulka Five",
    "/ulkasix.png": "Ulka Six",
    "/ulkaseven.png": "Ulka Seven",
    "/ulka8.png": "Ulka Eight",
    "/ulkanine.png": "Ulka Nine",
    "/ulkaten.png": "Ulka Ten",
    "/ulka11.png": "Ulka Eleven",
    "/ulka12.jpg": "Ulka Twelve",
    "/ulka13.png": "Ulka Thirteen",
  };

  const partners: Record<string, string[]> = {
    "Andhra Pradesh": [
      "/patone.png",
      "/ptatwo.png",
      "/pta3.png",
      "/ulkafour.png",
    ],
    Telangana: [
      "/patone.png",
      "/ptatwo.png",
      "/pta3.png",
      "/ulkatwo.png",
      "/ulkathree.png",
      "/ulkafour.png",
      "/ulka12.jpg",
      "/ulka13.png",
    ],
    Assam: [
      "/ptatwo.png",
      "/ulkaten.png",
      "/ulkatwo.png",
      "/ulka11.png",
    ],
    Bihar: ["/ptatwo.png"],
    Karnataka: [
      "/fastnet.png",
      "/gnet.png",
      "/pta3.png",
      "/patone.png",
      "/ulka8.png",
      "/ulkanine.png",
    ],
    Kerala: ["/fastnet.png", "/ulkafive.png"],
    "Madhya Pradesh": ["/ulkaone.png"],
    Maharashtra: ["/ulkathree.png"],
    Odisha: ["/ptatwo.png"],
    "Tamil Nadu": ["/ulka12.jpg"],
    "West Bengal": ["/ptatwo.png", "/gnet.png"],
  };

  const cards = [
    ["01", "Network Partners", "Major PSUs BSNL and Railtel are our network partners for IPTV services."],
    ["02", "ISP Partners", "More than 20 national and regional ISPs are engaged in promoting and distributing our IPTV services across India."],
    ["03", "LCO Partners", "Enthusiastic LCOs are participating in IPTV distribution using Mini CDNs and IPTV VLAN."],
  ];

  const renderImages = (list: string[] = []) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
      {list.map((src) => (
        <div
          key={src}
          className="h-28 bg-gradient-to-br from-white via-red-50/30 to-white border border-gray-100 rounded-xl flex items-center justify-center p-4 hover:shadow-md transition"
        >
          <Image
            src={src}
            alt={images[src as keyof typeof images]}
            width={180}
            height={100}
            className="object-contain max-h-20 w-auto"
          />
        </div>
      ))}
    </div>
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-red-50/30 to-white pt-24 pb-16">

      {/* HEADER */}
      <section className="max-w-6xl mx-auto px-4 mb-8 mt-[3rem] text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
          Our Partners
        </h1>
        <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
          Working together with trusted network partners and ISPs to deliver
          quality IPTV services across India.
        </p>
      </section>

      {/* LOGO SLIDER */}
      <section className="max-w-6xl mx-auto px-4 mb-10">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 overflow-hidden">
          <div className="flex w-max animate-scroll gap-5">
            {[...Object.keys(images), ...Object.keys(images)].map((src, i) => (
              <div
                key={`${src}-${i}`}
                className="w-36 h-24 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center p-4 shrink-0"
              >
                <Image
                  src={src}
                  alt={images[src as keyof typeof images]}
                  width={150}
                  height={80}
                  className="object-contain max-h-16 w-auto"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map(([number, title, text]) => (
            <Link
              key={number}
              href="https://play.google.com/store/apps/details?id=com.ulkatv.ulka"
              target="_blank"
              className="group"
            >
              <div
                className="
                  relative h-full overflow-hidden
                  rounded-3xl
                  border border-gray-200
                  bg-gradient-to-br from-white via-white to-red-50
                  p-7
                  transition-all duration-300
                  hover:-translate-y-2
                  hover:border-red-200
                  hover:shadow-[0_20px_45px_rgba(239,68,68,0.12)]
                "
              >
                {/* Background decoration */}
                <div
                  className="
                    absolute -right-12 -top-12
                    h-32 w-32
                    rounded-full
                    bg-red-100/50
                    transition-transform duration-500
                    group-hover:scale-150
                  "
                />

                {/* Number */}
                <div className="relative flex items-center justify-between mb-8">
                  <div
                    className="
                      flex h-12 w-12 items-center justify-center
                      rounded-2xl
                      bg-black
                      text-white
                      shadow-lg
                      transition-all duration-300
                      group-hover:bg-red-500
                      group-hover:rotate-3
                    "
                  >
                    <span className="text-sm font-bold">
                      {number}
                    </span>
                  </div>

                  {/* Arrow */}
                  <div
                    className="
                      flex h-9 w-9 items-center justify-center
                      rounded-full
                      border border-gray-200
                      text-gray-400
                      transition-all duration-300
                      group-hover:border-red-200
                      group-hover:bg-red-50
                      group-hover:text-red-500
                    "
                  >
                    →
                  </div>
                </div>

                {/* Content */}
                <div className="relative">
                  <h3
                    className="
                      text-xl font-bold text-gray-900
                      transition-colors duration-300
                      group-hover:text-red-500
                    "
                  >
                    {title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-gray-500">
                    {text}
                  </p>
                </div>

                {/* Bottom accent */}
                <div
                  className="
                    absolute bottom-0 left-0
                    h-1 w-0
                    bg-red-500
                    transition-all duration-500
                    group-hover:w-full
                  "
                />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* STATE PARTNERS */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-8">

          <div className="mb-7">
            <p className="text-red-500 text-sm font-semibold">
              PARTNER NETWORK
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">
              ULKATV Partners by State
            </h2>
            <p className="text-gray-500 text-sm mt-2">
              Select a state to view our partners.
            </p>
          </div>

          {/* STATES */}
          <div className="flex flex-wrap gap-2 mb-8">
            {states.map((state) => (
              <button
                key={state}
                onClick={() => setSelectedState(state)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                  selectedState === state
                    ? "bg-black text-white border-black shadow-sm"
                    : "bg-white text-gray-600 border-gray-200 hover:border-red-400 hover:text-red-500"
                }`}
              >
                {state}
              </button>
            ))}
          </div>

          {/* SELECTED STATE */}
          <div className="border-t border-gray-100 pt-7">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-400">
                  Selected State
                </p>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mt-1">
                  {selectedState}
                </h3>
              </div>

              <div className="px-4 py-2 rounded-full bg-red-50 text-red-500 text-sm font-medium">
                UlkaTV Partners
              </div>
            </div>

            {renderImages(partners[selectedState])}
          </div>
        </div>
      </section>

      {/* ANIMATION */}
      <style jsx>{`
        @keyframes scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll 45s linear infinite;
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </main>
  );
};

export default PartnersPage;
