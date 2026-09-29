// src/app/terms/page.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";

interface TermsSection {
  id: string;
  number: string;
  title: string;
  content: string | string[];
  isList?: boolean;
}

const termsData: TermsSection[] = [
  {
    id: "t1",
    number: "01",
    title: "Introduction",
    content: [
      "These Terms and Conditions shall apply to Your use of the Website located at www.ulka.TV (\"ULKA TV\"). By accessing the ULKA TV Site You hereby agree to be bound by the terms and conditions set out below. If You do not wish to be bound by these terms and conditions, please do not access the ULKA TV Site.",
      "We reserve the right to add or change/modify the site, site content terms and conditions at any point of time without prior notice to You. Any changes will be posted to www.ulka.tv and it is your responsibility as a user to refer to the terms and conditions on accessing this service. Such modifications and changes shall be effective immediately upon posting of the modifications, alterations or changes. You agree to review the site periodically to be aware of such modifications and on Your access to the ULKA TV Site it will be deemed an acceptance of the terms existing at that time. You also understand and agree that the Service may include certain communications from ULKA TV such as service announcements, administrative messages and the ULKA TV Newsletter, and that these communications are considered part of ULKA TV membership and you will not be able to opt out of receiving them.",
    ],
  },
  {
    id: "t2",
    number: "02",
    title: "Definitions",
    content: [
      "\"You\" means You, the User of the ULKA TV Site and \"Your\" shall be interpreted accordingly.",
      "\"We/Us\" means ULKA TV, Ucast Media Pvt Ltd, Corporate office at 709, 7th Floor, Aditya Trade Center, Ameerpet, Hyderabad, Telangana 500038, India and \"Our\" shall be interpreted accordingly.",
      "\"ULKA TV\" shall have the meaning as set out above.",
      "\"User Information\" means the personal details, which may be provided by You to Us via the ULKA TV Site.",
      "\"Users\" means the Users of the ULKA TV Site collectively and/or individually as the context admits.",
      "\"Website\" means a URL on the World Wide Web.",
    ],
    isList: true,
  },
  {
    id: "t3",
    number: "03",
    title: "Trademarks and Copyright",
    content: [
      "This site contains copyrights and intellectual property rights in all material or content supplied or presented on this site (including but not limited to text, audio, video, graphical images), trademarks and logos (including trademark \"ULKA TV\") of Ucast Media Pvt Ltd, its parent, affiliates and associates and are protected under the applicable Indian laws. You are permitted to use this material or content only as expressly authorized in writing by Us. Unless expressly permitted in writing You will not assist or facilitate any third party to copy, reproduce, transmit, distribute, frame, republish, upload, edit, publicly display, link, create derivative works of such material or content, commercially exploit in whole or in part the site, content or site code or otherwise use the site, site content on any other website. Any infringement of the IPR will be considered illegal and shall be vigorously defended and pursued to the fullest extent permitted by law. You agree to notify to Us if you become aware or suspect any such distribution or commercial exploitation. You acknowledge that by posting Your information on the ULKA TV Site You grant to Us an irrevocable license to use the details both within the ULKA TV Site and in any other manner required. The license extends to copying, distributing, broadcasting and otherwise transmitting, adapting and editing the materials. Our ULKA TV website and application will be using the Brand names, logos and other trademarks of other reputed companies and using those works will be as per their terms.",
    ],
  },
  {
    id: "t4",
    number: "04",
    title: "Privacy",
    content: [
      "You may be asked to input certain information about Yourself on different pages of the ULKA TV Site. We will not use the information provided to Us for any purpose that is not set out in Our Privacy Policy, other than as stated where such information is required.",
    ],
  },
  {
    id: "t5",
    number: "05",
    title: "Termination",
    content: [
      "You agree that ULKA TV may at its sole discretion and at any time terminate Your password, user account or use of any service. ULKA TV may at its sole discretion discontinue any site or service or limit or restrict any user access. It has been understood by You that ULKA TV shall not have any liability to you or any other person for any termination of Your access to Our service or removal of information concerning Your account.",
    ],
  },
  {
    id: "t6",
    number: "06",
    title: "Severability",
    content: [
      "If any provision of the terms and condition shall be held unlawful, void or for any reason unenforceable, then that provision shall be deemed severable from these terms and conditions and shall not effect the validity and enforceability of the remaining provisions.",
    ],
  },
  {
    id: "t7",
    number: "07",
    title: "Registration & Acceptance",
    content: [
      "In consideration of Your use of this site you represent that you are of legal age to form a binding contract and are not a person barred from receiving services under the laws of India or other applicable Jurisdiction. You agree to comply with the rules and provide accurate, reliable, complete and true information about Yourself as required by Us for registration to this service and to create Your User Account. You agree to update Your registration information with current information. ULKA TV at its sole discretion can suspend or terminate the User Account or even permanently ban You from having any current or future service from this site in the event You provide inaccurate, false registration information.",
      "As a part of registration you are responsible for creating and maintaining confidentiality of Your user name and password. You are advised to notify ULKA TV of any unauthorized use of Your Account. ULKA TV shall not be liable for any loss or damage arising from Your usage of Your User Account.",
    ],
  },
  {
    id: "t8",
    number: "08",
    title: "Offer Packs",
    content: [
      "All Offer packs are for limited period only and ULKA TV reserves the rights to change/revise the prices, alter the packs and composition of packs, subject to change in regulation/broadcaster price.",
      "ULKA TV Partners may charge additional NCF from end customer, according to the market conditions.",
      "Once customer is activated in the scheme, it cannot be cancelled, refunded, transferred or cut short on the tenure.",
    ],
    isList: true,
  },
  {
    id: "t9",
    number: "09",
    title: "Set-Top-Box",
    content: [
      "ULKA TV is not responsible for issues arising out of bandwidth, network related blackouts and in this scenario pack cannot be extended/provide any grace period for the pack. It strictly expires by the period. ULKA TV Partners should take care of such issues independently.",
      "In case of STB failures in the event of power surges/STB tampering, the consumer is liable to buy the STB to continue till end of scheme period.",
      "In case of STB malfunctions due to manufacturing defect, the STBs will be replaced on FOC basis, however, it will be scrutinized by ULKA TV team and STB vendor to pass on the warranty credit, meanwhile distributor can pass on the standby/demo STB to customer.",
      "All other general terms & conditions shall be applicable.",
    ],
  },
];

const TermsPage = () => {
  return (
    <>
      <section className="relative overflow-hidden bg-white pt-32 pb-20 md:pt-40 md:pb-28">
        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -left-40 top-1/3 h-[600px] w-[600px] -translate-y-1/2 rounded-full bg-red-50/30 blur-3xl" />
          <div className="absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-red-50/20 blur-3xl" />
          <div className="absolute bottom-0 left-1/4 h-[300px] w-[300px] rounded-full bg-red-50/20 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-14 text-center">

            <h1 className="text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
              Terms &amp;
              <span className="text-red-600"> Conditions</span>
            </h1>

            <p className="mt-4 text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
              Please read these terms carefully before using the ULKA TV
              website and services. By accessing our platform, you agree to be
              bound by the terms outlined below.
            </p>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50/60 px-4 py-1.5">
              <svg
                className="h-3.5 w-3.5 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-red-700">
                Last updated: {new Date().toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>

          {/* Category Header */}
          <div className="mb-6">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              Agreement Overview
            </h2>
            <div className="mt-2 h-[2px] w-12 bg-red-600" />
          </div>

          {/* Terms List */}
          <div className="space-y-3">
            {termsData.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                className="
                  group rounded-xl border border-slate-200 bg-white
                  p-6 transition-all duration-300
                  hover:border-red-300 hover:shadow-md
                "
              >
                {/* Header Row */}
                <div className="flex items-start gap-4 mb-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-600 text-xs font-bold text-white transition-colors duration-300 group-hover:bg-red-700">
                    {section.number}
                  </span>

                  <h3 className="flex-1 text-base font-bold text-slate-900 md:text-lg pt-1">
                    {section.title}
                  </h3>
                </div>

                {/* Content */}
                <div className="pl-0 md:pl-13">
                  {section.isList ? (
                    <ul className="space-y-3">
                      {Array.isArray(section.content) &&
                        section.content.map((item, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-3 text-sm leading-relaxed text-slate-600"
                          >
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                            <span>{item}</span>
                          </li>
                        ))}
                    </ul>
                  ) : (
                    <div className="space-y-3">
                      {Array.isArray(section.content) ? (
                        section.content.map((para, i) => (
                          <p
                            key={i}
                            className="text-sm leading-relaxed text-slate-600 md:text-[15px]"
                          >
                            {para}
                          </p>
                        ))
                      ) : (
                        <p className="text-sm leading-relaxed text-slate-600 md:text-[15px]">
                          {section.content}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact Block */}
          <div className="mt-10 rounded-xl border border-red-100 bg-red-50/40 p-6 md:p-7">
            <div className="flex items-start gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-600">
                <svg
                  className="h-5 w-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </span>

              <div className="flex-1">
                <h4 className="text-sm font-bold uppercase tracking-widest text-red-700 mb-2">
                  Corporate Office
                </h4>
                <p className="text-sm leading-relaxed text-slate-700">
                  <span className="font-semibold text-slate-900">
                    ULKA TV · Ucast Media Pvt Ltd
                  </span>
                  <br />
                  709, 7th Floor, Aditya Trade Center
                  <br />
                  Ameerpet, Hyderabad
                  <br />
                  Telangana 500038, India
                </p>
              </div>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="mt-10 text-center">
            <p className="text-sm text-slate-500">
              Have questions about our terms?{" "}
              <a
                href="/contact-lco"
                className="font-semibold text-red-600 transition-colors hover:text-red-700 hover:underline"
              >
                Contact Us
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default TermsPage;
