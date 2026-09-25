// app/renew-packs/page.tsx
"use client";

import { useState, useEffect, Suspense, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  ArrowLeft,
  Loader2,
  RefreshCcw,
  Sparkles,
  Layers,
  ChevronRight,
  Clock,
  CalendarDays,
} from "lucide-react";
import UserHeader from "../../components/UserHeader";

// ======================================================
// TYPES
// ======================================================
interface PackRate {
  id: number;
  months: number;
  days: number;
  amount?: string;
  price?: string;
  mrp?: string;
  name?: string;
  tax_amount?: string;
  total_days?: number;
  factor?: number;
}

interface AccountBouque {
  id?: number;
  bouque_id: number;
  bouque_name?: string;
  name?: string;
  description?: string;
  bouque_type: number;
  amount: string;
  mrp?: string;
  rate?: PackRate[];
  activation_date?: string;
  deactivation_date?: string;
  left?: string;
  boxtype_lbl?: string;
}

interface RechargePeriod {
  id: string;
  title: string;
  days: number;
  months: number;
  total: number;
}

interface AvailablePackRaw {
  id: number;
  name?: string;
  description?: string;
  mrp?: string;
  rate?: PackRate[];
  boxtype_lbl?: string;
}

interface RechargePeriodRaw {
  name?: string;
  days?: number | string;
  months?: number | string;
  amount?: number | string;
}

// ======================================================
// COMPONENT
// ======================================================
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
  const [periodsError, setPeriodsError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"active" | "modify" | "expired">(
    "active"
  );

  // ✅ Rotating loading message
  const [loadingMsg, setLoadingMsg] = useState("Connecting to server...");

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

  // ==================================================
  // LOADING MESSAGE ROTATION
  // ==================================================
  useEffect(() => {
    if (!loading) return;

    const messages = [
      "Connecting to server...",
      "Fetching your packs...",
      "Loading subscriptions...",
      "Preparing dashboard...",
      "Almost there...",
    ];

    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % messages.length;
      setLoadingMsg(messages[i]);
    }, 2200);

    return () => clearInterval(interval);
  }, [loading]);

  // ────────────────────────────────────────────────
  // 1️⃣ Load user's packs
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
  // 2️⃣ Lazy-load available base packs (Modify tab)
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

        if (res.ok && data.success && Array.isArray(data.data)) {
          const normalized: AccountBouque[] = (
            data.data as AvailablePackRaw[]
          ).map((p) => ({
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
          }));
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

  const isModifyPack = (bouqueId: number) =>
    availablePacks.some((ap) => ap.bouque_id === bouqueId);

  const isBaseTypePack = (bouqueId: number) => {
    const active = allPacks.find((p) => p.bouque_id === bouqueId);
    if (active && Number(active.bouque_type) === 1) return true;
    if (isModifyPack(bouqueId)) return true;
    return false;
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

  // ✅ Toggle — only ONE base pack at a time
  const toggleSelect = (bouqueId: number) => {
    const key = String(bouqueId);
    const isCurrentlySelected = !!selectedIds[key];

    if (isCurrentlySelected) {
      setSelectedIds((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
      return;
    }

    const isNewBase = isBaseTypePack(bouqueId);

    setSelectedIds((prev) => {
      const next: Record<string, boolean> = { ...prev };

      if (isNewBase) {
        Object.keys(next).forEach((idStr) => {
          const idNum = Number(idStr);
          if (isBaseTypePack(idNum)) {
            delete next[idStr];
          }
        });
      }

      next[key] = true;
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

  // ✅ safeIds — always only ONE base pack
  const safeIds = useMemo(() => {
    const basePacks: number[] = [];
    const nonBasePacks: number[] = [];

    selectedPacks.forEach((p) => {
      const isBase = Number(p.bouque_type) === 1 || isModifyPack(p.bouque_id);
      if (isBase) basePacks.push(p.bouque_id);
      else nonBasePacks.push(p.bouque_id);
    });

    const oneBase =
      basePacks.length > 0 ? [basePacks[basePacks.length - 1]] : [];

    return [...oneBase, ...nonBasePacks];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPacks, availablePacks]);

  const getPrice = (p: AccountBouque) => {
    if (p.rate && Array.isArray(p.rate) && p.rate[0]?.mrp) {
      return parseFloat(p.rate[0].mrp) || 0;
    }
    return parseFloat(p.amount || p.mrp || "0") || 0;
  };

  const isModifySelection = useMemo(() => {
    return selectedPacks.some((p) =>
      availablePacks.some((ap) => ap.bouque_id === p.bouque_id)
    );
  }, [selectedPacks, availablePacks]);

  const safeIdsKey = safeIds.join(",");

  // ────────────────────────────────────────────────
  // 4️⃣ Fetch recharge periods
  // ────────────────────────────────────────────────
  useEffect(() => {
    if (safeIds.length === 0) {
      setPeriods([]);
      setSelectedPeriodId("");
      setPeriodsError(null);
      return;
    }

    if (isModifySelection) {
      console.log("[Renew] Modify flow — using pack.rate array (no API)");
      setPeriodsLoading(true);
      setPeriodsError(null);

      const modifyPack = selectedPacks.find((sp) =>
        availablePacks.some((ap) => ap.bouque_id === sp.bouque_id)
      );

      if (modifyPack?.rate && Array.isArray(modifyPack.rate)) {
        const parsed: RechargePeriod[] = modifyPack.rate
          .filter((r) => (r.days ?? 0) === 0)
          .map((r) => ({
            id: String(r.id),
            title:
              r.name || `${r.months} Month${r.months > 1 ? "s" : ""}`,
            days: r.days ?? 0,
            months: r.months ?? 0,
            total: parseFloat(String(r.price ?? r.amount ?? 0)) || 0,
          }))
          .filter((p) => p.total > 0)
          .sort((a, b) => a.months - b.months);

        setPeriods(parsed);
        if (parsed.length > 0) setSelectedPeriodId(parsed[0].id);
        else setSelectedPeriodId("");
      } else {
        setPeriods([]);
        setSelectedPeriodId("");
        setPeriodsError("No recharge periods available for this pack.");
      }

      setPeriodsLoading(false);
      return;
    }

    // ✅ RENEWAL FLOW
    const fetchPeriods = async () => {
      setPeriodsLoading(true);
      setPeriodsError(null);
      try {
        const res = await fetch("/api/recharge-periods", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ids: safeIds, account_id: accountId }),
        });
        const data = await res.json();

        if (res.status === 422) {
          const msg = data?.data?.message || data?.message || "";
          setPeriodsError(
            typeof msg === "string" ? msg : "Invalid selection."
          );
          setPeriods([]);
          setSelectedPeriodId("");
          return;
        }

        let parsed: RechargePeriod[] = [];

        if (res.ok && data.success && data.data) {
          const container = data.data["0"] || data.data;

          parsed = Object.entries(
            container as Record<string, RechargePeriodRaw>
          )
            .filter(([key]) => /^\d+$/.test(key))
            .map(([key, value]) => ({
              id: key,
              title: value?.name || "",
              days: Number(value?.days) || 0,
              months: Number(value?.months) || 0,
              total: parseFloat(String(value?.amount ?? 0)) || 0,
            }))
            .filter((p) => p.total > 0 && p.days === 0)
            .sort((a, b) => a.months - b.months);
        }

        if (parsed.length > 0) {
          setPeriods(parsed);
          setSelectedPeriodId(parsed[0].id);
        } else {
          setPeriods([]);
          setSelectedPeriodId("");
        }
      } catch (e) {
        console.error("[Renew] periods error:", e);
        setPeriods([]);
        setPeriodsError("Failed to load recharge periods.");
      } finally {
        setPeriodsLoading(false);
      }
    };

    fetchPeriods();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeIdsKey, isModifySelection, token, accountId]);

  // ────────────────────────────────────────────────
  // 5️⃣ Proceed to payment
  // ────────────────────────────────────────────────
  const handleProceed = async () => {
    if (!token || !accountId) {
      alert("Session expired.");
      return;
    }
    if (safeIds.length === 0) {
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

      const hasBasePack = selectedPacks.some(
        (p) => Number(p.bouque_type) === 1
      );
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

      safeIds.forEach((id) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = "bouque_ids[]";
        input.value = String(id);
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

  const getBadgeStyle = (type: number) => {
    switch (type) {
      case 0:
        return "bg-orange-50 text-orange-700 border-orange-200";
      case 1:
        return "bg-red-50 text-red-700 border-red-200";
      case 2:
        return "bg-blue-50 text-blue-700 border-blue-200";
      case 3:
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
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
    safeIds.length > 0 &&
    selectedPeriodId !== "" &&
    !submitting &&
    !periodsError &&
    !periodsLoading;

  // ────────────────────────────────────────────────
  // 7️⃣ Render
  // ────────────────────────────────────────────────
  return (
    <>
      <UserHeader />

      {/* ═══════════ FULL-SCREEN LOADING OVERLAY ═══════════ */}
      {loading && (
        <div className="fixed inset-0 z-[60] bg-white/95 backdrop-blur-md flex items-center justify-center">
          <div className="flex flex-col items-center max-w-sm w-full px-6">
            <div className="relative mb-8">
              <div className="w-24 h-24 rounded-full border-4 border-red-100" />
              <div className="absolute inset-0 w-24 h-24 rounded-full border-4 border-transparent border-t-red-600 border-r-red-600 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
                  <RefreshCcw className="w-7 h-7 text-red-600 animate-pulse" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <h2 className="text-lg font-black text-gray-900">
                Loading Packs
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
        <div className="max-w-6xl mx-auto px-4 md:px-8 pt-24">
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
                Pack Management
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
              Renew /{" "}
              <span className="text-red-600">Manage Packs</span>
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Select a pack and choose your recharge period to continue
            </p>
          </div>

          {/* ═══════════ ERRORS ═══════════ */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 mb-4 text-sm font-medium">
              {error}
            </div>
          )}

          {/* ═══════════ TABS ═══════════ */}
          {!loading && (
            <div className="flex gap-2 mb-6 bg-gray-50 p-1.5 rounded-full border border-gray-100 w-full sm:w-fit overflow-x-auto">
              <button
                onClick={() => setActiveTab("active")}
                className={`flex-1 sm:flex-none px-5 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all whitespace-nowrap ${
                  activeTab === "active"
                    ? "bg-red-600 text-white shadow-md shadow-red-200"
                    : "text-gray-600 hover:text-red-600"
                }`}
              >
                Active ({activePacks.length})
              </button>
              <button
                onClick={() => setActiveTab("modify")}
                className={`flex-1 sm:flex-none px-5 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all whitespace-nowrap ${
                  activeTab === "modify"
                    ? "bg-red-600 text-white shadow-md shadow-red-200"
                    : "text-gray-600 hover:text-red-600"
                }`}
              >
                Modify ({availablePacks.length})
              </button>
              <button
                onClick={() => setActiveTab("expired")}
                className={`flex-1 sm:flex-none px-5 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all whitespace-nowrap ${
                  activeTab === "expired"
                    ? "bg-red-600 text-white shadow-md shadow-red-200"
                    : "text-gray-600 hover:text-red-600"
                }`}
              >
                Expired ({expiredPacks.length})
              </button>
            </div>
          )}

          {/* ═══════════ MODIFY LOADING ═══════════ */}
          {!loading && activeTab === "modify" && modifyLoading && (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-100 rounded-2xl p-5 animate-pulse"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-5 h-5 rounded bg-gray-100" />
                    <div className="flex-1">
                      <div className="h-4 w-2/3 bg-gray-100 rounded mb-2" />
                      <div className="h-3 w-1/3 bg-gray-100 rounded" />
                    </div>
                    <div className="w-20 h-8 bg-gray-100 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ═══════════ EMPTY ═══════════ */}
          {!loading &&
            !(activeTab === "modify" && modifyLoading) &&
            currentPacks.length === 0 && (
              <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-16 text-center">
                <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                  <Layers className="w-7 h-7 text-red-500" />
                </div>
                <p className="text-sm font-bold text-gray-900">
                  No {activeTab} packs
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {activeTab === "modify"
                    ? "No alternative base packs available right now"
                    : "Nothing to show here"}
                </p>
              </div>
            )}

          {/* ═══════════ PACK LIST ═══════════ */}
          {!loading &&
            !(activeTab === "modify" && modifyLoading) &&
            currentPacks.length > 0 && (
              <div className="space-y-3">
                {currentPacks.map((pack) => {
                  const isSelected = !!selectedIds[String(pack.bouque_id)];
                  const price = getPrice(pack);
                  const packName = getPackName(pack);

                  return (
                    <div
                      key={pack.bouque_id}
                      onClick={() => toggleSelect(pack.bouque_id)}
                      className={`group relative bg-white border rounded-2xl transition-all duration-300 overflow-hidden cursor-pointer ${
                        isSelected
                          ? "border-red-400 shadow-lg shadow-red-100"
                          : "border-gray-100 hover:border-red-200 hover:shadow-md hover:shadow-red-50/60"
                      }`}
                    >
                      {/* Left accent bar */}
                      <div
                        className={`absolute left-0 top-0 bottom-0 w-1 transition-colors ${
                          isSelected ? "bg-red-600" : "bg-red-100"
                        }`}
                      />

                      <div className="flex items-center gap-4 p-4 md:p-5 pl-5 md:pl-6">
                        {/* Checkbox */}
                        <div
                          className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${
                            isSelected
                              ? "border-red-600 bg-red-600"
                              : "border-gray-300 group-hover:border-red-400"
                          }`}
                        >
                          {isSelected && (
                            <Check size={14} className="text-white" />
                          )}
                        </div>

                        {/* Icon + Info */}
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div
                            className={`hidden sm:flex w-12 h-12 rounded-xl items-center justify-center shrink-0 transition-colors ${
                              isSelected
                                ? "bg-red-600"
                                : "bg-red-50 group-hover:bg-red-100"
                            }`}
                          >
                            <Layers
                              className={`w-6 h-6 transition-colors ${
                                isSelected ? "text-white" : "text-red-600"
                              }`}
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span
                                className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${getBadgeStyle(
                                  Number(pack.bouque_type)
                                )}`}
                              >
                                {getBadgeLabel(Number(pack.bouque_type))}
                              </span>
                              <span className="text-[10px] text-gray-400 font-mono">
                                #{pack.bouque_id}
                              </span>
                              {activeTab !== "modify" && pack.left && (
                                <span className="text-[10px] text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                                  <Clock size={10} />
                                  {pack.left}
                                </span>
                              )}
                            </div>
                            <p className="font-bold text-sm md:text-base text-gray-900 leading-snug line-clamp-2">
                              {packName}
                            </p>
                            <p className="text-[11px] text-gray-400 mt-1">
                              {activeTab === "modify"
                                ? "Available base pack — tap to switch"
                                : `Expires ${formatDate(pack.deactivation_date)}`}
                            </p>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="text-right shrink-0">
                          <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                            Price
                          </p>
                          <p className="text-lg font-black text-red-600 leading-tight">
                            ₹{price.toFixed(0)}
                          </p>
                          <p className="text-[10px] text-gray-400 font-medium">
                            /month
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          {/* ═══════════ RECHARGE PERIODS ═══════════ */}
          {safeIds.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center gap-2 mb-4">
                <CalendarDays className="w-4 h-4 text-red-600" />
                <h2 className="text-lg font-bold text-gray-900">
                  Select Recharge Period
                </h2>
              </div>

              {periodsLoading && (
                <div className="flex items-center justify-center gap-2 py-8 text-gray-500 text-sm">
                  <Loader2 size={18} className="animate-spin text-red-600" />
                  Loading recharge periods...
                </div>
              )}

              {!periodsLoading && periodsError && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 text-sm font-medium">
                  {periodsError}
                </div>
              )}

              {!periodsLoading && !periodsError && periods.length === 0 && (
                <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-8 text-center">
                  <p className="text-sm text-gray-500">
                    No recharge periods available for this pack.
                  </p>
                </div>
              )}

              {!periodsLoading && periods.length > 0 && (
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
                            <p className="text-[11px] text-gray-500 mt-0.5">
                              {period.months} month
                              {period.months > 1 ? "s" : ""} validity
                            </p>
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
              )}
            </div>
          )}
        </div>

        {/* ═══════════ BOTTOM BAR ═══════════ */}
        {safeIds.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 z-40 animate-[slideUp_0.3s_ease-out]">
            <div className="bg-black/95 backdrop-blur-md border-t border-red-500/30 shadow-[0_-8px_24px_rgba(0,0,0,0.4)]">
              <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 px-4 md:px-8 py-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    <p className="text-white font-bold text-base">
                      {safeIds.length} Pack
                      {safeIds.length !== 1 ? "s" : ""} Selected
                    </p>
                  </div>
                  <p className="text-gray-400 text-[12px] truncate">
                    {selectedPacks.map((p) => getPackName(p)).join(" • ")}
                  </p>
                  <p className="text-gray-600 text-[10px] mt-0.5">
                    Network Capacity Fee and GST extra as applicable
                  </p>
                </div>

                <button
                  onClick={handleProceed}
                  disabled={!canProceed}
                  className={`shrink-0 px-8 py-3 rounded-full font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                    !canProceed
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

export default function RenewPacksPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2
              className="animate-spin text-red-600 mb-3"
              size={32}
            />
            <p className="text-sm text-gray-500">Loading...</p>
          </div>
        </div>
      }
    >
      <RenewContent />
    </Suspense>
  );
}
