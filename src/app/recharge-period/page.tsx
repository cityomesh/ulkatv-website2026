// app/recharge-period/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Check,
  Loader2,
  Clock,
  IndianRupee,
  ChevronRight,
} from "lucide-react";

interface AccountBouque {
  bouque_id: number;
  bouque_type: number;
  deactivation_date?: string;
  activation_date?: string;
  [key: string]: unknown;
}

interface RechargePeriod {
  id: string;
  name: string;
  months: number;
  days: number;
  amount: number;
}

// ✅ Extended raw type — includes mrpAmount, mrpTotal
interface RechargePeriodRaw {
  name?: string;
  months?: number | string;
  days?: number | string;
  amount?: number | string;
  mrpTotal?: number | string;
  mrpAmount?: number | string;
}

export default function RechargePeriodPage() {
  const router = useRouter();
  const [periods, setPeriods] = useState<RechargePeriod[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [basePackId, setBasePackId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [loadingMsg, setLoadingMsg] = useState("Connecting to server...");

  // ==================================================
  // LOADING MESSAGE ROTATION
  // ==================================================
  useEffect(() => {
    if (!loading) return;

    const messages = [
      "Connecting to server...",
      "Fetching your base pack...",
      "Loading recharge periods...",
      "Preparing your options...",
      "Almost there...",
    ];

    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % messages.length;
      setLoadingMsg(messages[i]);
    }, 2200);

    return () => clearInterval(interval);
  }, [loading]);

  // ==================================================
  // INIT
  // ==================================================
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("access_token");
      const accountId = localStorage.getItem("accountId") || "";
      const subscriberId = localStorage.getItem("subscriberId") || "";

      if (!token || !accountId || !subscriberId) {
        router.push("/renew-packs");
        return;
      }

      try {
        setStatusMsg("Fetching your active base pack...");
        const packsRes = await fetch(
          `/api/base-packs?subscriber_id=${subscriberId}&account_id=${accountId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const packsData = await packsRes.json();

        const now = Date.now();
        const activeBasePacks: AccountBouque[] = Array.isArray(packsData?.data)
          ? (packsData.data as AccountBouque[]).filter((p) => {
              if (p.bouque_type !== 1) return false;
              const deact = p.deactivation_date
                ? new Date(p.deactivation_date.split(" ")[0]).getTime()
                : 0;
              return deact >= now;
            })
          : [];

        if (activeBasePacks.length === 0) {
          router.push("/renew-packs");
          return;
        }

        activeBasePacks.sort((a, b) => {
          const da = a.deactivation_date
            ? new Date(a.deactivation_date).getTime()
            : 0;
          const db = b.deactivation_date
            ? new Date(b.deactivation_date).getTime()
            : 0;
          return db - da;
        });

        const basePack = activeBasePacks[0];
        setBasePackId(basePack.bouque_id);

        setStatusMsg("Loading recharge periods...");
        const periodsRes = await fetch("/api/recharge-periods", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ids: [basePack.bouque_id],
            account_id: accountId,
          }),
        });
        const periodsData = await periodsRes.json();
        console.log("[Recharge Period] RAW API:", periodsData);

        if (periodsRes.ok && periodsData.success && periodsData.data) {
          const container = periodsData.data["0"] || periodsData.data;

          const parsed: RechargePeriod[] = Object.entries(
            container as Record<string, RechargePeriodRaw>
          )
            .filter(([key]) => /^\d+$/.test(key))
            .map(([key, value]) => {
              // ✅ Use mrpAmount (final total incl. NCF)
              const amount =
                parseFloat(
                  String(
                    value?.mrpAmount ??
                      value?.mrpTotal ??
                      value?.amount ??
                      0
                  )
                ) || 0;
              return {
                id: key,
                name: value?.name || "",
                months: Number(value?.months) || 0,
                days: Number(value?.days) || 0,
                amount,
              };
            })
            .filter((p) => p.amount > 0 && p.days === 0);

          parsed.sort((a, b) => a.months - b.months);

          console.log(
            "[Recharge Period] FINAL (correct totals):",
            parsed.map((p) => ({
              id: p.id,
              name: p.name,
              months: p.months,
              amount: p.amount,
            }))
          );

          setPeriods(parsed);
          if (parsed.length > 0) setSelectedId(parsed[0].id);
        } else {
          setErrorMsg("Failed to load recharge periods.");
        }
      } catch (err) {
        console.error("[Recharge Period] Error:", err);
        setErrorMsg("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
        setStatusMsg("");
      }
    };

    init();
  }, [router]);

  // ==================================================
  // PAYMENT
  // ==================================================
  const handleContinue = async () => {
    if (!selectedId || submitting || !basePackId) return;

    setSubmitting(true);
    setErrorMsg(null);
    setStatusMsg("Redirecting to payment...");

    try {
      const token = localStorage.getItem("access_token");
      const accountId = localStorage.getItem("accountId") || "";

      if (!token || !accountId) {
        setErrorMsg("Session expired. Please log in again.");
        setSubmitting(false);
        setStatusMsg("");
        return;
      }

      localStorage.setItem(
        "last_order",
        JSON.stringify({
          account_id: accountId,
          bouque_ids: [basePackId],
          rperiod_id: selectedId,
          type: "renewal",
          created_at: new Date().toISOString(),
        })
      );

      const PAYMENT_URL = `https://partners.ulka.tv/portal/index.php?r=portal/online-pay/checkout&pa=${token}`;
      const form = document.createElement("form");
      form.method = "POST";
      form.action = PAYMENT_URL;
      form.style.display = "none";

      const fields: Record<string, string> = {
        account_ids: accountId,
        type: "renewal",
        rperiod_id: selectedId,
        remark: "renewal payment",
      };

      Object.entries(fields).forEach(([name, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        input.value = value;
        form.appendChild(input);
      });

      const bouqueInput = document.createElement("input");
      bouqueInput.type = "hidden";
      bouqueInput.name = "bouque_ids[]";
      bouqueInput.value = String(basePackId);
      form.appendChild(bouqueInput);

      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      console.error("[Recharge Period] Error:", err);
      setSubmitting(false);
      setStatusMsg("");
      setErrorMsg("Failed to prepare order. Please try again.");
    }
  };

  const selectedPeriod = periods.find((p) => p.id === selectedId);

  // ==================================================
  // RENDER
  // ==================================================
  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-[60] bg-white/95 backdrop-blur-md flex items-center justify-center">
          <div className="flex flex-col items-center max-w-sm w-full px-6">
            <div className="relative mb-8">
              <div className="w-24 h-24 rounded-full border-4 border-red-100" />
              <div className="absolute inset-0 w-24 h-24 rounded-full border-4 border-transparent border-t-red-600 border-r-red-600 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
                  <Calendar className="w-7 h-7 text-red-600 animate-pulse" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <h2 className="text-lg font-black text-gray-900">
                Loading Periods
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

            <div className="mt-8 text-center">
              <p className="text-[11px] text-gray-400 leading-relaxed">
                This may take a few seconds.
                <br />
                Please don&apos;t close this page.
              </p>
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
        <div className="max-w-4xl mx-auto px-4 md:px-8 pt-10">
          {/* BACK BUTTON */}
          <button
            onClick={() => router.back()}
            disabled={submitting}
            className="group flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-red-600 mb-4 transition-colors disabled:opacity-50"
          >
            <span className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-red-600 flex items-center justify-center transition-colors">
              <ArrowLeft
                size={16}
                className="text-gray-600 group-hover:text-white transition-colors group-hover:-translate-x-0.5 duration-300"
              />
            </span>
            Back
          </button>

          {/* HERO HEADER */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
              Select <span className="text-red-600">Recharge Period</span>
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Choose how long you want to recharge your base pack
            </p>
          </div>

          {/* PERIOD CARDS */}
          {!loading && periods.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {periods.map((period) => {
                const isSelected = selectedId === period.id;
                const label = period.name || `${period.months} Months`;

                return (
                  <button
                    key={period.id}
                    type="button"
                    disabled={submitting}
                    onClick={() => setSelectedId(period.id)}
                    className={`group relative text-left rounded-2xl border-2 p-5 transition-all duration-300 overflow-hidden disabled:opacity-60 ${
                      isSelected
                        ? "bg-gradient-to-br from-red-50 to-white border-red-500 shadow-lg shadow-red-100"
                        : "bg-white border-gray-100 hover:border-red-200 hover:shadow-md hover:shadow-red-50/60"
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-0 right-0 bg-red-600 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-xl">
                        Selected
                      </div>
                    )}

                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                          isSelected
                            ? "border-red-600 bg-red-600"
                            : "border-gray-300 group-hover:border-red-400"
                        }`}
                      >
                        {isSelected && (
                          <Check size={14} className="text-white" />
                        )}
                      </div>

                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? "bg-red-600"
                            : "bg-red-50 group-hover:bg-red-100"
                        }`}
                      >
                        <Clock
                          className={`w-5 h-5 transition-colors ${
                            isSelected ? "text-white" : "text-red-600"
                          }`}
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p
                          className={`font-black text-base leading-tight ${
                            isSelected ? "text-red-700" : "text-gray-900"
                          }`}
                        >
                          {label}
                        </p>
                        <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                          {period.months} month
                          {period.months > 1 ? "s" : ""} validity
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <IndianRupee
                          size={12}
                          className={
                            isSelected ? "text-red-600" : "text-gray-400"
                          }
                        />
                        <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                          Total
                        </span>
                      </div>
                      <p
                        className={`text-xl font-black tracking-tight ${
                          isSelected ? "text-red-600" : "text-gray-900"
                        }`}
                      >
                        ₹{period.amount.toFixed(2)}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* EMPTY */}
          {!loading && periods.length === 0 && !errorMsg && (
            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-16 text-center">
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-7 h-7 text-red-500" />
              </div>
              <p className="text-sm font-bold text-gray-900">
                No recharge periods
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Please try again or contact support
              </p>
            </div>
          )}

          {/* SUBMITTING STATUS */}
          {submitting && statusMsg && (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-6 flex items-center gap-3">
              <Loader2
                size={18}
                className="animate-spin text-red-600 shrink-0"
              />
              <p className="text-red-700 text-sm font-semibold">
                {statusMsg}
              </p>
            </div>
          )}

          {/* ERROR */}
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 text-red-700 text-sm font-medium">
              {errorMsg}
            </div>
          )}

          {/* DESKTOP PROCEED BUTTON */}
          <div className="hidden sm:block">
            <button
              onClick={handleContinue}
              disabled={!selectedId || submitting}
              className={`w-full py-4 rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-2 ${
                !selectedId || submitting
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white shadow-lg shadow-red-200 hover:shadow-red-300 hover:scale-[1.01]"
              }`}
            >
              {submitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Redirecting to Payment...
                </>
              ) : (
                <>
                  Proceed to Payment
                  <ChevronRight size={18} />
                </>
              )}
            </button>
          </div>
        </div>

        {/* MOBILE BOTTOM BAR */}
        <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 animate-[slideUp_0.3s_ease-out]">
          <div className="bg-black/95 backdrop-blur-md border-t border-red-500/30 shadow-[0_-8px_24px_rgba(0,0,0,0.4)] p-4">
            {selectedPeriod && (
              <div className="mb-3 flex items-center justify-between">
                <div className="min-w-0 flex-1 mr-3">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    <p className="text-white font-bold text-sm truncate">
                      {selectedPeriod.name ||
                        `${selectedPeriod.months} Months`}
                    </p>
                  </div>
                  <p className="text-gray-400 text-[11px] truncate">
                    {selectedPeriod.months} month validity
                  </p>
                </div>
                <p className="text-red-400 font-black text-lg shrink-0">
                  ₹{selectedPeriod.amount.toFixed(2)}
                </p>
              </div>
            )}

            <button
              onClick={handleContinue}
              disabled={!selectedId || submitting}
              className={`w-full py-3 rounded-full font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                !selectedId || submitting
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white shadow-lg shadow-red-900/40"
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
    </>
  );
}
