// app/renew-packs/page.tsx
"use client";

import { useState, useEffect, Suspense, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Check, ArrowLeft, Loader2, RefreshCcw } from "lucide-react";
import UserHeader from "../../components/UserHeader";

interface AccountBouque {
  id?: number;
  bouque_id: number;
  bouque_name?: string;
  name?: string;
  description?: string;
  bouque_type: number;
  amount: string;
  mrp?: string;
  rate?: { mrp: string }[];
  activation_date?: string;
  deactivation_date?: string;
  left?: string;
  boxtype_lbl?: string;
}

interface RechargePeriod {
  id: string;
  title: string;
  days: number;
  total: number;
}

// ✅ Raw shape for /api/available-base-packs (bouque/list) response
interface AvailablePackRaw {
  id: number;
  name?: string;
  description?: string;
  mrp?: string;
  rate?: { mrp: string }[];
  boxtype_lbl?: string;
}

// ✅ Raw shape for /api/recharge-periods response
interface RechargePeriodRaw {
  name?: string;
  days?: number | string;
  mrpTotal?: number | string;
}

function RenewContent() {
  const router = useRouter();

  const [allPacks, setAllPacks] = useState<AccountBouque[]>([]);
  const [availablePacks, setAvailablePacks] = useState<AccountBouque[]>([]);
  const [selectedIds, setSelectedIds] = useState<Record<string, boolean>>({});
  const [periods, setPeriods] = useState<RechargePeriod[]>([]);
  const [selectedPeriodId, setSelectedPeriodId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [modifyLoading, setModifyLoading] = useState(false);
  const [periodsLoading, setPeriodsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"active" | "modify" | "expired">(
    "active"
  );

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("access_token")
      : null;
  const accountId =
    typeof window !== "undefined"
      ? localStorage.getItem("accountId") || ""
      : "";
  const subscriberId =
    typeof window !== "undefined"
      ? localStorage.getItem("subscriberId") || ""
      : "";

  // ────────────────────────────────────────────────
  // 1️⃣ Fetch user's packs (account-bouque)
  // ────────────────────────────────────────────────
  useEffect(() => {
    if (!token || !accountId) {
      setError("Missing session. Please log in again.");
      setLoading(false);
      return;
    }

    const loadPacks = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/base-packs?subscriber_id=${subscriberId}&account_id=${accountId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        console.log("[Renew] account-bouque response:", data);

        if (res.ok && data.success && Array.isArray(data.data)) {
          setAllPacks(data.data);
        } else {
          setAllPacks([]);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong."
        );
      } finally {
        setLoading(false);
      }
    };

    loadPacks();
  }, [token, accountId, subscriberId]);

  // ────────────────────────────────────────────────
  // 2️⃣ Lazy-load available base packs for Modify tab
  // ────────────────────────────────────────────────
  useEffect(() => {
    if (activeTab !== "modify") return;
    if (availablePacks.length > 0) return;
    if (!token) return;

    const loadAvailable = async () => {
      setModifyLoading(true);
      try {
        const brandId = localStorage.getItem("brandId") || "";
        const res = await fetch(
          `/api/available-base-packs?account_id=${accountId}&brand_id=${brandId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        console.log("[Renew] available base packs response:", data);

        if (res.ok && data.success && Array.isArray(data.data)) {
          // ✅ Typed map (no `any`)
          const normalized: AccountBouque[] = (data.data as AvailablePackRaw[]).map(
            (p) => ({
              bouque_id: p.id,
              bouque_name: p.name || p.description,
              name: p.name,
              description: p.description,
              bouque_type: 1,
              amount: p.mrp || "0",
              mrp: p.mrp,
              rate: p.rate,
              activation_date: "",
              deactivation_date: "",
              boxtype_lbl: p.boxtype_lbl,
            })
          );
          setAvailablePacks(normalized);
        } else {
          setAvailablePacks([]);
        }
      } catch (err) {
        console.error("Load available packs error:", err);
        setAvailablePacks([]);
      } finally {
        setModifyLoading(false);
      }
    };

    loadAvailable();
  }, [activeTab, token, accountId, availablePacks.length]);

  // ────────────────────────────────────────────────
  // 3️⃣ Helpers
  // ────────────────────────────────────────────────
  const getPackName = (p: AccountBouque) => {
    return (
      p.bouque_name?.trim() ||
      p.name?.trim() ||
      p.description?.trim() ||
      "Pack Name"
    );
  };

  const { activePacks, expiredPacks } = useMemo(() => {
    const now = new Date().getTime();
    const active: AccountBouque[] = [];
    const expired: AccountBouque[] = [];

    allPacks.forEach((p) => {
      const deactTime = p.deactivation_date
        ? new Date(p.deactivation_date.split(" ")[0]).getTime()
        : 0;

      if (deactTime && deactTime < now) {
        expired.push(p);
        return;
      }
      if (deactTime && deactTime >= now) {
        active.push(p);
        return;
      }
      active.push(p);
    });

    return { activePacks: active, expiredPacks: expired };
  }, [allPacks]);

  const currentPacks = useMemo(() => {
    if (activeTab === "active") return activePacks;
    if (activeTab === "modify") return availablePacks;
    return expiredPacks;
  }, [activeTab, activePacks, availablePacks, expiredPacks]);

  const toggleSelect = (bouqueId: number) => {
    const key = String(bouqueId);
    setSelectedIds((prev) => {
      const next = { ...prev };
      if (next[key]) {
        delete next[key];
      } else {
        next[key] = true;
      }
      return next;
    });
  };

  const selectedPacks = useMemo(() => {
    const all = [...allPacks, ...availablePacks];
    const seen = new Set<number>();
    const unique: AccountBouque[] = [];
    all.forEach((p) => {
      if (selectedIds[String(p.bouque_id)] && !seen.has(p.bouque_id)) {
        seen.add(p.bouque_id);
        unique.push(p);
      }
    });
    return unique;
  }, [allPacks, availablePacks, selectedIds]);

  const getPrice = (p: AccountBouque) => {
    if (p.rate && Array.isArray(p.rate) && p.rate[0]?.mrp) {
      return parseFloat(p.rate[0].mrp) || 0;
    }
    return parseFloat(p.amount || p.mrp || "0") || 0;
  };

  // Check if selected packs include any Modify (base pack change)
  const isModifySelection = selectedPacks.some((p) =>
    availablePacks.some((ap) => ap.bouque_id === p.bouque_id)
  );

  // ✅ Extract a STABLE primitive key for the effect dependency array
  //    (fixes: complex expression + missing deps warnings)
  const selectedPacksKey = useMemo(
    () => selectedPacks.map((p) => p.bouque_id).join(","),
    [selectedPacks]
  );

  // ────────────────────────────────────────────────
  // 4️⃣ Fetch recharge periods — WITH MODIFY FALLBACK
  // ────────────────────────────────────────────────
  useEffect(() => {
    if (selectedPacks.length === 0) {
      setPeriods([]);
      setSelectedPeriodId("");
      return;
    }

    // ✅ FALLBACK: For Modify base pack selection, default rperiod_id="3"
    if (isModifySelection) {
      setSelectedPeriodId("3");
    }

    const fetchPeriods = async () => {
      setPeriodsLoading(true);
      try {
        const ids = selectedPacks.map((p) => p.bouque_id);
        const res = await fetch("/api/recharge-periods", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ids, account_id: accountId }),
        });
        const data = await res.json();
        console.log("[Renew] Periods response:", data);

        if (res.ok && data.success && data.data) {
          const container = data.data["0"] || data.data;

          // ✅ Typed Record — no `any`
          const parsed: RechargePeriod[] = Object.entries(
            container as Record<string, RechargePeriodRaw>
          ).map(([key, value]) => ({
            id: key,
            title: value?.name || "",
            days: Number(value?.days) || 0,
            total: parseFloat(String(value?.mrpTotal ?? 0)) || 0,
          }));

          if (parsed.length > 0) {
            setPeriods(parsed);
            setSelectedPeriodId(parsed[0].id);
          } else {
            setPeriods([]);
            if (!isModifySelection) setSelectedPeriodId("");
          }
        } else {
          setPeriods([]);
          if (!isModifySelection) setSelectedPeriodId("");
        }
      } catch (e) {
        console.error(e);
        setPeriods([]);
      } finally {
        setPeriodsLoading(false);
      }
    };

    fetchPeriods();
    // ✅ Use the stable primitive key — no complex expression
  }, [selectedPacksKey, isModifySelection, token, accountId, selectedPacks]);

  // ────────────────────────────────────────────────
  // 5️⃣ Proceed to payment
  // ────────────────────────────────────────────────
  const handleProceed = async () => {
    if (!token || !accountId) {
      alert("Session expired.");
      return;
    }
    if (selectedPacks.length === 0) {
      alert("Please select at least one pack.");
      return;
    }
    if (!selectedPeriodId) {
      alert("Please select a recharge period.");
      return;
    }

    setSubmitting(true);

    try {
      const PAYMENT_URL = `https://partners.ulka.tv/portal/index.php?r=portal/online-pay/checkout&pa=${token}`;
      const form = document.createElement("form");
      form.method = "POST";
      form.action = PAYMENT_URL;
      form.style.display = "none";

      const hasBasePack = selectedPacks.some((p) => p.bouque_type === 1);
      const paymentType =
        hasBasePack || isModifySelection ? "renewal" : "addon";

      const fields: Record<string, string> = {
        account_ids: accountId,
        type: paymentType,
        rperiod_id: selectedPeriodId,
        remark: `${paymentType} payment`,
      };

      Object.entries(fields).forEach(([name, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        input.value = value;
        form.appendChild(input);
      });

      selectedPacks.forEach((p) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = "bouque_ids[]";
        input.value = String(p.bouque_id);
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (e) {
      console.error(e);
      alert("Failed to initiate payment.");
      setSubmitting(false);
    }
  };

  // ────────────────────────────────────────────────
  // 6️⃣ Helpers
  // ────────────────────────────────────────────────
  const formatDate = (str?: string) => {
    if (!str) return "--";
    const d = new Date(str.split(" ")[0]);
    if (isNaN(d.getTime())) return str;
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  const getBadgeColor = (type: number) => {
    switch (type) {
      case 0:
        return "bg-orange-500";
      case 1:
        return "bg-red-600";
      case 2:
        return "bg-blue-600";
      case 3:
        return "bg-green-600";
      default:
        return "bg-gray-600";
    }
  };

  const getBadgeLabel = (type: number) => {
    switch (type) {
      case 0:
        return "NCF";
      case 1:
        return "BASE";
      case 2:
        return "ADDON";
      case 3:
        return "ALACARTE";
      default:
        return "PACK";
    }
  };

  const canProceed =
    selectedPacks.length > 0 && selectedPeriodId !== "" && !submitting;

  // ────────────────────────────────────────────────
  // 7️⃣ Render
  // ────────────────────────────────────────────────
  return (
    <>
      <UserHeader />

      <div className="min-h-screen bg-[#0d0d0d] text-white pt-24 pb-32 px-4 md:px-8">
        <div className="max-w-[1200px] mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-4 transition"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <div className="flex items-center gap-3 mb-6">
            <RefreshCcw className="text-orange-500" size={28} />
            <h1 className="text-2xl font-bold text-yellow-400">
              Renew / Manage Packs
            </h1>
          </div>

          {error && (
            <div className="bg-red-950 border border-red-700 rounded-md p-4 text-red-400 mb-4 text-sm">
              {error}
            </div>
          )}

          {loading && (
            <div className="text-center py-12 text-gray-400 text-sm flex items-center justify-center gap-2">
              <Loader2 size={16} className="animate-spin" />
              Loading packs...
            </div>
          )}

          {/* Tabs */}
          {!loading && (
            <div className="flex border-b border-gray-800 mb-4 overflow-x-auto">
              <button
                onClick={() => setActiveTab("active")}
                className={`px-5 py-3 text-sm font-semibold whitespace-nowrap transition ${
                  activeTab === "active"
                    ? "text-yellow-400 border-b-2 border-yellow-400"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Active ({activePacks.length})
              </button>

              <button
                onClick={() => setActiveTab("modify")}
                className={`px-5 py-3 text-sm font-semibold whitespace-nowrap transition ${
                  activeTab === "modify"
                    ? "text-yellow-400 border-b-2 border-yellow-400"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Modify ({availablePacks.length})
              </button>

              <button
                onClick={() => setActiveTab("expired")}
                className={`px-5 py-3 text-sm font-semibold whitespace-nowrap transition ${
                  activeTab === "expired"
                    ? "text-yellow-400 border-b-2 border-yellow-400"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Expired ({expiredPacks.length})
              </button>
            </div>
          )}

          {!loading && activeTab === "modify" && modifyLoading && (
            <div className="text-center py-12 text-gray-400 text-sm flex items-center justify-center gap-2">
              <Loader2 size={16} className="animate-spin" />
              Loading available packs...
            </div>
          )}

          {!loading &&
            !(activeTab === "modify" && modifyLoading) &&
            currentPacks.length === 0 && (
              <div className="text-center py-12 text-gray-400 text-sm">
                No {activeTab} packs available.
              </div>
            )}

          {/* Packs List */}
          {!(activeTab === "modify" && modifyLoading) && (
            <div className="space-y-3">
              {currentPacks.map((pack) => {
                const isSelected = !!selectedIds[String(pack.bouque_id)];
                const price = getPrice(pack);
                const isBase = pack.bouque_type === 1;
                const packName = getPackName(pack);

                return (
                  <div
                    key={pack.bouque_id}
                    onClick={() => toggleSelect(pack.bouque_id)}
                    className={`cursor-pointer rounded-lg border p-4 flex items-center gap-3 transition ${
                      isSelected
                        ? isBase
                          ? "bg-[#1f1a1a] border-gray-500"
                          : "bg-[#0f1f1f] border-green-500"
                        : "bg-black border-gray-800 hover:border-gray-600"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${
                        isSelected
                          ? isBase
                            ? "border-gray-500 bg-gray-500"
                            : "border-green-500 bg-green-500"
                          : "border-gray-600"
                      }`}
                    >
                      {isSelected && <Check size={12} className="text-white" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">
                        {packName}
                      </p>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        {activeTab === "modify"
                          ? "Available base pack"
                          : `Expiry: ${formatDate(pack.deactivation_date)}`}
                      </p>
                    </div>

                    <div className="shrink-0 flex flex-col items-end gap-1">
                      <span className="text-cyan-400 font-bold text-sm">
                        ₹ {price.toFixed(2)}
                      </span>
                      <div className="flex gap-1">
                        {activeTab !== "modify" && pack.left && (
                          <span className="text-[10px] bg-gray-800 text-gray-300 px-2 py-0.5 rounded font-semibold">
                            {pack.left} days left
                          </span>
                        )}
                        <span
                          className={`text-[10px] text-white px-2 py-0.5 rounded font-semibold ${getBadgeColor(
                            pack.bouque_type
                          )}`}
                        >
                          {getBadgeLabel(pack.bouque_type)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Recharge Periods */}
          {selectedPacks.length > 0 && periods.length > 0 && (
            <div className="bg-black border border-gray-800 rounded-lg p-5 mt-6">
              <h2 className="text-base font-bold mb-3 text-white">
                Select Recharge Period
              </h2>

              {periodsLoading && (
                <div className="flex items-center gap-2 text-gray-400 text-sm py-4">
                  <Loader2 size={16} className="animate-spin" />
                  Loading periods...
                </div>
              )}

              <div className="space-y-2">
                {periods.map((period) => {
                  const isSel = selectedPeriodId === period.id;
                  return (
                    <button
                      key={period.id}
                      onClick={() => setSelectedPeriodId(period.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-md border text-left transition ${
                        isSel
                          ? "border-green-500 bg-[#0f1f1f]"
                          : "border-gray-800 bg-[#1a1a1a] hover:border-gray-600"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          isSel
                            ? "border-green-500 bg-green-500"
                            : "border-gray-600"
                        }`}
                      >
                        {isSel && <Check size={12} className="text-white" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-white">
                          {period.title}
                        </p>
                        {period.days > 0 && (
                          <p className="text-[11px] text-gray-500">
                            {period.days} days
                          </p>
                        )}
                      </div>
                      <span className="text-cyan-400 font-bold text-sm">
                        ₹ {period.total.toFixed(2)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Info note for Modify fallback */}
          {selectedPacks.length > 0 &&
            periods.length === 0 &&
            isModifySelection && (
              <div className="mt-6 bg-blue-950/50 border border-blue-800 rounded-lg p-4 text-blue-300 text-sm">
                ℹ️ Base pack change — default recharge period will be applied
                automatically.
              </div>
            )}
        </div>

        {/* Bottom Bar */}
        {selectedPacks.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 z-40 animate-[slideUp_0.3s_ease-out]">
            <div className="bg-black/95 backdrop-blur-md border-t border-gray-800">
              <div className="max-w-[1200px] mx-auto flex justify-between items-center px-4 md:px-8 py-3">
                <div className="min-w-0 flex-1 mr-4">
                  <p className="text-white font-bold text-base">
                    {selectedPacks.length} Pack
                    {selectedPacks.length !== 1 ? "s" : ""} Selected
                  </p>
                  <p className="text-gray-300 text-[13px] truncate">
                    {selectedPacks.map((p) => getPackName(p)).join(", ")}
                  </p>
                  <p className="text-gray-500 text-[11px] mt-0.5">
                    Network Capacity Fee and GST extra as applicable
                  </p>
                </div>
                <button
                  onClick={handleProceed}
                  disabled={!canProceed}
                  className={`shrink-0 px-6 py-3 rounded-md font-bold text-sm transition flex items-center gap-2 ${
                    !canProceed
                      ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/40"
                  }`}
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Redirecting...
                    </>
                  ) : (
                    <>₹ Proceed to Payment</>
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

export default function RenewPacksPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0d0d0d] text-white flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <RenewContent />
    </Suspense>
  );
}
