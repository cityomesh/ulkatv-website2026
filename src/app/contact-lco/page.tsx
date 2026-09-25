// app/contact-lco/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Phone,
  Mail,
  MapPin,
  User,
  Building2,
  ArrowLeft,
  AlertCircle,
  MessageCircle,
  Copy,
  Check,
  Sparkles,
  ChevronRight,
  Shield,
} from "lucide-react";
import UserHeader from "../../components/UserHeader";

interface OperatorDetails {
  id: number;
  name: string;
  code?: string;
  contact_person?: string;
  email?: string;
  mobile_no?: string;
  phone_no?: string;
  addr?: string;
  addr1?: string;
  addr2?: string;
  addr3?: string;
  pincode?: string;
  city_lbl?: string;
  district_lbl?: string;
  state_lbl?: string;
  helpline_number?: string;
  status_lbl?: string;
  type_lbl?: string;
}

export default function ContactLcoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [lco, setLco] = useState<OperatorDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [loadingMsg, setLoadingMsg] = useState("Connecting to server...");

  // ==================================================
  // LOADING MESSAGE ROTATION
  // ==================================================
  useEffect(() => {
    if (!loading) return;

    const messages = [
      "Connecting to server...",
      "Fetching operator details...",
      "Loading contact info...",
      "Almost there...",
    ];

    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % messages.length;
      setLoadingMsg(messages[i]);
    }, 2200);

    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("access_token");
      const subscriberId = localStorage.getItem("subscriberId");

      if (!token) {
        setError("You are not logged in.");
        setLoading(false);
        return;
      }
      if (!subscriberId) {
        setError("Subscriber ID missing. Please log in again.");
        setLoading(false);
        return;
      }

      // ✅ Step 1: Load from cache instantly
      const cachedOperator: OperatorDetails = {
        id: Number(localStorage.getItem("operatorId") || 0),
        name: localStorage.getItem("lcoOperator") || "",
        code: localStorage.getItem("lcoCode") || "",
        contact_person: localStorage.getItem("lcoName") || "",
        email: localStorage.getItem("lcoEmail") || "",
        mobile_no: localStorage.getItem("lcoPhone") || "",
        addr: localStorage.getItem("lcoAddress") || "",
        city_lbl: localStorage.getItem("lcoCity") || "",
        district_lbl: localStorage.getItem("lcoDistrict") || "",
        state_lbl: localStorage.getItem("lcoState") || "",
        type_lbl: "LCO",
        status_lbl: "Active",
      };

      if (
        cachedOperator.name ||
        cachedOperator.mobile_no ||
        cachedOperator.email
      ) {
        setLco(cachedOperator);
        setLoading(false);
      }

      // ✅ Step 2: Fetch fresh profile data
      try {
        setError(null);
        const res = await fetch(
          `/api/profile?subscriber_id=${subscriberId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        console.log("[Contact LCO] Profile Response:", data);

        if (!res.ok || !data.success || !data.data) {
          throw new Error(
            (typeof data.message === "string" && data.message) ||
              "Failed to load LCO details."
          );
        }

        const profile = data.data.profile;
        const sub = profile?.sublocation_details;

        if (!profile) {
          throw new Error("Profile data missing.");
        }

        const dynamicLco: OperatorDetails = {
          id: sub?.operator_id || 0,
          name: profile.operator || sub?.operator_lbl || "LCO",
          code: profile.operator_code || sub?.operator_code_lbl || "",
          contact_person: profile.name || "",
          email: profile.email || sub?.email || "",
          mobile_no: profile.operator_contactno || sub?.mobile_no || "",
          addr: sub?.address || "",
          city_lbl: sub?.city_lbl || "",
          district_lbl: sub?.district_lbl || "",
          state_lbl: sub?.state_lbl || "",
          pincode: profile.pincode || "",
          type_lbl: "LCO",
          status_lbl: sub?.status === 1 ? "Active" : "Inactive",
        };

        setLco(dynamicLco);

        localStorage.setItem("lcoOperator", dynamicLco.name);
        localStorage.setItem("lcoCode", dynamicLco.code || "");
        localStorage.setItem("lcoName", dynamicLco.contact_person || "");
        localStorage.setItem("lcoEmail", dynamicLco.email || "");
        localStorage.setItem("lcoPhone", dynamicLco.mobile_no || "");
        localStorage.setItem("lcoAddress", dynamicLco.addr || "");
        localStorage.setItem("lcoCity", dynamicLco.city_lbl || "");
        localStorage.setItem("lcoDistrict", dynamicLco.district_lbl || "");
        localStorage.setItem("lcoState", dynamicLco.state_lbl || "");
        if (sub?.operator_id) {
          localStorage.setItem("operatorId", String(sub.operator_id));
        }
      } catch (err) {
        console.error(err);
        if (!cachedOperator.name) {
          setError(
            err instanceof Error ? err.message : "Something went wrong."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // Helpers
  const getFullAddress = (o: OperatorDetails) => {
    const parts = [
      o.addr1 || o.addr,
      o.addr2,
      o.addr3,
      o.city_lbl,
      o.district_lbl,
      o.state_lbl,
      o.pincode,
    ].filter((p) => p && String(p).trim() !== "");
    return parts.length > 0 ? parts.join(", ") : "Address not available";
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  // ────────────────────────────────────────────────
  return (
    <>
      <UserHeader />

      {/* ═══════════ FULL-SCREEN LOADING OVERLAY ═══════════ */}
      {loading && !lco && (
        <div className="fixed inset-0 z-[60] bg-white/95 backdrop-blur-md flex items-center justify-center">
          <div className="flex flex-col items-center max-w-sm w-full px-6">
            <div className="relative mb-8">
              <div className="w-24 h-24 rounded-full border-4 border-red-100" />
              <div className="absolute inset-0 w-24 h-24 rounded-full border-4 border-transparent border-t-red-600 border-r-red-600 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
                  <Phone className="w-7 h-7 text-red-600 animate-pulse" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <h2 className="text-lg font-black text-gray-900">
                Loading Operator
              </h2>
            </div>

            <p className="text-sm text-gray-500 font-medium text-center min-h-[20px]">
              {loadingMsg}
            </p>

            <div className="flex items-center gap-1.5 mt-5">
              <span
                className="w-2 h-2 rounded-full bg-red-600 animate-bounce"
                style={{ animationDelay: "0ms" }}
              />
              <span
                className="w-2 h-2 rounded-full bg-red-500 animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <span
                className="w-2 h-2 rounded-full bg-red-400 animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
            </div>

            <div className="mt-6 w-full h-1 bg-red-100 rounded-full overflow-hidden">
              <div className="h-full w-1/3 bg-gradient-to-r from-red-600 to-red-400 rounded-full animate-[progressSlide_1.4s_ease-in-out_infinite]" />
            </div>
          </div>

          <style jsx>{`
            @keyframes progressSlide {
              0% {
                transform: translateX(-100%);
              }
              100% {
                transform: translateX(400%);
              }
            }
          `}</style>
        </div>
      )}

      <div className="min-h-screen bg-white text-gray-900 pb-16">
        <div className="max-w-3xl mx-auto px-4 md:px-8 pt-24">
          {/* ═══════════ BACK BUTTON ═══════════ */}
          <button
            onClick={() => router.back()}
            className="group flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-red-600 mb-4 transition-colors"
          >
            <span className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-red-600 flex items-center justify-center transition-colors">
              <ArrowLeft
                size={16}
                className="text-gray-600 group-hover:text-white transition-colors group-hover:-translate-x-0.5 duration-300"
              />
            </span>
            Back to Dashboard
          </button>

          {/* ═══════════ HERO HEADER ═══════════ */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-sm shadow-red-200">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-widest text-red-600">
                Support
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
              Contact Your <span className="text-red-600">LCO</span>
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              For complaints, queries &amp; assistance
            </p>
          </div>

          {/* ═══════════ ERROR ═══════════ */}
          {!loading && error && !lco && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-red-700 text-sm flex items-start gap-3">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <div>
                <p className="font-bold mb-1">Failed to load details</p>
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          )}

          {/* ═══════════ CONTENT ═══════════ */}
          {lco && (
            <div className="space-y-4">
              {/* ▓▓▓ LCO HERO PANEL ▓▓▓ */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 p-6 text-white shadow-xl">
                <div className="absolute top-0 right-0 w-40 h-40 bg-red-500/20 rounded-full blur-3xl -mr-12 -mt-12" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-red-600/10 rounded-full blur-3xl -ml-12 -mb-12" />

                <div className="relative">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 to-red-500 flex items-center justify-center shadow-lg shadow-red-900/50 shrink-0">
                      <Building2 size={30} className="text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] uppercase tracking-widest text-red-400 font-bold">
                          {lco.type_lbl || "Cable Operator"}
                        </span>
                        {lco.status_lbl && (
                          <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            {lco.status_lbl}
                          </span>
                        )}
                      </div>
                      <h2 className="text-xl md:text-2xl font-black text-white truncate">
                        {lco.name || "Cable Operator"}
                      </h2>
                      {lco.code && (
                        <p className="text-[11px] text-gray-400 font-mono mt-1">
                          Code: {lco.code}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-4">
                    {lco.contact_person && (
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                          <User size={16} className="text-red-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] text-white/50 uppercase tracking-widest font-bold">
                            Contact Person
                          </p>
                          <p className="text-sm font-bold text-white truncate">
                            {lco.contact_person}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ▓▓▓ CONTACT ACTIONS ▓▓▓ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {lco.mobile_no && (
                  <a
                    href={`tel:${lco.mobile_no}`}
                    className="group relative bg-white border border-gray-100 hover:border-red-300 hover:bg-black rounded-2xl p-4 flex items-center gap-3 transition-all duration-300 overflow-hidden hover:shadow-lg hover:shadow-red-100"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-600 scale-y-0 group-hover:scale-y-100 origin-center transition-transform duration-300" />

                    <div className="w-11 h-11 rounded-xl bg-red-50 group-hover:bg-red-600 flex items-center justify-center shrink-0 transition-colors duration-300">
                      <Phone
                        size={18}
                        className="text-red-600 group-hover:text-white transition-colors duration-300"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] text-gray-400 group-hover:text-gray-500 uppercase tracking-widest font-bold">
                        Call
                      </p>
                      <p className="text-sm font-bold text-gray-900 group-hover:text-white truncate transition-colors duration-300">
                        {lco.mobile_no}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleCopy(lco.mobile_no!, "phone");
                      }}
                      className="shrink-0 p-2 rounded-full text-gray-400 hover:bg-red-100 group-hover:text-red-400 transition-colors"
                      title="Copy"
                    >
                      {copied === "phone" ? (
                        <Check size={14} className="text-emerald-500" />
                      ) : (
                        <Copy size={14} />
                      )}
                    </button>
                  </a>
                )}

                {lco.email && (
                  <a
                    href={`mailto:${lco.email}`}
                    className="group relative bg-white border border-gray-100 hover:border-red-300 hover:bg-black rounded-2xl p-4 flex items-center gap-3 transition-all duration-300 overflow-hidden hover:shadow-lg hover:shadow-red-100"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-600 scale-y-0 group-hover:scale-y-100 origin-center transition-transform duration-300" />

                    <div className="w-11 h-11 rounded-xl bg-red-50 group-hover:bg-red-600 flex items-center justify-center shrink-0 transition-colors duration-300">
                      <Mail
                        size={18}
                        className="text-red-600 group-hover:text-white transition-colors duration-300"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] text-gray-400 group-hover:text-gray-500 uppercase tracking-widest font-bold">
                        Email
                      </p>
                      <p className="text-sm font-bold text-gray-900 group-hover:text-white truncate transition-colors duration-300">
                        {lco.email}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleCopy(lco.email!, "email");
                      }}
                      className="shrink-0 p-2 rounded-full text-gray-400 hover:bg-red-100 group-hover:text-red-400 transition-colors"
                      title="Copy"
                    >
                      {copied === "email" ? (
                        <Check size={14} className="text-emerald-500" />
                      ) : (
                        <Copy size={14} />
                      )}
                    </button>
                  </a>
                )}
              </div>

              {/* ▓▓▓ ADDRESS CARD ▓▓▓ */}
              <div className="group bg-white border border-gray-100 hover:border-red-200 rounded-2xl p-5 transition-all duration-300 hover:shadow-lg hover:shadow-red-50">
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-red-50 group-hover:bg-red-600 flex items-center justify-center shrink-0 transition-colors duration-300">
                    <MapPin
                      size={20}
                      className="text-red-600 group-hover:text-white transition-colors duration-300"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-1">
                      Office Address
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed font-medium">
                      {getFullAddress(lco)}
                    </p>
                  </div>
                </div>
              </div>

              {/* ▓▓▓ WHATSAPP CTA ▓▓▓ */}
              {lco.mobile_no && (
                <a
                  href={`https://wa.me/91${lco.mobile_no.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold py-4 px-5 rounded-2xl transition-all shadow-lg shadow-red-200 hover:shadow-red-300 hover:scale-[1.01]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                      <MessageCircle size={18} />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-black">
                        Message on WhatsApp
                      </p>
                      <p className="text-[11px] text-white/80 font-medium">
                        Quick chat with your operator
                      </p>
                    </div>
                  </div>
                  <ChevronRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </a>
              )}

              {/* ▓▓▓ INFO NOTE ▓▓▓ */}
              <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center shrink-0">
                  <Shield size={14} className="text-white" />
                </div>
                <p className="text-[11px] text-gray-600 leading-relaxed font-medium pt-1">
                  Contact your Cable Operator for any service complaints,
                  signal issues, or assistance with your subscription.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
