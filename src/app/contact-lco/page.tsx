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
  Loader2,
  AlertCircle,
  MessageCircle,
  Copy,
  Check,
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

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("access_token");
      const operatorId = localStorage.getItem("operatorId");

      if (!token) {
        setError("You are not logged in.");
        setLoading(false);
        return;
      }
      if (!operatorId) {
        setError("Operator ID missing. Please log in again.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/operator?operator_id=${operatorId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        console.log("[Contact LCO] Response:", data);

        if (!res.ok || !data.success || !data.data) {
          throw new Error(
            (typeof data.message === "string" && data.message) ||
              "Failed to load LCO details."
          );
        }
        setLco(data.data);
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error ? err.message : "Something went wrong."
        );
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

      <div className="min-h-screen bg-[#0d0d0d] text-white pt-24 pb-16 px-4 md:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Back */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-4 transition"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-yellow-500/20 p-2.5 rounded-lg">
              <Phone className="text-yellow-400" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-yellow-400">
                Contact Your LCO
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                For complaints &amp; assistance
              </p>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center gap-2 py-20 text-gray-400 text-sm">
              <Loader2 size={18} className="animate-spin" />
              Loading operator details...
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="bg-red-950 border border-red-700 rounded-lg p-5 text-red-400 text-sm flex items-start gap-3">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-1">Failed to load details</p>
                <p className="text-red-300/80">{error}</p>
              </div>
            </div>
          )}

          {/* Card */}
          {!loading && !error && lco && (
            <div className="space-y-4">
              {/* Hero Card */}
              <div className="relative bg-gradient-to-br from-[#141414] to-[#0a0a0a] border border-gray-800 rounded-xl overflow-hidden">
                {/* Top accent */}
                <div className="h-1 w-full bg-gradient-to-r from-yellow-500 via-orange-400 to-transparent" />

                {/* Hero header */}
                <div className="p-6 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-yellow-500/15 border-2 border-yellow-500/40 flex items-center justify-center shrink-0">
                    <Building2 size={28} className="text-yellow-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                      {lco.type_lbl || "LCO"}
                      {lco.status_lbl && (
                        <span className="ml-2 text-green-400">
                          ● {lco.status_lbl}
                        </span>
                      )}
                    </p>
                    <h2 className="text-xl font-bold text-white truncate mt-0.5">
                      {lco.name || "Cable Operator"}
                    </h2>
                    {lco.code && (
                      <p className="text-[11px] text-gray-500 font-mono mt-0.5">
                        Code: {lco.code}
                      </p>
                    )}
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-dashed border-gray-800" />

                {/* Contact person */}
                {lco.contact_person && (
                  <div className="p-6 pb-3 flex items-center gap-3">
                    <User size={16} className="text-gray-500 shrink-0" />
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wide">
                        Contact Person
                      </p>
                      <p className="text-sm font-semibold text-gray-200">
                        {lco.contact_person}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Contact Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Phone */}
                {lco.mobile_no && (
                  <a
                    href={`tel:${lco.mobile_no}`}
                    className="group bg-black border border-gray-800 hover:border-yellow-500/60 rounded-xl p-4 flex items-center gap-3 transition"
                  >
                    <div className="w-10 h-10 rounded-full bg-yellow-500/15 flex items-center justify-center shrink-0 group-hover:bg-yellow-500/25 transition">
                      <Phone size={18} className="text-yellow-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wide">
                        Call
                      </p>
                      <p className="text-sm font-semibold text-white truncate">
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
                      className="shrink-0 text-gray-500 hover:text-yellow-400 transition"
                      title="Copy"
                    >
                      {copied === "phone" ? (
                        <Check size={16} className="text-green-400" />
                      ) : (
                        <Copy size={16} />
                      )}
                    </button>
                  </a>
                )}

                {/* Email */}
                {lco.email && (
                  <a
                    href={`mailto:${lco.email}`}
                    className="group bg-black border border-gray-800 hover:border-blue-500/60 rounded-xl p-4 flex items-center gap-3 transition"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-500/15 flex items-center justify-center shrink-0 group-hover:bg-blue-500/25 transition">
                      <Mail size={18} className="text-blue-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wide">
                        Email
                      </p>
                      <p className="text-sm font-semibold text-white truncate">
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
                      className="shrink-0 text-gray-500 hover:text-blue-400 transition"
                      title="Copy"
                    >
                      {copied === "email" ? (
                        <Check size={16} className="text-green-400" />
                      ) : (
                        <Copy size={16} />
                      )}
                    </button>
                  </a>
                )}
              </div>

              {/* Address Card */}
              <div className="bg-black border border-gray-800 rounded-xl p-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/15 flex items-center justify-center shrink-0">
                    <MapPin size={18} className="text-green-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">
                      Address
                    </p>
                    <p className="text-sm text-gray-200 leading-relaxed">
                      {getFullAddress(lco)}
                    </p>
                  </div>
                </div>
              </div>

              {/* WhatsApp / Message CTA (optional) */}
              {lco.mobile_no && (
                <a
                  href={`https://wa.me/91${lco.mobile_no.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-green-900/30"
                >
                  <MessageCircle size={18} />
                  Message on WhatsApp
                </a>
              )}

              {/* Info Note */}
              <div className="text-[11px] text-gray-500 text-center leading-relaxed">
                Contact your Cable Operator for any service complaints or
                assistance.
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
