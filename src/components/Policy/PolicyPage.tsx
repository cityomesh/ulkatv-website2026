// src/app/privacy/page.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";

interface PolicySection {
  id: string;
  number: string;
  title: string;
  content: string[];
  isList?: boolean;
  listItems?: string[];
}

const policyData: PolicySection[] = [
  {
    id: "p1",
    number: "01",
    title: "Introduction",
    content: [
      "This page is used to inform visitors regarding ULKA TV policies with the collection, use, and disclosure of Personal Information if anyone decided to use our Services.",
      "If you choose to use our Service, then you agree to the collection and use of information in relation to this policy. The Personal Information that We at ULKA TV collect is used for providing and improving the Service. We will not use or share your information with anyone except as described in this Privacy Policy.",
      "The terms used in this Privacy Policy have the same meanings as in our Terms and Conditions, which is accessible at ULKA TV unless otherwise defined in this Privacy Policy.",
    ],
  },
  {
    id: "p2",
    number: "02",
    title: "Information Collection and Use",
    content: [
      "For a better experience, while using our Service, We at ULKA TV may require you to provide us with certain personally identifiable information. The information that We at ULKA TV request will be retained on your device and is not collected by us in any other way.",
      "The app does use third-party services that may collect information used to identify you:",
    ],
    listItems: ["Google Play Services", "Firebase Analytics", "Crashlytics"],
  },
  {
    id: "p3",
    number: "03",
    title: "Log Data",
    content: [
      "We at ULKA TV want to inform you that whenever you use our Service, in the case of an error in the app, we collect data and information (through third-party products) on your device called Log Data. This Log Data may include information such as your device Internet Protocol (IP) address, device name, operating system version, the configuration of the app when utilizing our Service, the time and date of your use of the Service, and other statistics.",
    ],
  },
  {
    id: "p4",
    number: "04",
    title: "Cookies",
    content: [
      "Cookies are files with a small amount of data that are commonly used as anonymous unique identifiers. These are sent to your browser from the websites that you visit and are stored on your device's internal memory.",
      "This Service does not use these \"cookies\" explicitly. However, the app may use third party code and libraries that use \"cookies\" to collect information and improve their services. You have the option to either accept or refuse these cookies and know when a cookie is being sent to your device. If you choose to refuse our cookies, you may not be able to use some portions of this Service.",
    ],
  },
  {
    id: "p5",
    number: "05",
    title: "Service Providers",
    content: [
      "ULKA TV may employ third-party companies and individuals due to the following reasons:",
    ],
    listItems: [
      "To facilitate our Service;",
      "To provide the Service on our behalf;",
      "To perform Service-related services; or",
      "To assist us in analyzing how our Service is used.",
      "We want to inform users of this Service that these third parties have access to your Personal Information. The reason is to perform the tasks assigned to them on our behalf. However, they are obligated not to disclose or use the information for any other purpose.",
    ],
  },
  {
    id: "p6",
    number: "06",
    title: "Security",
    content: [
      "We at ULKA TV value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it. But remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, and We at ULKA TV cannot guarantee its absolute security.",
    ],
  },
  {
    id: "p7",
    number: "07",
    title: "Links to Other Sites",
    content: [
      "This Service may contain links to other sites. If you click on a third-party link, you will be directed to that site. Note that these external sites are not operated by ULKA TV. Therefore, I strongly advise you to review the Privacy Policy of these websites. We at ULKA TV have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.",
    ],
  },
  {
    id: "p8",
    number: "08",
    title: "Children's Privacy",
    content: [
      "These Services do not address anyone under the age of 7. We at ULKA TV do not knowingly collect personally identifiable information from children under 7. In the case we at ULKA TV discover that a child under 13 has provided ULKA TV with personal information, we immediately delete the data from our servers. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us so that we will be able to do necessary actions.",
    ],
  },
  {
    id: "p9",
    number: "09",
    title: "Changes to This Privacy Policy",
    content: [
      "We at ULKA TV may update our Privacy Policy from time to time. Thus, you are advised to review this page periodically for any changes. We will be notifying you of any changes by posting the new Privacy Policy on this page. These changes are effective immediately after they are posted on this page.",
    ],
  },
];

const PrivacyPage = () => {
  return (
    <>
      <section className="relative overflow-hidden bg-white pt-32 pb-20 md:pt-40 md:pb-28">
        {/* Decorative blurred circles */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -left-40 top-1/3 h-[600px] w-[600px] -translate-y-1/2 rounded-full bg-red-50/30 blur-3xl" />
          <div className="absolute right-0 top-0 h-[400px] w-[400px] rounded-full bg-red-50/20 blur-3xl" />
          <div className="absolute bottom-0 left-1/4 h-[300px] w-[300px] rounded-full bg-red-50/20 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-14 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
              Privacy
              <span className="text-red-600"> Policy</span>
            </h1>

            <p className="mt-4 text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
              Your privacy matters to us. Learn how ULKA TV collects, uses,
              and protects your personal information when you use our
              services.
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
                Last updated:{" "}
                {new Date().toLocaleDateString("en-IN", {
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
              What You Should Know
            </h2>
            <div className="mt-2 h-[2px] w-12 bg-red-600" />
          </div>

          {/* Policy List */}
          <div className="space-y-3">
            {policyData.map((section, index) => (
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
                  <div className="space-y-3">
                    {section.content.map((para, i) => (
                      <p
                        key={i}
                        className="text-sm leading-relaxed text-slate-600 md:text-[15px]"
                      >
                        {para}
                      </p>
                    ))}
                  </div>

                  {/* List items (if any) */}
                  {section.listItems &&
                    section.listItems.length > 0 && (
                      <ul className="space-y-3 mt-4">
                        {section.listItems.map((item, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-3 text-sm leading-relaxed text-slate-600 md:text-[15px]"
                          >
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
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
                  Questions About Privacy?
                </h4>
                <p className="text-sm leading-relaxed text-slate-700 mb-3">
                  If you have any questions or suggestions about our Privacy
                  Policy, do not hesitate to contact us.
                </p>
                <a
                  href="mailto:privacy@ulka.tv"
                  className="inline-flex items-center gap-2 text-sm font-bold text-red-600 hover:text-red-700 hover:underline transition-colors"
                >
                  privacy@ulka.tv
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
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="mt-10 text-center">
            <p className="text-sm text-slate-500">
              Read our{" "}
              <a
                href="/terms"
                className="font-semibold text-red-600 transition-colors hover:text-red-700 hover:underline"
              >
                Terms &amp; Conditions
              </a>{" "}
              as well.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default PrivacyPage;
