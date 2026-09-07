"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FAQItem {
    id: string;
    question: string;
    answer: string;
}

const faqData: FAQItem[] = [
    {
        id: "q1",
        question: "No signal on the HDTV",
        answer: "Check if the HDMI cable is securely connected. Check if you have selected the correct HDMI input on your HDTV.",
    },
    {
        id: "q2",
        question: "Cannot turn on your ULKA TV smart box",
        answer: "Make sure the power adapter is properly plugged into both the smart box and a working power outlet. Try using a different power outlet or checking the power cable for damage.",
    },
    {
        id: "q3",
        question: "Cannot connect to network",
        answer: "Check your internet connection. Ensure your Wi-Fi password is correct. Restart your router and try reconnecting. If using Ethernet, verify the cable is securely connected.",
    },
    {
        id: "q4",
        question: "Login issues with ULKA apps",
        answer: "Verify your username and password. If you've forgotten your password, use the 'Forgot Password' option. Clear the app cache or reinstall the app if the problem persists.",
    },
];

const FAQ = () => {
    const [activeId, setActiveId] = useState<string | null>("q1");

    const toggle = (id: string) => {
        setActiveId(activeId === id ? null : id);
    };

    return (
        <section className="relative overflow-hidden bg-white py-20 md:py-28">
            {/* Decorative elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -left-40 top-1/2 h-[600px] w-[600px] -translate-y-1/2 rounded-full bg-red-50/30 blur-3xl" />
                <div className="absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-red-50/20 blur-3xl" />
            </div>

            <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-14 text-center">
                    <div className="mb-4 flex items-center justify-center gap-3">
                        <span className="h-[2px] w-9 bg-red-600" />
                        <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-red-600">
                            F.A.Q.
                        </span>
                        <span className="h-[2px] w-9 bg-red-600" />
                    </div>

                    <h2 className="text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
                        Answers
                        <span className="text-red-600"> Everywhere</span>
                    </h2>

                    <p className="mt-3 text-sm text-slate-500">
                        Quick solutions to the most common questions
                    </p>
                </div>

                {/* FAQ List */}
                <div className="space-y-3">
                    {faqData.map((item, index) => {
                        const isOpen = activeId === item.id;

                        return (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.08 }}
                                className={`
                                    group rounded-xl border transition-all duration-300
                                    ${isOpen
                                        ? 'border-red-600 bg-red-50/50 shadow-md shadow-red-100/30'
                                        : 'border-slate-200 bg-white hover:border-red-300 hover:shadow-md'
                                    }
                                `}
                            >
                                {/* Question Button */}
                                <button
                                    onClick={() => toggle(item.id)}
                                    className="flex w-full items-center gap-4 px-6 py-5 text-left"
                                >
                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-600 text-xs font-bold text-white transition-colors duration-300 group-hover:bg-red-700">
                                        {String(index + 1).padStart(2, '0')}
                                    </span>

                                    <span className="flex-1 text-sm font-semibold text-slate-800 md:text-base">
                                        {item.question}
                                    </span>

                                    <span
                                        className={`
                                            flex h-8 w-8 shrink-0 items-center justify-center
                                            rounded-full transition-all duration-300
                                            ${isOpen
                                                ? 'bg-red-600 text-white rotate-180'
                                                : 'bg-slate-100 text-slate-500 group-hover:bg-red-100 group-hover:text-red-600'
                                            }
                                        `}
                                    >
                                        <svg
                                            className="h-4 w-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 9l-7 7-7-7"
                                            />
                                        </svg>
                                    </span>
                                </button>

                                {/* Answer — expand/collapse */}
                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                            className="overflow-hidden"
                                        >
                                            <div className="border-t border-red-100 px-6 py-5">
                                                <p className="text-sm leading-relaxed text-slate-600 md:text-base">
                                                    {item.answer}
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Footer CTA */}
                <div className="mt-12 text-center">
                    <p className="text-sm text-slate-500">
                        Still have questions?{" "}
                        <a
                            href="#"
                            className="font-semibold text-red-600 transition-colors hover:text-red-700 hover:underline"
                        >
                            Contact Support
                        </a>
                    </p>
                </div>

            </div>
        </section>
    );
};

export default FAQ;
