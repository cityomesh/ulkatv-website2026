// SmartTvPage.tsx
"use client";
import React from "react";
import Image from "next/image";
import { Carousel } from "react-responsive-carousel";
import { motion } from "framer-motion";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const SmartTvPage: React.FC = () => {
    const images = [
        { src: "/ulkatv_home1.png", alt: "Smart TV" },
        { src: "/google_tv.png", alt: "Smart TV" },
        { src: "/firestick.png", alt: "Smart TV" },
        { src: "/samsung.png", alt: "Smart TV" },
        { src: "/ulkatv_setopbox.png", alt: "Smart TV" },
    ];

    const text = {
        title: "Ulka Smart TV App for connected smart televisions. Ulka Lite is available in Android, Fire TV, Samsung and LG Apps Stores.",
        mobileAppText: "My Ulka App for Subscription Management and on-demand subscription of addon packs or a-la-carte channels. This app is available on Android and i-Phone Mobile App Stores.",
        footerText: "Ulka STB's and Sticks provide live tv channels and also supports popular OTT Apps for upgrading older tvs to smart tvs.",
    };

    const platforms = [
        { name: "Android TV", src: "/ulkatv_home1.png" },
        { name: "Google TV", src: "/google_tv.png" },
        { name: "Fire TV", src: "/firetv.png" },
        { name: "Fire Stick", src: "/firestick.png" },
        { name: "Samsung TV", src: "/samsung.png" },
        { name: "Set-Top-Box", src: "/ulkatv_setopbox.png" },
    ];

    const contentSections = [
        { src: "/old-tv.png", alt: "Old TV", label: "Traditional TV" },
        { src: "/digitalTV.png", alt: "Digital TV", label: "Digital TV" },
        { src: "/Smart_TV.png", alt: "Smart TV", label: "Smart TV" },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 pt-24 pb-12">

            {/* ===== HEADER ===== */}
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-10"
            >
                Future of Television in India
            </motion.h1>

            {/* ===== TV EVOLUTION ROW ===== */}
            <div className="flex flex-col lg:flex-row items-center justify-center gap-6 mb-10 w-full max-w-6xl">
                {contentSections.map((section, index) => (
                    <React.Fragment key={index}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.15 }}
                            className="flex flex-col items-center bg-white rounded-2xl shadow-md p-4 w-full max-w-xs"
                        >
                            <div className="relative w-full h-48 flex items-center justify-center bg-gray-100 rounded-xl overflow-hidden">
                                <Image
                                    src={section.src}
                                    alt={section.alt}
                                    width={280}
                                    height={200}
                                    className="object-contain w-full h-full p-2"
                                    style={{ objectFit: "contain" }}
                                />
                            </div>
                            <p className="text-sm font-semibold text-gray-600 mt-2">{section.label}</p>
                        </motion.div>
                        {index < contentSections.length - 1 && (
                            <div className="hidden lg:block text-4xl font-light text-blue-600">→</div>
                        )}
                    </React.Fragment>
                ))}
            </div>

            {/* ===== STATS / INFO CARDS ===== */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-6xl mb-10">
                {[
                    "The Television sets are being upgraded at a very fast pace.",
                    "4K Smart TVs are common today and the traditional Set-top-Boxes are unable to upgrade to the standards of 4K Televisions.",
                    "Smart TV share of new Television sales is more then 95%.",
                    "UlkaTV 4K compatible distribution system has TRAI approved Virtual STB Application for Smart TVs and Smart Phones.",
                ].map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ x: "-100vw" }}
                        animate={{ x: 0 }}
                        transition={{
                            duration: 1.2,
                            type: "spring",
                            stiffness: 60,
                            delay: index * 0.2,
                        }}
                        className={`p-4 rounded-xl shadow-sm border ${
                            index === 3
                                ? "border-blue-200 bg-gradient-to-br from-blue-50 to-red-50"
                                : "border-gray-200 bg-white hover:shadow-md transition-shadow"
                        }`}
                    >
                        <p className="text-sm text-gray-700 leading-relaxed">{item}</p>
                    </motion.div>
                ))}
            </div>

            {/* ===== PLATFORMS SECTION ===== */}
            <div className="w-full max-w-6xl bg-[#0a0f2c] rounded-2xl p-6 mb-10">
                <h2 className="text-xl font-semibold text-center text-white mb-6">
                    Ulka Lite is available in Android, Fire TV, Samsung and LG Apps Stores
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {platforms.map((platform, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ y: -4, scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                            className="bg-white rounded-xl p-3 flex flex-col items-center shadow-md"
                        >
                            <div className="w-full h-28 flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
                                <Image
                                    src={platform.src}
                                    alt={platform.name}
                                    width={120}
                                    height={100}
                                    className="object-contain w-full h-full p-1"
                                    style={{ objectFit: "contain" }}
                                />
                            </div>
                            <p className="text-xs font-medium text-gray-700 mt-2 text-center leading-tight">
                                {platform.name}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* ===== CAROUSEL + TEXT SIDE-BY-SIDE ===== */}
            <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

                {/* Carousel */}
                <div className="bg-white rounded-2xl shadow-lg p-4">
                    <Carousel
                        showThumbs={false}        // ✅ Warning fix
                        showStatus={false}        // ✅ Bottom "1 of 5" strip తీసేయడానికి
                        showIndicators={true}     // ✅ Bottom dots
                        autoPlay
                        infiniteLoop
                        interval={1200}
                        swipeable
                        emulateTouch
                        className="rounded-xl overflow-hidden"
                    >
                        {images.map((image, index) => (
                            <div key={index} className="flex items-center justify-center h-64">
                                <Image
                                    src={image.src}
                                    alt={image.alt}
                                    width={400}
                                    height={300}
                                    className="object-contain w-full h-full p-2"
                                    style={{ objectFit: "contain" }}
                                />
                            </div>
                        ))}
                    </Carousel>
                </div>

                {/* Info Blocks */}
                <div className="flex flex-col gap-4">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        className="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-4 shadow-sm"
                    >
                        <p className="text-sm text-gray-700 leading-relaxed">
                            {text.title.split("Ulka Smart TV")[0]}
                            <span className="font-bold text-blue-700">Ulka Smart TV</span>
                            {text.title.split("Ulka Smart TV")[1]}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.25 }}
                        className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-4 shadow-sm"
                    >
                        <p className="text-sm text-gray-700 leading-relaxed">
                            {text.mobileAppText.split("My Ulka App")[0]}
                            <span className="font-bold text-yellow-700">My Ulka App</span>
                            {text.mobileAppText.split("My Ulka App")[1]}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.4 }}
                        className="bg-purple-50 border-l-4 border-purple-500 rounded-lg p-4 shadow-sm"
                    >
                        <p className="text-sm text-gray-700 leading-relaxed">{text.footerText}</p>
                    </motion.div>
                </div>
            </div>

        </div>
    );
};

export default SmartTvPage;
