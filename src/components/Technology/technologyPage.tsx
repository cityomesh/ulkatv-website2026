"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const TechnologyPage = () => {
    const [showPopup, setShowPopup] = useState(false);

    const handleOrderNow = async () => {
        const url = "https://store.ulka.tv/";

        try {
            const controller = new AbortController();

            const timeout = setTimeout(() => {
                controller.abort();
            }, 5000);

            await fetch(url, {
                method: "HEAD",
                mode: "no-cors",
                signal: controller.signal,
            });

            clearTimeout(timeout);

            window.open(url, "_blank");
        } catch {
            setShowPopup(true);
        }
    };

    const technologyFeatures = [
        "ULKA distributes live television channels on local broadband networks without any Internet data consumption & dedicated Cable TV Network.",
        "ULKA has developed its own CDN system and is not dependent on third-party vendors. It offers regional advertisements to save trunk line capacity.",
        "Rcast has developed its own CDN system with a minimum trunk line requirement, offering cost-effective connectivity.",
        "150-300 Mbps for 250 SD+16 HD Channels and 500-1000 Mbps for all 700 Channels.",
    ];

    const testimonials = [
        {
            number: "01",
            name: "Enhanced Connectivity",
            feedback:
                "Bundled packages provide rural residents with both internet connectivity and IPTV services in a single offering. This ensures that individuals have access to information, entertainment, and services through a reliable and convenient connection.",
        },
        {
            number: "02",
            name: "Digital Literacy and Skill Development",
            feedback:
                "Bundled packages encourage residents to engage with technology, leading to improved digital literacy and skills that are increasingly relevant in today's world.",
        },
        {
            number: "03",
            name: "Technology Adoption",
            feedback:
                "Bundled packages introduce technology to rural communities, encouraging the use of Smartphones, Smart TVs, and other devices. This can have long-term benefits in terms of technology adoption and adaptation.",
        },
    ];

    const complianceCards = [
        {
            img: "/2.png",
            title:
                "Our IPTV Infrastructure is Audited by TRAI empaneled Auditors for Regulatory Compliance",
        },
        {
            img: "/5.png",
            title:
                "Compliance and Subscription Audits were conducted by multiple Auditors including BECIL, KPMG, Delloite, and others",
        },
        {
            img: "/ulka-1.png",
            title:
                "Our Smart Apps, ULKA Lite and ULKA Mini were also Audited for Regulatory Compliance along with our Smart STBs.",
        },
    ];

    const iptvPoints = [
        "IPTV is licensed by M.I.B and is exempted from AGR using existing local broadband networks. AGR is payable for OTT applications.",
        "All OTT applications use global streaming servers like Amazon and Akamai, consuming internet bandwidth, making it expensive.",
        "Distribution of licensed satellite channels is permitted only through licensed operators (IPTV, DTH, etc.).",
        "M.I.B is in the process of withdrawing live satellite channels from OTT platforms like Disney Hotstar and Sony LIV.",
    ];

    const comparisonPoints = [
        "Cable TV requires Dedicated 2GB-3GB bandwidth for the Trunk Line against 310mbps to 1Gbps BW for ULKA TV.",
        "Cable TV requires Edge QAM modulator and EDFA at each Distribution Location costing Rs.300k-400k against ULKA TV CDN (Streaming Server) at Rs.15k-50k.",
        "Distribution of Digital Cable TV requires dedicated Dark fiber Network and WDM couplers and Decouplers which adds to the CAPEX of distribution.",
        "ULKA TV distributes the IPTV signal in existing local broadband Networks and cost of dedicated high power laser network can be avoided.",
    ];

    return (
        <main className="w-full overflow-hidden bg-white text-slate-800">

            {/* HERO */}
            <section className="relative overflow-hidden border-b border-slate-100 bg-white">
                <div className="absolute -right-32 -top-32 h-[450px] w-[450px] rounded-full bg-red-50" />
                <div className="absolute right-20 top-20 h-32 w-32 rounded-full border border-red-100" />
                <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-slate-50" />

                <div className="pointer-events-none absolute inset-0 opacity-[0.025]">
                    <div
                        className="h-full w-full"
                        style={{
                            backgroundImage:
                                "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
                            backgroundSize: "70px 70px",
                        }}
                    />
                </div>

                <div className="relative mx-auto flex min-h-[460px] max-w-7xl items-center px-6 py-24 md:px-10 mt-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-3xl"
                    >
                        <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight text-slate-950 sm:text-5xl md:text-6xl">
                            Technology
                            <span className="block text-red-600">
                                Built for Connectivity
                            </span>
                        </h1>

                        <p className="mt-6 max-w-2xl text-sm leading-7 text-slate-500 md:text-base">
                            Advanced IPTV infrastructure, intelligent CDN technology
                            and regulatory-compliant distribution designed for modern
                            broadband networks.
                        </p>

                        <div className="mt-8 flex items-center gap-3">
                            <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
                            <span className="h-px w-20 bg-slate-200" />
                            <span className="text-[10px] font-medium uppercase tracking-widest text-slate-400">
                                Innovation • Connectivity • Efficiency
                            </span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* CORE TECHNOLOGY */}
            <section className="relative bg-white py-20 md:py-24">
                <div className="mx-auto max-w-7xl px-6 md:px-10">
                    <div className="mb-12 max-w-2xl">
                        <div className="mb-4 flex items-center gap-3">
                            <span className="h-2 w-2 rounded-full bg-red-600" />
                            <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-red-600">
                                Core Technology
                            </span>
                        </div>

                        <h2 className="text-3xl font-semibold leading-tight tracking-tight text-slate-950 md:text-4xl">
                            Infrastructure designed around{" "}
                            <span className="text-red-600">efficiency.</span>
                        </h2>

                        <p className="mt-4 max-w-xl text-sm leading-6 text-slate-500">
                            ULKA technology combines IPTV distribution, CDN
                            infrastructure and optimized bandwidth utilization
                            into one connected system.
                        </p>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                        {technologyFeatures.map((text, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.08,
                                }}
                                className="group relative overflow-hidden border border-slate-200 bg-white p-7 transition-all duration-500 hover:-translate-y-2 hover:border-black hover:bg-black hover:shadow-2xl"
                            >
                                <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-red-50 transition-all duration-500 group-hover:scale-150 group-hover:bg-red-600/20" />

                                <div className="relative">
                                    <div className="flex items-start justify-between">
                                        <div className="flex h-10 w-10 items-center justify-center bg-red-600 text-xs font-semibold text-white transition-all duration-500 group-hover:bg-white group-hover:text-black group-hover:rotate-6">
                                            {String(index + 1).padStart(2, "0")}
                                        </div>

                                        <span className="text-lg text-slate-300 transition-all duration-500 group-hover:translate-x-1 group-hover:text-white">
                                            ↗
                                        </span>
                                    </div>

                                    <p className="mt-7 max-w-xl text-sm leading-6 text-slate-600 transition-colors duration-500 group-hover:text-white">
                                        {text}
                                    </p>

                                    <div className="mt-6 flex items-center gap-3">
                                        <span className="h-[2px] w-8 bg-red-600 transition-all duration-500 group-hover:w-16 group-hover:bg-white" />
                                        <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                                            Technology
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* IPTV INFRASTRUCTURE */}
            <section className="relative overflow-hidden bg-red-50/50 py-20 md:py-32">
                <div className="absolute -left-40 top-1/2 h-[700px] w-[700px] -translate-y-1/2 rounded-full bg-red-100/60 blur-3xl" />

                <div className="relative mx-auto grid max-w-[99rem] items-center gap-6 px-4 md:px-10 lg:grid-cols-2 lg:gap-20">
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="relative flex items-center justify-center"
                    >
                        <div className="absolute -inset-10 rounded-3xl bg-gradient-to-tr from-red-100/60 to-red-300/30 blur-3xl" />

                        <div className="relative w-full">
                            <Image
                                src="/newtvsmart.png"
                                alt="IPTV Technology"
                                width={1800}
                                height={1200}
                                priority
                                className="h-auto w-full rounded-2xl object-contain shadow-2xl shadow-red-500/20"
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                    >
                        <div className="mb-7 flex items-center gap-3">
                            <span className="h-[2px] w-9 bg-red-600" />
                            <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-red-600">
                                IPTV Infrastructure
                            </span>
                        </div>

                        <h2 className="text-3xl font-semibold leading-tight tracking-tight text-slate-950 md:text-4xl">
                            IPTV built for
                            <span className="text-red-600">
                                {" "}efficient distribution.
                            </span>
                        </h2>

                        <div className="mt-7">
                            {iptvPoints.map((text, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 15 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.08 }}
                                    className="group flex gap-4 border-b border-red-100 py-4"
                                >
                                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-600 text-[10px] font-semibold text-white">
                                        {index + 1}
                                    </span>

                                    <p className="text-sm leading-6 text-slate-600">
                                        {text}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* CONNECTED COMMUNITIES */}
            <section className="relative bg-white py-20 md:py-24">
                <div className="mx-auto max-w-7xl px-6 md:px-10">
                    <div className="mb-12 max-w-3xl">
                        <div className="mb-4 flex items-center gap-3">
                            <span className="h-2 w-2 bg-red-600" />
                            <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-red-600">
                                Connected Communities
                            </span>
                        </div>

                        <h2 className="text-3xl font-semibold leading-tight tracking-tight text-slate-950 md:text-4xl">
                            Bundling IPTV and INTERNET Packages
                            <span className="text-red-600">
                                {" "}helps Internet Service Providers.
                            </span>
                        </h2>
                    </div>

                    <div className="grid gap-5 md:grid-cols-3">
                        {testimonials.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.08,
                                }}
                                className="group relative overflow-hidden border border-slate-200 bg-white p-7 transition-all duration-500 hover:-translate-y-2 hover:border-red-600 hover:bg-red-600 hover:shadow-2xl"
                            >
                                <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-red-50 transition-all duration-500 group-hover:scale-[1.8] group-hover:bg-red-700" />

                                <div className="relative">
                                    <div className="flex items-center justify-between">
                                        <span className="text-2xl font-semibold text-red-600 group-hover:text-white">
                                            {item.number}
                                        </span>

                                        <span className="text-lg text-slate-300 group-hover:text-white">
                                            ↗
                                        </span>
                                    </div>

                                    <div className="mt-6 h-px w-full bg-slate-100 group-hover:bg-red-400" />

                                    <h3 className="mt-6 text-lg font-semibold leading-snug text-slate-900 group-hover:text-white">
                                        {item.name}
                                    </h3>

                                    <p className="mt-3 text-sm leading-6 text-slate-500 group-hover:text-red-50">
                                        {item.feedback}
                                    </p>

                                    <div className="mt-6 flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-red-600 group-hover:text-white">
                                        <span className="h-1.5 w-1.5 rounded-full bg-red-600 group-hover:bg-white" />
                                        ULKA Advantage
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* IPTV VS CABLE */}
            <section className="relative overflow-hidden bg-slate-50 py-20 md:py-24">
                <div className="absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-red-100/40 blur-3xl" />

                <div className="relative mx-auto max-w-7xl px-6 md:px-10">
                    <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">

                        <div>
                            <div className="mb-4 flex items-center gap-3">
                                <span className="h-[2px] w-9 bg-red-600" />
                                <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-red-600">
                                    Technology Comparison
                                </span>
                            </div>

                            <h2 className="text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
                                IPTV
                                <span className="mx-3 text-slate-300">vs</span>
                                <span className="text-red-600">Cable TV</span>
                            </h2>

                            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-500">
                                A smarter distribution architecture designed to
                                reduce bandwidth requirements and infrastructure
                                costs.
                            </p>

                            <div className="mt-8 space-y-3">
                                {comparisonPoints.map((text, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.08 }}
                                        className="group flex gap-4 border border-slate-200 bg-white p-4 transition-all duration-300 hover:border-black hover:shadow-md"
                                    >
                                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-600 text-[10px] font-semibold text-white">
                                            {index + 1}
                                        </span>

                                        <p className="text-sm leading-6 text-slate-600">
                                            {text}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>

                            {/* ORDER NOW */}
                            <button
                                onClick={handleOrderNow}
                                className="group mt-8 inline-flex items-center gap-4 bg-black px-7 py-3.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:bg-red-600"
                            >
                                ORDER NOW
                                <span className="transition-transform duration-300 group-hover:translate-x-1">
                                    →
                                </span>
                            </button>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7 }}
                            className="border border-slate-200 bg-white p-6 shadow-sm md:p-8"
                        >
                            <div className="mb-5 flex items-center justify-between">
                                <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                                    Distribution Architecture
                                </span>

                                <span className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-widest text-red-600">
                                    <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
                                    Optimized
                                </span>
                            </div>

                            <div className="flex justify-center">
                                <Image
                                    src="/cabletv.png"
                                    alt="Ulka TV"
                                    width={450}
                                    height={180}
                                    className="h-auto w-full max-w-[300px] object-contain"
                                />
                            </div>

                            <div className="mt-7 grid grid-cols-2 gap-3">
                                <div className="border border-slate-200 p-5">
                                    <p className="text-md font-semibold text-slate-950">
                                        310 Mbps
                                    </p>
                                    <p className="mt-1 text-[10px] leading-5 text-slate-400">
                                        ULKA starting bandwidth
                                    </p>
                                </div>

                                <div className="bg-red-600 p-5">
                                    <p className="text-md font-semibold text-white">
                                        700+
                                    </p>
                                    <p className="mt-1 text-[10px] leading-5 text-red-100">
                                        Channel capability
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* REGULATORY COMPLIANCE */}
            <section className="relative bg-white py-20 md:py-24">
                <div className="mx-auto max-w-7xl px-6 md:px-10">
                    <div className="mb-12">
                        <div className="mb-4 flex items-center gap-3">
                            <span className="h-[2px] w-9 bg-red-600" />
                            <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-red-600">
                                Compliance
                            </span>
                        </div>

                        <h2 className="text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
                            Regulatory
                            <span className="text-red-600"> Compliance</span>
                        </h2>

                        <p className="mt-4 max-w-xl text-sm leading-6 text-slate-500">
                            Our infrastructure, applications and Smart STBs
                            undergo regulatory and subscription audits to
                            maintain compliance.
                        </p>
                    </div>

                    <div className="grid gap-5 md:grid-cols-3">
                        {complianceCards.map((card, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.08,
                                }}
                                className="group overflow-hidden border border-slate-200 bg-white transition-all duration-500 hover:-translate-y-2 hover:border-black hover:bg-black hover:shadow-2xl"
                            >
                                <div className="relative h-[210px] overflow-hidden bg-slate-100">
                                    <Image
                                        src={card.img}
                                        alt={card.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

                                    <span className="absolute left-4 top-4 flex h-8 w-8 items-center justify-center bg-red-600 text-[10px] font-semibold text-white">
                                        {String(index + 1).padStart(2, "0")}
                                    </span>
                                </div>

                                <div className="p-6">
                                    <h3 className="text-sm font-medium leading-6 text-slate-700 group-hover:text-white">
                                        {card.title}
                                    </h3>

                                    <div className="mt-5 flex items-center gap-2">
                                        <span className="h-[2px] w-7 bg-red-600 group-hover:w-14 group-hover:bg-white" />
                                        <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-red-600 group-hover:text-white">
                                            Verified Infrastructure
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* POPUP */}
            {showPopup && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="relative w-full max-w-md rounded-2xl bg-white p-7 text-center shadow-2xl"
                    >
                        <button
                            onClick={() => setShowPopup(false)}
                            className="absolute right-4 top-4 text-xl text-slate-400 hover:text-black"
                            aria-label="Close"
                        >
                            ×
                        </button>

                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-2xl">
                            ⚠️
                        </div>

                        <h3 className="mt-5 text-xl font-bold text-slate-900">
                            Website Temporarily Unavailable
                        </h3>

                        <p className="mt-3 text-sm leading-6 text-slate-500">
                            The ULKA Store is currently unavailable.
                            Please try again later.
                        </p>

                        <button
                            onClick={() => setShowPopup(false)}
                            className="mt-6 rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
                        >
                            Close
                        </button>
                    </motion.div>
                </div>
            )}
        </main>
    );
};

export default TechnologyPage;
