"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const contentSections = [
  { src: "/old-tv.png", alt: "Old TV" },
  { src: "/digitalTV.png", alt: "Digital TV" },
  { src: "/Smart_TV.png", alt: "Smart TV" },
];

const Aboutpage: React.FC = () => {
  const benefits = [
    {
      number: "01",
      title: "Enhanced Connectivity",
      description:
        "Bundled packages provide rural residents with both internet connectivity and IPTV services in a single offering. This ensures access to information, entertainment, and digital services through one reliable connection.",
    },
    {
      number: "02",
      title: "Digital Literacy",
      description:
        "Bundled packages encourage residents to engage with technology, improving digital literacy and developing skills that are increasingly important in today's digital world.",
    },
    {
      number: "03",
      title: "Technology Adoption",
      description:
        "Bundled packages introduce modern technology to rural communities, encouraging the use of Smartphones, Smart TVs and other connected devices.",
    },
  ];

  const ispBenefits = [
    "All services licensed by M.I.B which includes ULKA TV are exempt from AGR License Fee as per Amendment No.20-271/2010 AS-I(Vol2.-V) Dated 25/10/2021 of DOT.",
    "ISP can save AGR License Fee by giving discount in Internet service instead of discount in ULKA TV.",
    "ULKA TV bundled packages helps ISP to reach smaller towns, rural villages and take over DTH clients also.",
    "Bundled Packages of Internet and ULKA TV extends Internet customer base to Television-only houses also.",
    "ULKA TV Bundled Packages can be offered at lower rates compared to individual packs for Internet and Television.",
    "New connections will be easier without STB. Multiple connections in each house is easy from a single WiFi Router using ULKA Lite App in Smart TVs.",
    "Ready to start mobile TV service with pay channels using ULKA Mini in Smart Phones.",
    "Existing Hybrid STBs of DTH and Cable TV can be used with ULKA Lite from Google TV Playstore.",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % contentSections.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="bg-[#f7f8fc] text-[#10152f] overflow-hidden">

      {/* =====================================================
          HERO SECTION
      ====================================================== */}
      <section className="relative min-h-[580px] sm:min-h-[680px] bg-white overflow-hidden">

        {/* Background Effects */}
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-red-800/80 blur-3xl hidden md:block" />

        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-black blur-3xl hidden md:block" />

        <div className="absolute inset-0 opacity-[0.06]">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-16 sm:pt-20 lg:pt-32 pb-12 sm:pb-20">

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">

            {/* Hero Text */}
            <motion.div
              initial={{ opacity: 0, x: -70 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-white text-[8px] sm:text-[10px] mb-4 mx-auto lg:mx-0">

                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />

                ABOUT ULKA TV

              </div>

              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] text-black">

                The Future of

                <span className="block text-red-500 mt-1">
                  Television
                </span>

                is Here.

              </h1>

              <p className="mt-4 text-xs sm:text-base md:text-lg text-gray-600 leading-relaxed max-w-xl mx-auto lg:mx-0">

                ULKA TV brings together high-speed internet, IPTV and smart
                entertainment into one powerful digital experience for homes
                across India.

              </p>

              <div className="flex flex-wrap gap-3 mt-6 justify-center lg:justify-start">

                <Link
                  href="https://play.google.com/store/apps/details?id=com.ulkatv.ulka"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-full bg-red-600 text-white font-bold hover:bg-red-700 transition shadow-lg shadow-red-600/20 text-[10px] sm:text-sm"
                >
                  Explore ULKA TV →
                </Link>

                <Link
                  href="https://store.ulka.tv/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-full border border-white/20 text-white font-bold hover:bg-white hover:text-[#080d27] transition text-[10px] sm:text-sm"
                >
                  Order Now
                </Link>

              </div>

            </motion.div>

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="relative mt-6 lg:mt-0"
            >

              <div className="relative max-w-[320px] sm:max-w-[480px] lg:max-w-[550px] mx-auto">

                <div className="absolute inset-0 bg-red-600/30 blur-[80px] rounded-full" />

                <div className="relative rounded-[24px] sm:rounded-[40px] overflow-hidden border border-white/10 shadow-2xl bg-white/5 backdrop-blur-sm p-1.5 sm:p-3">

                  <Image
                    src={contentSections[currentIndex].src}
                    alt={contentSections[currentIndex].alt}
                    width={300}
                    height={800}
                    priority
                    className="w-full h-[180px] sm:h-[280px] lg:h-[320px] object-cover rounded-[16px] sm:rounded-[30px]"
                  />

                </div>

                <div className="absolute -bottom-3 sm:-bottom-6 -left-2 sm:-left-5 bg-white rounded-xl sm:rounded-2xl shadow-2xl px-3 sm:px-6 py-2 sm:py-5">

                  <p className="text-[6px] sm:text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
                    Entertainment
                  </p>

                  <p className="text-sm sm:text-xl font-black text-[#080d27]">
                    4K UHD
                  </p>

                </div>

                <div className="absolute -top-2 sm:-top-5 -right-2 sm:-right-5 bg-red-600 text-white rounded-xl sm:rounded-2xl px-2.5 sm:px-5 py-1.5 sm:py-4 shadow-xl">

                  <p className="text-[6px] sm:text-[10px]">
                    SMART
                  </p>

                  <p className="font-black text-xs sm:text-base">
                    IPTV
                  </p>

                </div>

              </div>

            </motion.div>

          </div>

        </div>

      </section>

      {/* =====================================================
          INTRO CARDS
      ====================================================== */}
      <section className="py-12 sm:py-24 bg-white">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">

          <div className="max-w-3xl mb-10 sm:mb-14 text-center sm:text-left">

            <p className="text-red-600 font-bold uppercase tracking-[0.2em] text-[8px] sm:text-xs">
              One Platform. Multiple Experiences.
            </p>

            <h2 className="mt-3 text-xl sm:text-3xl md:text-4xl font-black leading-tight">

              Entertainment designed for the

              <span className="text-red-600">
                {" "}connected India.
              </span>

            </h2>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">

            {[
              {
                title: "ULKA TV",
                text: "India's IPTV subscription platform delivering Indian channels using MPEG-DASH, HEVC and unicast technology.",
                tag: "IPTV",
              },
              {
                title: "ULKA Lite",
                text: "Turn traditional televisions into connected entertainment screens using Smart STBs, Sticks and WiFi.",
                tag: "SMART TV",
              },
              {
                title: "ULKA Mini",
                text: "Experience news and television content on smartphones with a modern mobile entertainment experience.",
                tag: "MOBILE TV",
              },
            ].map((item, index) => (

              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="group relative min-h-[220px] sm:min-h-[330px] rounded-[20px] sm:rounded-[28px] overflow-hidden bg-[#0b102d] p-5 sm:p-8 flex flex-col justify-end"
              >

                <Image
                  src="/hb-catalogue1.png"
                  alt={item.title}
                  fill
                  className="object-cover opacity-25 group-hover:opacity-35 group-hover:scale-110 transition duration-700"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#080d27] via-[#080d27]/70 to-transparent" />

                <div className="relative z-10">

                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-red-600 text-white text-[7px] sm:text-[10px] font-bold mb-3 sm:mb-5">
                    {item.tag}
                  </span>

                  <h3 className="text-base sm:text-xl font-black text-white mb-1.5 sm:mb-3">
                    {item.title}
                  </h3>

                  <p className="text-gray-300 leading-relaxed text-[10px] sm:text-sm">
                    {item.text}
                  </p>

                </div>

              </motion.div>

            ))}

          </div>

        </div>

      </section>

      {/* =====================================================
          ISP SECTION
      ====================================================== */}
      <section className="bg-red-600 text-white relative overflow-hidden">

        <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-20 py-10 sm:py-16 md:py-20 flex flex-col lg:flex-row items-center gap-6 lg:gap-12">

          <div className="w-full lg:w-1/2 z-10">

            <div className="flex items-center gap-2 mb-3">

              <div className="bg-white hover:bg-black text-red-600 hover:text-white font-bold rounded-full w-3 h-3 flex justify-center items-center" />

              <h2 className="text-lg sm:text-2xl font-semibold">
                ULKA TV for Internet Service Providers
              </h2>

            </div>

            <hr className="border-white my-3" />

            <p className="mb-1.5 font-bold text-base sm:text-lg">
              TELEVISION VIEWERSHIP
            </p>

            <p className="mb-2 text-sm sm:text-base">
              Television is the largest source of media in India by reaching
              approximately reaching over 500M households.
            </p>

            <hr className="border-white my-3" />

            <p className="mb-1.5 font-bold text-base sm:text-lg">
              DIGITAL INCLUSION
            </p>

            <p className="mb-2 text-sm sm:text-base">
              Expanding internet connectivity through IPTV can bridge the
              digital divide between urban and rural areas. Rural residents
              can access information, entertainment, and services that were
              previously unavailable to them, leading to a more inclusive
              society.
            </p>

            <hr className="border-white my-3" />

            <p className="mb-1.5 font-bold text-base sm:text-lg">
              BUNDLE PACKAGES TO PROMOTE INTERNET CONNECTIONS
            </p>

            <p className="mb-2 text-sm sm:text-base">
              Offering bundled packages that include both internet
              connectivity and IPTV services at reasonable rates, making it
              more attractive for urban or rural customers since they
              don&apos;t have to pay separately for Television connections.
            </p>

            <hr className="border-white my-3" />

            <button
              type="button"
              className="mt-4 px-5 py-2.5 bg-white text-red-600 font-bold rounded hover:bg-black hover:text-white transition text-xs sm:text-sm"
              onClick={() => window.open("https://store.ulka.tv/", "_blank")}
            >
              ORDER NOW
            </button>

          </div>

          <div className="hidden lg:block w-1/2 relative">

            <Image
              src="/mainulkaimage.png"
              alt="Ulka TV"
              width={800}
              height={800}
              className="w-full h-auto object-contain"
            />

          </div>

          <div className="lg:hidden w-full flex justify-center mt-2">

            <Image
              src="/mainulkaimage.png"
              alt="Ulka TV"
              width={200}
              height={200}
              className="w-1/2 max-w-xs object-contain"
            />

          </div>

        </div>

      </section>

      {/* =====================================================
          BENEFITS
      ====================================================== */}
      <section className="py-12 sm:py-24 bg-white">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">

          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">

            <span className="text-red-600 font-bold uppercase tracking-widest text-[8px] sm:text-xs">
              Why Bundle?
            </span>

            <h2 className="text-xl sm:text-3xl md:text-4xl font-black mt-3">

              Internet + IPTV

              <span className="text-red-600">
                {" "}makes sense.
              </span>

            </h2>

            <p className="text-gray-500 mt-3 sm:mt-5 text-xs sm:text-base">
              A single connected ecosystem gives customers more value while
              helping ISPs expand their reach.
            </p>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-7">

            {benefits.map((benefit, index) => (

              <motion.div
                key={benefit.number}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="group p-5 sm:p-8 rounded-[20px] sm:rounded-[28px] bg-[#f7f8fc] border border-gray-100 hover:bg-[#080d27] transition-all duration-500"
              >

                <span className="text-red-600 font-black text-2xl sm:text-4xl group-hover:text-red-500">
                  {benefit.number}
                </span>

                <h3 className="text-base sm:text-xl font-black mt-4 sm:mt-7 group-hover:text-white transition">
                  {benefit.title}
                </h3>

                <p className="text-gray-600 group-hover:text-gray-300 mt-2 sm:mt-4 leading-relaxed transition text-[10px] sm:text-sm">
                  {benefit.description}
                </p>

                <div className="mt-4 sm:mt-7 h-1 w-10 sm:w-12 bg-red-600 group-hover:w-16 sm:group-hover:w-24 transition-all duration-500" />

              </motion.div>

            ))}

          </div>

        </div>

      </section>

      {/* =====================================================
          VIEWERSHIP
      ====================================================== */}
      <section className="py-12 sm:py-24 bg-[#f1f3f8]">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-center">

            <div className="relative order-2 lg:order-1">

              <Image
                src="/tvone.png"
                alt="Family watching television"
                width={900}
                height={700}
                className="w-full h-[200px] sm:h-[350px] lg:h-[450px] object-cover rounded-[20px] sm:rounded-[35px] shadow-2xl"
              />

              <div className="absolute -bottom-3 sm:-bottom-6 -right-3 sm:-right-6 bg-red-600 text-white rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-xl">

                <p className="text-lg sm:text-2xl font-black">
                  500M+
                </p>

                <p className="text-[6px] sm:text-[10px]">
                  Indian Households
                </p>

              </div>

            </div>

            <div className="order-1 lg:order-2 text-center lg:text-left">

              <span className="text-red-600 font-bold uppercase tracking-widest text-[8px] sm:text-xs">
                Digital Inclusion
              </span>

              <h2 className="text-xl sm:text-3xl md:text-4xl font-black mt-3">

                Connecting

                <span className="block text-red-600">
                  every household.
                </span>

              </h2>

              <p className="text-gray-600 text-xs sm:text-base leading-relaxed mt-4 sm:mt-6">

                Television remains one of India&apos;s largest sources of
                media. ULKA TV combines this powerful medium with internet
                connectivity to create a more inclusive digital ecosystem.

              </p>

              <div className="mt-5 sm:mt-8 space-y-2 sm:space-y-4">

                {[
                  "Expand internet connectivity",
                  "Reach rural communities",
                  "Connect television-only households",
                  "Provide multi-device entertainment",
                ].map((item) => (

                  <div
                    key={item}
                    className="flex items-center gap-3 sm:gap-4 justify-center lg:justify-start"
                  >

                    <span className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-red-600 text-white flex items-center justify-center text-[8px] sm:text-xs">
                      ✓
                    </span>

                    <span className="font-semibold text-gray-700 text-[10px] sm:text-sm">
                      {item}
                    </span>

                  </div>

                ))}

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          ISP BENEFITS
      ====================================================== */}
      <section className="py-12 sm:py-24 bg-white">

        <div className="max-w-6xl mx-auto px-4 sm:px-6">

          <div className="text-center mb-10 sm:mb-14">

            <span className="text-red-600 font-bold uppercase tracking-widest text-[8px] sm:text-xs">
              ISP Advantage
            </span>

            <h2 className="text-xl sm:text-3xl md:text-4xl font-black mt-3">

              More Value.

              <span className="text-red-600">
                {" "}More Reach.
              </span>

            </h2>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-5">

            {ispBenefits.map((item, index) => (

              <motion.div
                key={index}
                initial={{
                  opacity: 0,
                  x: index % 2 === 0 ? -30 : 30,
                }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="flex gap-3 sm:gap-4 p-3.5 sm:p-6 rounded-xl sm:rounded-2xl bg-[#f7f8fc] hover:bg-[#080d27] group transition duration-300"
              >

                <div className="shrink-0 w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-[10px] sm:text-sm">
                  ✓
                </div>

                <p className="text-gray-700 group-hover:text-gray-300 leading-relaxed transition text-[10px] sm:text-sm">
                  {item}
                </p>

              </motion.div>

            ))}

          </div>

        </div>

      </section>

    </main>
  );
};

export default Aboutpage;
