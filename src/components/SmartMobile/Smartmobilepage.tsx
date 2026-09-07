"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

import {
  ShieldCheck,
  Smartphone,
  Zap,
  Settings2,
  ScanLine,
  ChevronRight,
  CheckCircle2,
  Tv,
  Layers3,
  Sparkles,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";

const phoneImages = [
  ["/img2.png", "UlkaTV Mobile Interface"],
  ["/img6.png", "UlkaTV Mobile App"],
  ["/img3.png", "UlkaTV on Phone"],
  ["/img5.png", "UlkaTV Streaming"],
  ["/img4.png", "UlkaTV Channel Preview"],
] as const;

const showcaseImages = [
  {
    src: "/img8.png",
    alt: "UlkaMini Mobile Interface",
    title: "UlkaMini",
    subtitle: "Entertainment in your hands",
    number: "01",
  },
  {
    src: "/img7.png",
    alt: "UlkaTV Live Channel Guide",
    title: "Live Channel Guide",
    subtitle: "Discover channels instantly",
    number: "02",
  },
] as const;

const features = [
  {
    icon: ShieldCheck,
    number: "01",
    title: "Regulatory Compliance",
    text: "The app adheres to regulatory standards. Channels are accessible only within the authorized ISP/CDN partner network.",
  },
  {
    icon: Settings2,
    number: "02",
    title: "Self-Service Management",
    text: "Customers can manage subscriptions, renewals and package selection directly through the UlkaTV mobile experience.",
  },
] as const;

const subscriptionFeatures = [
  {
    icon: Layers3,
    number: "01",
    title: "Full Control",
    text: "Manage package renewals, on-demand packs and a-la-carte channels directly from your mobile.",
  },
  {
    icon: ScanLine,
    number: "02",
    title: "Instant Activation",
    text: "Activate UlkaCare seamlessly by scanning the barcode shown on your TV screen.",
  },
] as const;

const Pill = ({
  icon: Icon,
  children,
}: {
  icon: LucideIcon;
  children: React.ReactNode;
}) => (
  <div className="flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-2 text-[10px] font-bold text-neutral-600">
    <Icon
      size={13}
      className="shrink-0 text-red-600"
    />
    {children}
  </div>
);

const Smartmobilepage = () => {
  const [phoneIndex, setPhoneIndex] =
    useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPhoneIndex(
        (i) => (i + 1) % phoneImages.length
      );
    }, 3500);

    return () => clearInterval(timer);
  }, []);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f7f7f7] text-black">

      {/* BACKGROUND */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/2 top-[-250px] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-red-600/[0.05] blur-[120px]" />

        <div className="absolute bottom-[-200px] right-[-150px] h-[400px] w-[400px] rounded-full bg-red-600/[0.035] blur-[100px]" />
      </div>

      {/* HERO */}
      <section className="px-5 pb-16 pt-20 sm:px-8 sm:pt-28 lg:px-10 lg:pb-20">

        <div className="mx-auto max-w-[1350px]">

          {/* LABEL */}
          <motion.div
            initial={{
              opacity: 0,
              y: -15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mb-8 flex justify-center"
          >
            <div className="flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-2 shadow-sm sm:px-4">

              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black text-white">
                <Smartphone size={13} />
              </span>

              <span className="text-[9px] font-black uppercase tracking-[0.18em] text-neutral-600 sm:text-[10px]">
                UlkaTV Mobile
              </span>

              <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
            </div>
          </motion.div>

          {/* HERO GRID */}
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_430px_1fr] lg:gap-10">

            {/* LEFT */}
            <motion.div
              initial={{
                opacity: 0,
                x: -30,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              className="order-2 text-center lg:order-1 lg:text-left"
            >
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.18em] text-red-600">
                <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
                Smart Entertainment
              </div>

              <h1 className="text-[3.1rem] font-black leading-[0.9] tracking-[-0.07em] sm:text-6xl lg:text-[5.1rem]">
                Your TV.
                <br />
                <span className="text-red-600">
                  Your Mobile.
                </span>
                <br />
                Your Control.
              </h1>

              <p className="mx-auto mt-6 max-w-md text-[13px] leading-6 text-neutral-500 sm:text-sm sm:leading-7 lg:mx-0">
                Watch, manage, renew and control
                your complete entertainment
                experience directly from your
                smartphone.
              </p>

              <div className="mt-6 flex flex-wrap justify-center gap-2 lg:justify-start">
                <Pill icon={Smartphone}>
                  Mobile Ready
                </Pill>

                <Pill icon={Tv}>
                  Live TV
                </Pill>

                <Pill icon={Zap}>
                  Instant Access
                </Pill>
              </div>

              <div className="mt-7 flex justify-center lg:justify-start">
                <button className="group flex items-center gap-3 rounded-full bg-black px-6 py-3.5 text-sm font-bold text-white transition hover:bg-red-600">
                  Get Started

                  <ArrowUpRight
                    size={17}
                    className="transition group-hover:translate-x-1 group-hover:-translate-y-1"
                  />
                </button>
              </div>
            </motion.div>

            {/* PHONE */}
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.9,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                duration: 0.8,
              }}
              className="order-1 flex justify-center lg:order-2"
            >
              <div className="relative flex h-[450px] w-full max-w-[330px] items-center justify-center sm:h-[570px] sm:max-w-[370px] lg:h-[640px]">

                <div className="absolute h-[290px] w-[290px] rounded-full border border-red-600/10 sm:h-[400px] sm:w-[400px] lg:h-[470px] lg:w-[470px]" />

                <div className="absolute h-[220px] w-[220px] rounded-full bg-red-600/[0.06] sm:h-[320px] sm:w-[320px] lg:h-[390px] lg:w-[390px]" />

                <motion.div
                  animate={{
                    y: [0, -7, 0],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="relative z-10 h-[430px] w-[245px] sm:h-[550px] sm:w-[315px] lg:h-[625px] lg:w-[355px]"
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={
                        phoneImages[
                          phoneIndex
                        ][0]
                      }
                      initial={{
                        opacity: 0,
                        scale: 0.96,
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                      }}
                      exit={{
                        opacity: 0,
                      }}
                      transition={{
                        duration: 0.55,
                      }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={
                          phoneImages[
                            phoneIndex
                          ][0]
                        }
                        alt={
                          phoneImages[
                            phoneIndex
                          ][1]
                        }
                        fill
                        priority={
                          phoneIndex === 0
                        }
                        sizes="(max-width:640px) 245px, (max-width:1024px) 315px, 355px"
                        className="object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,.2)]"
                      />
                    </motion.div>
                  </AnimatePresence>
                </motion.div>

                {/* STATUS */}
                <div className="absolute bottom-0 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-black/10 bg-white px-3.5 py-2 shadow-lg">
                  <span className="h-2 w-2 rounded-full bg-green-500" />

                  <span className="text-[9px] font-black text-neutral-600">
                    Connected
                  </span>
                </div>

                {/* DOTS */}
                <div className="absolute bottom-[-25px] left-1/2 flex -translate-x-1/2 gap-1.5">
                  {phoneImages.map(
                    (_, i) => (
                      <button
                        key={i}
                        onClick={() =>
                          setPhoneIndex(i)
                        }
                        aria-label={`Show mobile image ${
                          i + 1
                        }`}
                        className={`h-1.5 rounded-full transition-all ${
                          i === phoneIndex
                            ? "w-7 bg-red-600"
                            : "w-1.5 bg-neutral-300"
                        }`}
                      />
                    )
                  )}
                </div>
              </div>
            </motion.div>

            {/* RIGHT */}
            <motion.div
              initial={{
                opacity: 0,
                x: 30,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              className="order-3 text-center lg:text-left"
            >
              <div className="mx-auto max-w-xs lg:mx-0">

                <div className="mb-5 flex justify-center lg:justify-start">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white">
                    <Tv size={21} />
                  </div>
                </div>

                <p className="mb-3 text-[9px] font-black uppercase tracking-[0.2em] text-red-600">
                  Connected Experience
                </p>

                <h2 className="text-2xl font-black leading-tight tracking-tight sm:text-3xl">
                  One experience.
                  <br />
                  <span className="text-red-600">
                    Two screens.
                  </span>
                </h2>

                <p className="mt-4 text-sm leading-7 text-neutral-500">
                  Your television and mobile
                  work together to give you
                  complete control over your
                  entertainment.
                </p>

                <div className="mt-6 flex items-center justify-center gap-3 lg:justify-start">

                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white">
                    <Tv size={16} />
                  </div>

                  <div className="h-px w-10 bg-red-600/30" />

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-white">
                    <Smartphone size={16} />
                  </div>

                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* SHOWCASE */}
      <section className="px-5 py-20 sm:px-8 sm:py-24 lg:px-10">
        <div className="mx-auto max-w-[1350px]">

          <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-14">

            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-[9px] font-black uppercase tracking-[0.2em] text-white">
              <Sparkles
                size={12}
                className="text-red-500"
              />
              Explore UlkaTV
            </div>

            <h2 className="text-[2.4rem] font-black leading-[0.95] tracking-[-0.065em] sm:text-5xl lg:text-6xl">
              Everything you need,
              <br />
              <span className="text-red-600">
                right in your hand.
              </span>
            </h2>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-neutral-500">
              A beautifully connected
              experience between your
              television and mobile device.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">

            {showcaseImages.map(
              (item, index) => (
                <motion.div
                  key={item.src}
                  initial={{
                    opacity: 0,
                    y: 25,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    delay: index * 0.1,
                  }}
                  className="group relative h-[430px] overflow-hidden rounded-[26px] border border-black/10 bg-white sm:h-[460px]"
                >

                  <span className="absolute left-5 top-5 z-10 text-[10px] font-black tracking-[0.2em] text-neutral-300">
                    {item.number}
                  </span>

                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width:768px) 100vw, 50vw"
                    className="object-contain p-8 transition duration-700 group-hover:scale-[1.03] sm:p-12"
                  />

                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-white via-white/80 to-transparent px-5 pb-5 pt-24 sm:px-8 sm:pb-8">

                    <div>
                      <h3 className="text-xl font-black sm:text-2xl">
                        {item.title}
                      </h3>

                      <p className="mt-1 text-xs text-neutral-400">
                        {item.subtitle}
                      </p>
                    </div>

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black text-white group-hover:bg-red-600">
                      <ArrowUpRight size={17} />
                    </div>

                  </div>
                </motion.div>
              )
            )}

          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-black px-5 py-20 text-white sm:px-8 sm:py-24 lg:px-10 lg:py-28">

        <div className="mx-auto max-w-[1350px]">

          <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">

            <div>
              <div className="mb-5 flex items-center gap-2">

                <span className="h-2 w-2 rounded-full bg-red-600" />

                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-500">
                  Powerful Features
                </span>

              </div>

              <h2 className="text-[2.8rem] font-black leading-[0.92] tracking-[-0.06em] sm:text-5xl lg:text-6xl">
                Everything
                <br />
                <span className="text-red-600">
                  connected.
                </span>
              </h2>

              <p className="mt-6 max-w-sm text-sm leading-7 text-neutral-500">
                Smart technology designed
                to make your entertainment
                experience simpler.
              </p>
            </div>

            <div className="border-t border-white/10">

              {features.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="grid gap-4 border-b border-white/10 py-8 sm:grid-cols-[45px_55px_1fr]"
                  >

                    <span className="text-[10px] font-black text-neutral-600">
                      {item.number}
                    </span>

                    <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-red-500">
                      <Icon size={18} />
                    </div>

                    <div>
                      <h3 className="text-xl font-black sm:text-2xl">
                        {item.title}
                      </h3>

                      <p className="mt-2.5 text-sm leading-7 text-neutral-500">
                        {item.text}
                      </p>
                    </div>

                  </div>
                );
              })}

            </div>
          </div>
        </div>
      </section>

      {/* ULKACARE */}
      <section className="px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28">

        <div className="mx-auto max-w-[1350px]">

          <div className="rounded-[28px] bg-white p-6 sm:p-10 lg:p-14">

            <div className="grid gap-8 lg:grid-cols-[1fr_0.65fr] lg:items-end">

              <div>

                <div className="mb-5 flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-600 text-white">
                    <Tv size={15} />
                  </div>

                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-red-600">
                    UlkaCare
                  </span>

                </div>

                <h2 className="text-[2.6rem] font-black leading-[0.93] tracking-[-0.065em] sm:text-5xl lg:text-6xl">
                  Your subscription.
                  <br />
                  <span className="text-red-600">
                    Your control.
                  </span>
                </h2>

              </div>

              <p className="max-w-md text-sm leading-7 text-neutral-500">
                Take complete control of your
                entertainment subscriptions
                without depending on a reseller.
              </p>

            </div>

            <div className="mt-10 grid border-y border-black/10 md:grid-cols-2">

              {subscriptionFeatures.map(
                (item, index) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className={`py-8 md:px-8 md:py-10 ${
                        index === 1
                          ? "border-t border-black/10 md:border-l md:border-t-0"
                          : ""
                      }`}
                    >

                      <div className="flex items-center justify-between">

                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white">
                          <Icon size={19} />
                        </div>

                        <span className="text-[10px] font-black tracking-[0.2em] text-neutral-300">
                          {item.number}
                        </span>

                      </div>

                      <h3 className="mt-6 text-xl font-black sm:text-2xl">
                        {item.title}
                      </h3>

                      <p className="mt-3 text-sm leading-7 text-neutral-500">
                        {item.text}
                      </p>

                    </div>
                  );
                }
              )}

            </div>

            {/* CTA */}
            <div className="mt-8 flex flex-col gap-4 rounded-2xl bg-[#f7f7f7] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-600">
                  <CheckCircle2 size={19} />
                </div>

                <div>

                  <p className="text-sm font-black">
                    Simple. Fast. Self-Service.
                  </p>

                  <p className="mt-1 text-[11px] text-neutral-400">
                    Manage everything directly
                    from your phone.
                  </p>

                </div>
              </div>

              <button className="group flex w-full items-center justify-center gap-2 rounded-full bg-red-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-black sm:w-auto">
                Get Started

                <ChevronRight
                  size={17}
                  className="transition group-hover:translate-x-1"
                />
              </button>

            </div>

          </div>
        </div>
      </section>

    </main>
  );
};

export default Smartmobilepage;
