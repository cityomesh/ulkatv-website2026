// app/checkout/page.tsx
"use client";

import { useState, useEffect, Suspense, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Check,
  ArrowLeft,
  Loader2,
  AlertTriangle,
  ShoppingCart,
  Calendar,
  ChevronRight,
  IndianRupee,
  Layers,
} from "lucide-react";
import UserHeader from "../../components/UserHeader";

interface Pack {
  id: number;
  mrp: string;
  rate?: { mrp: string }[];
  description: string;
  boxtype_lbl: string;
}

interface RechargePeriod {
  id: string;
  title: string;
  days: number;
  total: number;
}

interface RechargePeriodRaw {
  name?: string;
  days?: number | string;
  mrpTotal?: number | string;
  mrpAmount?: number | string;
}

// ✅ FIX: Ulka payment endpoint treats BOTH addon AND ala carte as "addon"
const normalizeUlkaType = (rawType: string): string => {
  const t = (rawType || "").toLowerCase().trim();

  if (t === "renewal" || t === "renew") return "renewal";

  if (
    t === "alacarte" ||
    t === "alacart" ||
    t === "a-la-carte" ||
    t === "addon" ||
    t === "add-on" ||
    t === "addons"
  ) {
    return "addon";
  }

  console.warn("[Checkout] Unknown type received:", rawType);
  return "addon";
};

function CheckoutContent() {
  const params = useSearchParams();
  const router = useRouter();

  const idsParam = params.get("ids") || "";
  const rawType = params.get("type") || "addon";

  const ulkaType = useMemo(() => normalizeUlkaType(rawType), [rawType]);

  const ids = useMemo(
    () =>
      idsParam
        .split(",")
        .map((s) => Number(s.trim()))
        .filter((n) => !isNaN(n)),
    [idsParam]
  );

  const [packs, setPacks] = useState<Pack[]>([]);
  const [periods, setPeriods] = useState<RechargePeriod[]>([]);
  const [selectedPeriodId, setSelectedPeriodId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [basePackRequired, setBasePackRequired] = useState<number | null>(null);
  const [loadingMsg, setLoadingMsg] = useState("Connecting to server...");

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("access_token")
      : null;
  const accountId =
    typeof window !== "undefined"
      ? localStorage.getItem("accountId") || ""
      : "";

  // ==================================================
  // LOADING MESSAGE ROTATION
  // ==================================================
  useEffect(() => {
    if (!loading) return;

    const messages = [
      "Connecting to server...",
      "Validating your selection...",
      "Fetching recharge periods...",
      "Preparing your order...",
      "Almost there...",
    ];

    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % messages.length;
      setLoadingMsg(messages[i]);
    }, 2200);

    return () => clearInterval(interval);
  }, [loading]);

  // 1️⃣ Load selected packs
  useEffect(() => {
    try {
      const stored = localStorage.getItem("packs");
      if (stored) {
        const all: Pack[] = JSON.parse(stored);
        const selected = all.filter((p) => ids.includes(p.id));
        setPacks(selected);
      }
    } catch (e) {
      console.error("Failed to load packs:", e);
    }
  }, [ids]);

  // 2️⃣ Fetch recharge periods
  useEffect(() => {
    if (!token || !accountId || ids.length === 0) {
      setError("Missing data. Please go back and select packs again.");
      setLoading(false);
      return;
    }

    const fetchPeriods = async () => {
      setLoading(true);
      setError(null);
      setBasePackRequired(null);

      try {
        const res = await fetch("/api/recharge-periods", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ids, account_id: accountId }),
        });

        const data = await res.json();
        console.log("[Checkout] Recharge periods response:", data);

        const errMsg =
          data?.data?.message ||
          (typeof data?.message === "string" && data.message) ||
          "";

        if (
          !res.ok &&
          typeof errMsg === "string" &&
          errMsg.includes("Base Bouque need to be renew first")
        ) {
          const match = errMsg.match(/(\d+)/);
          if (match) setBasePackRequired(Number(match[1]));
          setError(
            "Base pack renewal required. You must renew the base pack before adding add-ons."
          );
          setLoading(false);
          return;
        }

        if (res.ok && data.success && data.data) {
          const container = data.data["0"] || data.data;

          const parsed: RechargePeriod[] = Object.entries(
            container as Record<string, RechargePeriodRaw>
          ).map(([key, value]) => ({
            id: key,
            title: value?.name || "",
            days: Number(value?.days) || 0,
            // ✅ Use mrpAmount (final total) first
            total:
              parseFloat(
                String(
                  value?.mrpAmount ??
                    value?.mrpTotal ??
                    0
                )
              ) || 0,
          }));

          setPeriods(parsed);
          if (parsed.length > 0) setSelectedPeriodId(parsed[0].id);
        } else {
          setError(
            (typeof data.message === "string" && data.message) ||
              "Failed to load recharge periods."
          );
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPeriods();
  }, [ids, token, accountId]);

  // Price helper
  const getPackPrice = (p: Pack) => {
    if (p.rate && Array.isArray(p.rate) && p.rate[0]?.mrp) {
      return parseFloat(p.rate[0].mrp) || 0;
    }
    return parseFloat(p.mrp) || 0;
  };

  const totalPacksPrice = packs.reduce(
    (sum, p) => sum + getPackPrice(p),
    0
  );

  const selectedPeriod = periods.find((p) => p.id === selectedPeriodId);
  const grandTotal = totalPacksPrice + (selectedPeriod?.total || 0);

  // 3️⃣ Proceed to payment
  const handleProceed = async () => {
    if (!token || !accountId) {
      alert("Session expired. Please log in again.");
      return;
    }
    if (!selectedPeriodId) {
      alert("Please select a recharge period.");
      return;
    }
    if (ids.length === 0) {
      alert("No packs selected.");
      return;
    }

    setSubmitting(true);

    try {
      const PAYMENT_URL = `https://partners.ulka.tv/portal/index.php?r=portal/online-pay/checkout&pa=${token}`;

      const form = document.createElement("form");
      form.method = "POST";
      form.action = PAYMENT_URL;
      form.style.display = "none";

      const fields: Record<string, string> = {
        account_ids: accountId,
        type: ulkaType,
        rperiod_id: selectedPeriodId,
        remark: `${rawType} payment`,
      };

      console.log("[Checkout] Submitting payment:", {
        rawType,
        ulkaType,
        accountId,
        ids,
        selectedPeriodId,
        fields,
      });

      Object.entries(fields).forEach(([name, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        input.value = value;
        form.appendChild(input);
      });

      ids.forEach((id) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = "bouque_ids[]";
        input.value = String(id);
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (e) {
      console.error("Payment error:", e);
      alert("Failed to initiate payment. Please try again.");
      setSubmitting(false);
    }
  };

  // ══════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════
  return (
    <>
      <UserHeader />

      {/* LOADING OVERLAY */}
      {loading && !basePackRequired && (
        <div className="fixed inset-0 z-[60] bg-white/95 backdrop-blur-md flex items-center justify-center">
          <div className="flex flex-col items-center max-w-sm w-full px-6">
            <div className="relative mb-8">
              <div className="w-24 h-24 rounded-full border-4 border-red-100" />
              <div className="absolute inset-0 w-24 h-24 rounded-full border-4 border-transparent border-t-red-600 border-r-red-600 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
                  <ShoppingCart className="w-7 h-7 text-red-600 animate-pulse" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <h2 className="text-lg font-black text-gray-900">
                Preparing Checkout
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

      <div className="min-h-screen bg-white text-gray-900 pb-32">
        <div className="max-w-3xl mx-auto px-4 md:px-8 pt-24">
          {/* BACK */}
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
            Back to Packs
          </button>

          {/* HERO */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
              Review & <span className="text-red-600">Pay</span>
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Confirm your packs and complete the payment
            </p>
          </div>

          {/* BASE PACK REQUIRED */}
          {basePackRequired ? (
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-6 text-center">
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-7 h-7 text-red-600" />
              </div>
              <p className="text-gray-900 text-lg font-black mb-2">
                Base Pack Renewal Required
              </p>
              <p className="text-gray-600 text-sm mb-5 max-w-xl mx-auto">
                You must renew your base pack (ID: {basePackRequired}) first.
                After renewing the base pack, you can add add-ons and ala-carte
                packs.
              </p>
              <div className="flex gap-3 justify-center flex-wrap">
                <button
                  onClick={() => router.push("/renew-packs")}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-full transition shadow-lg shadow-red-200"
                >
                  Renew Base Pack
                </button>
                <button
                  onClick={() => router.push("/dashboard")}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold px-6 py-2.5 rounded-full transition"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          ) : (
            <>
              {error && !loading && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 mb-6 text-sm font-medium">
                  {error}
                </div>
              )}

              {/* SELECTED PACKS */}
              <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden mb-5 shadow-sm">
                <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
                  <ShoppingCart className="w-4 h-4 text-red-600" />
                  <h2 className="text-sm font-black uppercase tracking-widest text-gray-900">
                    Selected Packs
                  </h2>
                  <span className="text-xs font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
                    {packs.length}
                  </span>
                </div>

                <div className="divide-y divide-gray-50">
                  {packs.length === 0 && !loading && (
                    <p className="text-gray-500 text-sm p-5">
                      No packs selected.
                    </p>
                  )}

                  {packs.map((p) => (
                    <div
                      key={p.id}
                      className="flex justify-between items-start gap-3 px-5 py-4"
                    >
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                          <Layers className="w-4 h-4 text-red-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-gray-900">
                            {p.description}
                          </p>
                          <p className="text-[11px] text-gray-400 mt-0.5">
                            {p.boxtype_lbl}
                          </p>
                        </div>
                      </div>
                      <span className="text-red-600 font-black text-sm shrink-0">
                        ₹{getPackPrice(p).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {packs.length > 0 && (
                  <div className="flex justify-between items-center px-5 py-4 border-t border-gray-100 bg-gray-50">
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
                      Packs Subtotal
                    </span>
                    <span className="text-red-600 font-black text-lg">
                      ₹{totalPacksPrice.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              {/* RECHARGE PERIOD */}
              <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden mb-5 shadow-sm">
                <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
                  <Calendar className="w-4 h-4 text-red-600" />
                  <h2 className="text-sm font-black uppercase tracking-widest text-gray-900">
                    Select Recharge Period
                  </h2>
                </div>

                <div className="p-5">
                  {!loading && periods.length === 0 && !error && (
                    <p className="text-gray-500 text-sm">
                      No recharge periods available.
                    </p>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {periods.map((period) => {
                      const isSel = selectedPeriodId === period.id;
                      return (
                        <button
                          key={period.id}
                          onClick={() => setSelectedPeriodId(period.id)}
                          className={`group relative text-left p-4 rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
                            isSel
                              ? "border-red-500 bg-gradient-to-br from-red-50 to-white shadow-lg shadow-red-100"
                              : "border-gray-100 bg-white hover:border-red-200 hover:shadow-md"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                                isSel
                                  ? "border-red-600 bg-red-600"
                                  : "border-gray-300 group-hover:border-red-400"
                              }`}
                            >
                              {isSel && (
                                <Check size={12} className="text-white" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p
                                className={`font-bold text-sm ${
                                  isSel ? "text-red-700" : "text-gray-900"
                                }`}
                              >
                                {period.title}
                              </p>
                              {period.days > 0 && (
                                <p className="text-[11px] text-gray-500 mt-0.5">
                                  {period.days} days
                                </p>
                              )}
                            </div>
                            <div className="text-right shrink-0">
                              <p
                                className={`text-lg font-black ${
                                  isSel ? "text-red-600" : "text-gray-900"
                                }`}
                              >
                                ₹{period.total.toFixed(0)}
                              </p>
                              {isSel && (
                                <p className="text-[9px] font-bold uppercase tracking-widest text-red-600">
                                  Selected
                                </p>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* INFO NOTE */}
              <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-start gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center shrink-0">
                  <IndianRupee size={14} className="text-white" />
                </div>
                <p className="text-[11px] text-gray-600 leading-relaxed font-medium pt-1">
                  Network Capacity Fee and GST extra as applicable. You will
                  be redirected to the Ulka secure payment page to complete
                  the payment.
                </p>
              </div>

              {/* TOTAL SUMMARY */}
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-5 mb-5 text-white">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs uppercase tracking-widest font-bold text-white/60">
                    Packs Subtotal
                  </span>
                  <span className="text-sm font-bold">
                    ₹{totalPacksPrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs uppercase tracking-widest font-bold text-white/60">
                    Recharge Period
                  </span>
                  <span className="text-sm font-bold">
                    ₹{(selectedPeriod?.total || 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-white/10">
                  <span className="text-xs uppercase tracking-widest font-bold text-red-400">
                    Estimated Total
                  </span>
                  <span className="text-2xl font-black text-red-400">
                    ₹{grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* BOTTOM PAYMENT BAR */}
        {!basePackRequired && (
          <div className="fixed bottom-0 left-0 right-0 z-40">
            <div className="bg-black/95 backdrop-blur-md border-t border-red-500/30 shadow-[0_-8px_24px_rgba(0,0,0,0.4)]">
              <div className="max-w-3xl mx-auto flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 px-4 md:px-8 py-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    <p className="text-white font-bold text-sm">
                      {packs.length} Pack{packs.length !== 1 ? "s" : ""} •{" "}
                      {selectedPeriod?.title || "Select period"}
                    </p>
                  </div>
                  <p className="text-red-400 font-black text-lg">
                    ₹{grandTotal.toFixed(2)}
                  </p>
                </div>

                <button
                  onClick={handleProceed}
                  disabled={
                    loading ||
                    submitting ||
                    packs.length === 0 ||
                    !selectedPeriodId
                  }
                  className={`shrink-0 px-8 py-3 rounded-full font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                    loading ||
                    submitting ||
                    packs.length === 0 ||
                    !selectedPeriodId
                      ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white shadow-lg shadow-red-900/40 hover:shadow-red-900/60"
                  }`}
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Redirecting...
                    </>
                  ) : (
                    <>
                      Proceed to Payment
                      <ChevronRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="animate-spin text-red-600 mb-3" size={32} />
            <p className="text-sm text-gray-500">Loading...</p>
          </div>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
