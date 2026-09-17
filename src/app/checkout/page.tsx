// app/checkout/page.tsx
"use client";

import { useState, useEffect, Suspense, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Check, ArrowLeft, Loader2, AlertTriangle } from "lucide-react";
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

// ✅ Raw value shape from Ulka recharge-period API
interface RechargePeriodRaw {
  name?: string;
  days?: number | string;
  mrpTotal?: number | string;
}

function CheckoutContent() {
  const params = useSearchParams();
  const router = useRouter();

  const idsParam = params.get("ids") || "";
  const type = params.get("type") || "addon";

  // ✅ useMemo so `ids` is stable across renders
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

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("access_token")
      : null;
  const accountId =
    typeof window !== "undefined"
      ? localStorage.getItem("accountId") || ""
      : "";

  // 1️⃣ Load selected packs from localStorage
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

          // ✅ Use typed Record instead of `any`
          const parsed: RechargePeriod[] = Object.entries(
            container as Record<string, RechargePeriodRaw>
          ).map(([key, value]) => ({
            id: key,
            title: value?.name || "",
            days: Number(value?.days) || 0,
            total: parseFloat(String(value?.mrpTotal ?? 0)) || 0,
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

  // 3️⃣ Proceed to payment — HTML form POST
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
        type: type,
        rperiod_id: selectedPeriodId,
        remark: `${type} payment`,
      };

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

  return (
    <>
      <UserHeader />

      <div className="min-h-screen bg-[#0d0d0d] text-white pt-24 pb-32 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-4 transition"
          >
            <ArrowLeft size={16} />
            Back to Packs
          </button>

          <h1 className="text-2xl font-bold text-yellow-400 mb-6">
            Checkout
          </h1>

          {/* ⚠️ Base Pack Required Banner */}
          {basePackRequired ? (
            <div className="bg-red-950 border-2 border-red-700 rounded-lg p-6 mb-6 text-center">
              <AlertTriangle className="text-red-400 mx-auto mb-3" size={32} />
              <p className="text-red-300 text-lg font-bold mb-2">
                Base Pack Renewal Required
              </p>
              <p className="text-red-400 text-sm mb-4 max-w-xl mx-auto">
                You must renew your base pack (ID: {basePackRequired}) first.
                After renewing the base pack, you can add add-ons and
                ala-carte packs.
              </p>
              <div className="flex gap-3 justify-center flex-wrap">
                <button
                  onClick={() => router.push("/renew-packs")}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2 rounded transition"
                >
                  Renew Base Pack
                </button>
                <button
                  onClick={() => router.push("/dashboard")}
                  className="bg-gray-700 hover:bg-gray-600 text-white font-bold px-6 py-2 rounded transition"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Generic error */}
              {error && (
                <div className="bg-red-950 border border-red-700 rounded-md p-4 text-red-400 mb-4 text-sm">
                  {error}
                </div>
              )}

              {/* Selected Packs */}
              <div className="bg-black border border-gray-800 rounded-lg p-5 mb-5">
                <h2 className="text-base font-bold mb-3 text-white">
                  Selected Packs ({packs.length})
                </h2>

                {packs.length === 0 && !loading && (
                  <p className="text-gray-400 text-sm">No packs selected.</p>
                )}

                <div className="divide-y divide-gray-800">
                  {packs.map((p) => (
                    <div
                      key={p.id}
                      className="flex justify-between items-start py-3 gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white">
                          {p.description}
                        </p>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          {p.boxtype_lbl}
                        </p>
                      </div>
                      <span className="text-cyan-400 font-semibold text-sm shrink-0">
                        ₹ {getPackPrice(p).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {packs.length > 0 && (
                  <div className="flex justify-between items-center pt-3 mt-3 border-t border-gray-700">
                    <span className="text-sm font-bold text-white">Total</span>
                    <span className="text-yellow-400 font-bold text-lg">
                      ₹ {totalPacksPrice.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              {/* Recharge Period */}
              <div className="bg-black border border-gray-800 rounded-lg p-5 mb-5">
                <h2 className="text-base font-bold mb-3 text-white">
                  Select Recharge Period
                </h2>

                {loading && (
                  <div className="flex items-center gap-2 text-gray-400 text-sm py-4">
                    <Loader2 size={16} className="animate-spin" />
                    Loading periods...
                  </div>
                )}

                {!loading && periods.length === 0 && !error && (
                  <p className="text-gray-400 text-sm">
                    No recharge periods available.
                  </p>
                )}

                <div className="space-y-2">
                  {periods.map((period) => {
                    const isSelected = selectedPeriodId === period.id;
                    return (
                      <button
                        key={period.id}
                        onClick={() => setSelectedPeriodId(period.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-md border text-left transition ${
                          isSelected
                            ? "border-green-500 bg-[#0f1f1f]"
                            : "border-gray-800 bg-[#1a1a1a] hover:border-gray-600"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                            isSelected
                              ? "border-green-500 bg-green-500"
                              : "border-gray-600"
                          }`}
                        >
                          {isSelected && (
                            <Check size={12} className="text-white" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white">
                            {period.title}
                          </p>
                          {period.days > 0 && (
                            <p className="text-[11px] text-gray-500">
                              {period.days} days
                            </p>
                          )}
                        </div>

                        <span className="text-cyan-400 font-bold text-sm shrink-0">
                          ₹ {period.total.toFixed(2)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="text-[11px] text-gray-500 mb-5 leading-relaxed">
                Network Capacity Fee and GST extra as applicable. You will be
                redirected to the Ulka secure payment page to complete the
                payment.
              </div>

              <button
                onClick={handleProceed}
                disabled={
                  loading ||
                  submitting ||
                  packs.length === 0 ||
                  !selectedPeriodId
                }
                className={`w-full py-3 rounded-md font-bold text-base transition flex items-center justify-center gap-2 ${
                  loading ||
                  submitting ||
                  packs.length === 0 ||
                  !selectedPeriodId
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/40"
                }`}
              >
                {submitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Redirecting to Payment...
                  </>
                ) : (
                  <>₹ Proceed to Payment</>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0d0d0d] text-white flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
