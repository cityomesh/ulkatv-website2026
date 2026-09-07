"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Download,
  ShieldCheck,
  Smartphone,
  Tv,
  Wifi,
  Zap,
  Sparkles,
  ShoppingCart,
  CirclePlay,
} from "lucide-react";

const images = [
  "/ulkatv_playstore.png",
  "/ulkatv_show.png",
  "/cricket_screen.png",
  "/ulkatv_home_screen.png",
  "/ulkatv_channels.png",
];

const partners = [
  { src: "/patone.png", alt: "Partner 1" },
  { src: "/ptatwo.png", alt: "Partner 2" },
  { src: "/pta3.png", alt: "Partner 3" },
  { src: "/fastnet.png", alt: "Partner 4" },
  { src: "/gnet.png", alt: "Partner 5" },
  { src: "/onetfiber.png", alt: "Partner 6" },
  { src: "/ulkaone.png", alt: "Ulka One" },
  { src: "/ulkatwo.png", alt: "Ulka Two" },
  { src: "/ulkathree.png", alt: "Ulka Three" },
  { src: "/ulkafour.png", alt: "Ulka Four" },
  { src: "/ulkafive.png", alt: "Ulka Five" },
  { src: "/ulkasix.png", alt: "Ulka Six" },
  { src: "/ulkaseven.png", alt: "Ulka Seven" },
  { src: "/ulka8.png", alt: "Ulka Eight" },
  { src: "/ulkanine.png", alt: "Ulka Nine" },
  { src: "/ulkaten.png", alt: "Ulka Ten" },
  { src: "/ulka11.png", alt: "Ulka Eleven" },
  { src: "/ulka12.jpg", alt: "Ulka Twelve" },
  { src: "/ulka13.png", alt: "Ulka Thirteen" },
];

const productButtons = [
  {
    title: "Smart TV",
    href: "/smarttv",
    icon: Tv,
    className:
      "from-red-600 via-red-700 to-black hover:from-red-500 hover:via-red-600 hover:to-gray-950",
    glow: "hover:shadow-red-500/40",
  },
  {
    title: "Smart Mobile",
    href: "/smartmobile",
    icon: Smartphone,
    className:
      "from-black via-gray-900 to-red-700 hover:from-gray-950 hover:via-red-800 hover:to-red-600",
    glow: "hover:shadow-red-500/40",
  },
  {
    title: "Set Top Box",
    href: "/stb",
    icon: Tv,
    className:
      "from-red-700 via-black to-red-600 hover:from-red-600 hover:via-gray-950 hover:to-red-500",
    glow: "hover:shadow-red-500/40",
  },
  {
    title: "ULKA Stick",
    href: "/stick",
    icon: Wifi,
    className:
      "from-black via-red-800 to-black hover:from-gray-950 hover:via-red-700 hover:to-gray-900",
    glow: "hover:shadow-red-500/40",
  },
];

const HomePage: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Wifi,
      title: "Stable",
      text: "Reliable IPTV experience",
    },
    {
      icon: ShieldCheck,
      title: "Weather Ready",
      text: "No weather disruptions",
    },
    {
      icon: ShoppingCart,
      title: "Affordable",
      text: "No extra expenses",
    },
    {
      icon: Tv,
      title: "No Dish",
      text: "No physical dish required",
    },
    {
      icon: Zap,
      title: "Simple",
      text: "Less wire clutter",
    },
  ];

  const appFeatures = [
    "One-click customer login",
    "Pre-built Ulka bundles",
    "A-la-carte channel selection",
    "Easy subscription management",
  ];

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-white text-slate-900">
      <section className="relative overflow-hidden px-3 pb-7 pt-24 sm:px-6 sm:pb-8 sm:pt-28 md:px-8 md:pb-10 md:pt-40">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white via-red-50/30 to-white" />
        <div className="absolute left-[-180px] top-[8%] h-[320px] w-[320px] rounded-full bg-red-500/5 blur-[90px] sm:h-[400px] sm:w-[400px]" />
        <div className="absolute right-[-160px] top-[15%] h-[350px] w-[350px] rounded-full bg-black/5 blur-[100px] sm:h-[450px] sm:w-[450px]" />

        <div className="pointer-events-none absolute inset-0 opacity-[0.025]">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "linear-gradient(#ef4444 1px, transparent 1px), linear-gradient(90deg, #ef4444 1px, transparent 1px)",
              backgroundSize: "70px 70px",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl">
          <div className="grid items-center gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-7">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="order-2 min-w-0 lg:order-1"
            >
              <h1 className="text-[2rem] font-bold leading-[1.08] tracking-[-0.03em] sm:text-5xl md:text-6xl lg:text-7xl">
                <span className="text-black">Welcome to the</span>
                <br />
                <span className="bg-gradient-to-r from-red-700 via-black to-red-600 bg-clip-text text-transparent">
                  Future of Entertainment
                </span>
              </h1>

              <p className="mt-4 max-w-xl text-[14px] leading-6 text-black/70 sm:mt-6 sm:text-lg sm:leading-relaxed">
                ULKA TV is a leading IPTV subscription provider across India.
                Experience seamless streaming with MPEG-DASH &amp; HEVC codec
                with unicast technology.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <div className="flex items-center gap-1.5 rounded-full border border-red-100 bg-white px-3 py-1.5 text-[10px] font-medium text-slate-600 shadow-sm sm:gap-2 sm:px-4 sm:py-2 sm:text-xs">
                  <Wifi size={13} className="shrink-0 text-red-600" />
                  Stable Streaming
                </div>

                <div className="flex items-center gap-1.5 rounded-full border border-red-100 bg-white px-3 py-1.5 text-[10px] font-medium text-slate-600 shadow-sm sm:gap-2 sm:px-4 sm:py-2 sm:text-xs">
                  <Tv size={13} className="shrink-0 text-red-600" />
                  Live TV
                </div>

                <div className="flex items-center gap-1.5 rounded-full border border-red-100 bg-white px-3 py-1.5 text-[10px] font-medium text-slate-600 shadow-sm sm:gap-2 sm:px-4 sm:py-2 sm:text-xs">
                  <Zap size={13} className="shrink-0 text-red-600" />
                  Instant Access
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2 sm:mt-6 sm:grid-cols-4 sm:gap-2.5">
                {productButtons.map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.08 }}
                      className="min-w-0"
                    >
                      <Link
                        href={item.href}
                        className={`group relative flex min-h-[58px] w-full items-center justify-center gap-1.5 overflow-hidden rounded-xl border border-white/20 bg-gradient-to-br ${item.className} px-2 py-2.5 text-center shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${item.glow} sm:min-h-[64px] sm:gap-2 sm:rounded-2xl sm:px-3 sm:py-3`}
                      >
                        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                        <Icon
                          size={17}
                          className="relative z-10 shrink-0 text-white transition-transform duration-300 group-hover:scale-110 sm:h-[19px] sm:w-[19px]"
                        />

                        <span className="relative z-10 whitespace-nowrap text-[10px] font-extrabold text-white sm:text-xs">
                          {item.title}
                        </span>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 30 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.9 }}
              className="order-1 relative min-w-0 lg:order-2"
            >
              <div className="absolute left-1/2 top-1/2 h-[250px] w-[250px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-400/10 blur-[90px] sm:h-[400px] sm:w-[400px]" />

              <div className="relative mx-auto w-full max-w-[720px]">
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -left-2 top-6 z-20 hidden rounded-2xl border border-red-100 bg-white/95 p-4 shadow-xl backdrop-blur-xl md:block"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
                      <CirclePlay size={20} className="text-red-600" />
                    </div>

                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        Live Entertainment
                      </p>
                      <p className="mt-1 text-[10px] text-slate-400">
                        Streaming experience
                      </p>
                    </div>
                  </div>
                </motion.div>

                <div className="relative overflow-hidden rounded-[22px] border border-red-100 bg-white p-1.5 shadow-xl shadow-red-200/30 sm:rounded-[30px] sm:p-2.5 md:rounded-[35px] md:p-3">
                  <div className="relative h-[270px] w-full overflow-hidden rounded-[18px] bg-gradient-to-br from-red-50/40 to-white sm:h-[360px] sm:rounded-[25px] md:h-[430px] lg:h-auto lg:aspect-[1.28/1]">
                    {images.map((src, index) => (
                      <motion.div
                        key={src}
                        initial={false}
                        animate={{
                          opacity: index === currentIndex ? 1 : 0,
                          scale: index === currentIndex ? 1 : 1.015,
                        }}
                        transition={{
                          opacity: {
                            duration: 0.65,
                            ease: "easeInOut",
                          },
                          scale: {
                            duration: 0.8,
                            ease: "easeOut",
                          },
                        }}
                        className="absolute inset-0 flex items-center justify-center"
                        style={{
                          pointerEvents:
                            index === currentIndex ? "auto" : "none",
                        }}
                      >
                        <Image
                          src={src}
                          alt={`ULKA TV screen ${index + 1}`}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 55vw"
                          priority={index === 0}
                          className="object-contain"
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>

                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{
                    duration: 4.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -bottom-3 right-1 z-20 max-w-[185px] rounded-xl border border-red-100 bg-white/95 px-3 py-2.5 shadow-xl backdrop-blur-xl sm:-bottom-4 sm:right-2 sm:max-w-none sm:rounded-2xl sm:px-5 sm:py-4"
                >
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <div className="rounded-lg bg-green-50 p-1.5 sm:rounded-xl sm:p-2">
                      <ShieldCheck
                        size={16}
                        className="text-green-500 sm:h-[18px] sm:w-[18px]"
                      />
                    </div>

                    <div>
                      <p className="text-[10px] font-bold text-slate-800 sm:text-xs">
                        Smooth Experience
                      </p>
                      <p className="mt-0.5 text-[8px] text-slate-400 sm:mt-1 sm:text-[10px]">
                        Powered by ULKA
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className="mt-4 flex justify-center gap-1.5 sm:mt-5 sm:gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? "w-7 bg-red-600 sm:w-8"
                        : "w-2 bg-red-200 hover:bg-red-400"
                    }`}
                    aria-label={`Show image ${index + 1}`}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative px-3 py-7 sm:px-6 sm:py-8 md:px-8 md:py-10">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.15fr_.85fr] lg:gap-9">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="group relative min-w-0"
          >
            <div className="absolute -inset-5 rounded-[35px] bg-red-200/20 blur-3xl opacity-70 transition-all duration-500 group-hover:bg-red-400/30 group-hover:opacity-100" />

            <motion.div
              whileHover={{ scale: 1.025 }}
              transition={{
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative z-[2] overflow-hidden rounded-[20px] border border-red-100 bg-white p-1.5 shadow-xl shadow-red-100 transition-all duration-500 group-hover:border-red-300 group-hover:shadow-2xl group-hover:shadow-red-300/40 sm:rounded-[30px] sm:p-3"
            >
              <div className="relative aspect-video overflow-hidden rounded-[15px] bg-slate-900 sm:rounded-2xl">
                <video
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  src="/intro.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                />

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="pointer-events-none absolute inset-0 rounded-[15px] border border-transparent transition-all duration-500 group-hover:border-red-400/40 sm:rounded-2xl" />

                <div className="absolute bottom-2.5 left-2.5 flex items-center gap-2 rounded-xl border border-white/20 bg-black/60 px-2.5 py-2 text-white backdrop-blur-xl transition-all duration-500 group-hover:border-red-400/40 group-hover:bg-black/75 sm:bottom-4 sm:left-4 sm:gap-3 sm:px-3 sm:py-2.5">
                  <CirclePlay
                    size={15}
                    className="text-red-400 transition-transform duration-500 group-hover:scale-110 sm:h-[17px] sm:w-[17px]"
                  />
                  <span className="text-[9px] font-semibold sm:text-xs">
                    Experience ULKA
                  </span>
                </div>
              </div>
            </motion.div>

            <div className="pointer-events-none absolute -right-1 top-1/2 z-[1] hidden h-20 w-20 -translate-y-1/2 rounded-full bg-red-500/20 blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:bg-red-500/35 sm:block" />

            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -bottom-6 right-[-4px] z-10 w-[78px] sm:-bottom-10 sm:right-[-5px] sm:w-[130px] md:w-[170px] lg:right-[-30px] lg:w-[190px]"
            >
              <Image
                src="/img2.png"
                alt="MyULKA Smartphone App"
                width={400}
                height={700}
                className="h-auto w-full drop-shadow-2xl"
              />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative min-w-0"
          >
            <div className="mb-3 flex items-center gap-3">
              <span className="h-1 w-8 rounded-full bg-red-600 sm:w-10" />
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-red-600 sm:text-xs sm:tracking-[0.2em]">
                MyULKA App
              </span>
            </div>

            <h2 className="text-[2rem] font-black leading-[1.08] tracking-[-0.03em] text-slate-900 sm:text-4xl md:text-5xl">
              Your entertainment.
              <br />
              <span className="text-red-600">Your control.</span>
            </h2>

            <p className="mt-4 text-[14px] leading-6 text-slate-600 sm:text-sm sm:leading-7 md:text-base">
              Take control of your account with the MyULKA Customer App.
              Manage subscriptions, explore packages and customize your
              entertainment experience directly from your smartphone.
            </p>

            <div className="mt-5 space-y-2.5">
              {appFeatures.map((item) => (
                <div key={item} className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-50">
                    <Check size={14} className="text-red-600" />
                  </div>

                  <span className="text-[13px] font-medium text-slate-700 sm:text-sm">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            <a
              href="https://play.google.com/store/apps/details?id=com.ulkatv.ulka"
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-6 inline-flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-red-600 to-black px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-500/20 transition duration-300 hover:-translate-y-1 hover:shadow-red-500/40 sm:w-auto sm:px-6"
            >
              <Download size={18} />
              Download MyULKA App
              <ArrowRight
                size={16}
                className="transition group-hover:translate-x-1"
              />
            </a>
          </motion.div>
        </div>
      </section>

      {/* ==============================
          ULKA EXPERIENCE
      ================================ */}
      <section className="relative overflow-hidden bg-white px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-20">
        {/* Background */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-red-100/50 blur-3xl" />
          <div className="absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-slate-100/70 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl">
          {/* Main Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_70px_rgba(15,23,42,0.08)] sm:rounded-[36px]"
          >
            <div className="grid items-center lg:grid-cols-[1.1fr_0.9fr]">

              {/* IMAGE */}
              <div className="relative order-1 flex min-h-[300px] items-center justify-center overflow-hidden bg-gradient-to-br from-red-50 via-white to-slate-50 p-5 sm:min-h-[420px] sm:p-8 lg:order-1 lg:min-h-[560px] lg:p-10">

                {/* Decorative circle */}
                <div className="absolute left-1/2 top-1/2 h-[240px] w-[240px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-200/30 blur-3xl sm:h-[400px] sm:w-[400px]" />

                {/* Small badge */}
                <div className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-full border border-red-100 bg-white/90 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-red-600 shadow-sm backdrop-blur-md sm:left-7 sm:top-7 sm:px-4 sm:text-xs">
                  <Sparkles size={13} />
                  The ULKA Experience
                </div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.15 }}
                  className="relative z-10 w-full"
                >
                  <Image
                    src="/mainulkaimage.png"
                    alt="ULKA TV"
                    width={1200}
                    height={1000}
                    priority
                    className="mx-auto h-auto max-h-[330px] w-full object-contain transition duration-700 hover:scale-[1.03] sm:max-h-[450px] lg:max-h-[510px]"
                  />
                </motion.div>
              </div>

              {/* CONTENT */}
              <div className="order-2 flex flex-col justify-center p-6 sm:p-9 lg:p-12 xl:p-16">

                <div className="mb-5 flex items-center gap-3">
                  <span className="h-1 w-9 rounded-full bg-red-600" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-600 sm:text-xs">
                    Smart Entertainment
                  </span>
                </div>

                <h2 className="max-w-xl text-[2.25rem] font-black leading-[1.03] tracking-[-0.04em] text-slate-950 sm:text-5xl lg:text-6xl">
                  Entertainment that
                  <span className="block bg-gradient-to-r from-red-700 via-red-500 to-black bg-clip-text text-transparent">
                    looks this good.
                  </span>
                </h2>

                <p className="mt-5 max-w-lg text-sm leading-7 text-slate-500 sm:text-base">
                  One powerful ecosystem designed to bring television, streaming
                  and smart entertainment together — beautifully and effortlessly.
                </p>

                {/* Mini highlights */}
                <div className="mt-7 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 transition hover:border-red-200 hover:bg-red-50/50">
                    <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-red-100 text-red-600">
                      <Tv size={18} />
                    </div>

                    <p className="text-xs font-bold text-slate-800 sm:text-sm">
                      Smart TV
                    </p>

                    <p className="mt-1 text-[10px] leading-4 text-slate-500 sm:text-xs">
                      Complete entertainment
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 transition hover:border-red-200 hover:bg-red-50/50">
                    <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-red-100 text-red-600">
                      <Wifi size={18} />
                    </div>

                    <p className="text-xs font-bold text-slate-800 sm:text-sm">
                      Connected
                    </p>

                    <p className="mt-1 text-[10px] leading-4 text-slate-500 sm:text-xs">
                      TV • Mobile • STB
                    </p>
                  </div>
                </div>

                {/* CTA */}
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={() => window.open("https://store.ulka.tv/", "_blank")}
                    className="group flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-black px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-500/20 transition duration-300 hover:-translate-y-1 hover:shadow-red-500/30"
                  >
                    Explore ULKA
                    <ArrowRight
                      size={17}
                      className="transition group-hover:translate-x-1"
                    />
                  </button>

                  <div className="flex items-center justify-center rounded-xl border border-slate-200 px-5 py-3.5 text-xs font-semibold text-slate-500">
                    One complete ecosystem
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>


      {/* ==============================
          WHY ULKA
      ================================ */}
      <section className="relative overflow-hidden bg-slate-50 px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-20">

        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-red-100/40 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl">

          {/* HEADER */}
          <div className="mb-8 grid gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">

            <div>
              <div className="mb-3 flex items-center gap-3">
                <span className="h-1 w-8 rounded-full bg-red-600 sm:w-10" />

                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-600 sm:text-xs">
                  Why ULKA
                </span>
              </div>

              <h2 className="text-[2.1rem] font-black leading-[1.04] tracking-[-0.04em] text-slate-950 sm:text-4xl lg:text-5xl">
                Less complexity.
                <span className="block text-red-600">
                  More entertainment.
                </span>
              </h2>
            </div>

            <p className="max-w-xl text-sm leading-7 text-slate-500 lg:ml-auto lg:text-base">
              ULKA removes the complexity from traditional television and gives you
              a cleaner, smarter and more connected entertainment experience.
            </p>
          </div>


          {/* FEATURES */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {features.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: index * 0.07,
                    duration: 0.5,
                  }}
                  whileHover={{ y: -6 }}
                  className="group relative overflow-hidden rounded-[22px] border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:border-red-200 hover:shadow-xl hover:shadow-red-100/50"
                >

                  {/* Number */}
                  <span className="absolute right-4 top-4 text-[10px] font-black text-slate-200 transition group-hover:text-red-100">
                    0{index + 1}
                  </span>

                  {/* Icon */}
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-red-600 transition duration-300 group-hover:bg-red-600 group-hover:text-white">
                    <Icon size={21} />
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 sm:text-base">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-[11px] leading-5 text-slate-500 sm:text-xs sm:leading-6">
                    {item.text}
                  </p>

                  {/* Bottom line */}
                  <div className="mt-5 h-[2px] w-8 rounded-full bg-red-500 transition-all duration-300 group-hover:w-full" />
                </motion.div>
              );
            })}
          </div>


          {/* CTA BANNER */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative mt-6 overflow-hidden rounded-[24px] bg-gradient-to-r from-red-600 via-red-600 to-black p-6 shadow-xl shadow-red-500/10 sm:p-7 lg:p-8"
          >

            {/* Decorative glow */}
            <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

            <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

              <div>
                <h3 className="text-xl font-black tracking-tight text-white sm:text-2xl">
                  Ready to experience ULKA?
                </h3>

                <p className="mt-1.5 text-xs leading-5 text-red-100 sm:text-sm">
                  Choose your preferred device and start streaming.
                </p>
              </div>

              <button
                onClick={() => window.open("https://store.ulka.tv/", "_blank")}
                className="group flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-slate-950 shadow-lg transition duration-300 hover:-translate-y-1 hover:bg-slate-50 md:w-auto"
              >
                Order Now

                <ArrowRight
                  size={17}
                  className="transition group-hover:translate-x-1"
                />
              </button>

            </div>
          </motion.div>

        </div>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-b from-red-50/50 to-white py-7 sm:py-8 md:py-10">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 md:px-8">
          <div className="mb-6 text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-red-600 shadow-sm sm:px-4 sm:py-2 sm:text-xs">
              Trusted Network
            </div>

            <h2 className="text-3xl font-black text-slate-900 sm:text-4xl md:text-5xl">
              Our Partners
            </h2>

            <p className="mx-auto mt-2 max-w-xl text-[13px] leading-6 text-slate-500 sm:text-sm">
              Working together with trusted technology and network partners to
              deliver a better entertainment experience.
            </p>
          </div>
        </div>

        <div className="relative w-full">
          <div className="pointer-events-none absolute left-0 top-0 z-20 h-full w-12 bg-gradient-to-r from-red-50 to-transparent sm:w-20 md:w-32" />
          <div className="pointer-events-none absolute right-0 top-0 z-20 h-full w-12 bg-gradient-to-l from-white to-transparent sm:w-20 md:w-32" />

          <div className="partner-track">
            {[...partners, ...partners].map((partner, index) => (
              <div key={`${partner.src}-${index}`} className="partner-card">
                <Image
                  src={partner.src}
                  alt={partner.alt}
                  width={220}
                  height={130}
                  className="partner-image"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        .partner-track {
          display: flex;
          width: max-content;
          align-items: center;
          gap: 14px;
          animation: partner-scroll 55s linear infinite;
          will-change: transform;
        }

        .partner-track:hover {
          animation-play-state: paused;
        }

        .partner-card {
          width: 180px;
          height: 105px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 15px;
          background: white;
          border: 1px solid #fee2e2;
          border-radius: 20px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.06);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .partner-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(220, 38, 38, 0.15);
        }

        .partner-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
        }

        @keyframes partner-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-50% - 7px));
          }
        }

        @media (max-width: 640px) {
          .partner-track {
            gap: 10px;
            animation-duration: 45s;
          }

          .partner-card {
            width: 140px;
            height: 85px;
            padding: 10px;
            border-radius: 16px;
          }

          html,
          body {
            overflow-x: hidden;
          }
        }

        @media (max-width: 480px) {
          .partner-track {
            gap: 8px;
            animation-duration: 42s;
          }

          .partner-card {
            width: 125px;
            height: 76px;
            padding: 9px;
            border-radius: 14px;
          }
        }

        @media (max-width: 360px) {
          .partner-card {
            width: 112px;
            height: 70px;
            padding: 8px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .partner-track {
            animation-play-state: paused;
          }
        }
      `}</style>
    </main>
  );
};

export default HomePage;
