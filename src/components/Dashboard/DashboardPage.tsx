// app/dashboard/page.tsx
"use client";

import {
  PlusCircle,
  RefreshCcw,
  Receipt,
  PhoneCall,
  Wallet,
  CalendarDays,
  User,
  Mail,
  Phone,
  IndianRupee,
  Calendar,
  Clock,
  Building2,
  Sparkles,
  ChevronRight,
  ArrowUpRight,
  Activity,
  TrendingUp,
  Radio,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

interface AccountBouque {
  id?: string | number;
  bouque_id: number;
  bouque_type: number;
  name?: string;
  bouque_name?: string;
  description?: string;
  amount?: string;
  mrp?: string;
  tax?: string;
  rate?: { mrp: string }[];
  activation_date?: string;
  deactivation_date?: string;
  left?: string;
  boxtype_lbl?: string;
  status_lbl?: string;
}

export default function DashboardPage() {
  const router = useRouter();

  const [username, setUsername] = useState("User");
  const [profileName, setProfileName] = useState("");
  const [stbno, setStbno] = useState("");
  const [allPacks, setAllPacks] = useState<AccountBouque[]>([]);
  const [loading, setLoading] = useState(true);

  const [lcoDetails, setLcoDetails] = useState({
    operator: "",
    name: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    const stored =
      localStorage.getItem("name") || localStorage.getItem("username");
    if (stored) setUsername(stored);

    const cachedProfileName = localStorage.getItem("profileName");
    if (cachedProfileName) setProfileName(cachedProfileName);

    const cachedOperator = localStorage.getItem("lcoOperator");
    const cachedName = localStorage.getItem("lcoName");
    const cachedPhone = localStorage.getItem("lcoPhone");
    const cachedEmail = localStorage.getItem("lcoEmail");
    if (cachedOperator || cachedName || cachedPhone || cachedEmail) {
      setLcoDetails({
        operator: cachedOperator || "",
        name: cachedName || "",
        phone: cachedPhone || "",
        email: cachedEmail || "",
      });
    }
  }, []);

  useEffect(() => {
    const loadDashboard = async () => {
      const token = localStorage.getItem("access_token");
      const subscriberId = localStorage.getItem("subscriberId");
      const accountId = localStorage.getItem("accountId");

      if (!token || !subscriberId || !accountId) {
        setLoading(false);
        return;
      }

      try {
        const profileRes = await fetch(
          `/api/profile?subscriber_id=${subscriberId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const profileData = await profileRes.json();
        console.log("[Dashboard] Profile:", profileData);

        if (
          profileData.success &&
          (profileRes.status === 200 || profileRes.status === 201) &&
          profileData.data
        ) {
          const account = profileData.data.accounts?.[0];
          if (account) {
            if (account.stbno) setStbno(account.stbno);
            if (account.brand_id) {
              localStorage.setItem("brandId", String(account.brand_id));
            }
          }

          const profile = profileData.data.profile;
          const sublocation = profile?.sublocation_details;

          if (sublocation?.operator_id) {
            localStorage.setItem(
              "operatorId",
              String(sublocation.operator_id)
            );
          }

          if (profile) {
            if (profile.name) {
              setProfileName(profile.name);
              localStorage.setItem("profileName", profile.name);
            }

            const newLco = {
              operator: profile.operator || "",
              name: profile.name || "",
              phone: profile.operator_contactno || profile.mobile_no || "",
              email: profile.email || "",
            };
            setLcoDetails(newLco);
            localStorage.setItem("lcoOperator", newLco.operator);
            localStorage.setItem("lcoName", newLco.name);
            localStorage.setItem("lcoPhone", newLco.phone);
            localStorage.setItem("lcoEmail", newLco.email);
          }
        }

        const packsRes = await fetch(
          `/api/base-packs?subscriber_id=${subscriberId}&account_id=${accountId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const packsData = await packsRes.json();
        console.log("[Dashboard] Packs:", packsData);

        if (packsRes.ok && packsData.success && Array.isArray(packsData.data)) {
          setAllPacks(packsData.data);
        }
      } catch (e) {
        console.error("Dashboard load error:", e);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const basePack = useMemo(() => {
    const basePacks = allPacks.filter((p) => p.bouque_type === 1);
    if (basePacks.length === 0) return null;
    return basePacks.sort((a, b) => {
      const da = a.deactivation_date
        ? new Date(a.deactivation_date).getTime()
        : 0;
      const db = b.deactivation_date
        ? new Date(b.deactivation_date).getTime()
        : 0;
      return db - da;
    })[0];
  }, [allPacks]);

  const basePackExpiry = basePack?.deactivation_date || "";
  const basePackName = basePack?.name || "Base Pack";

  const isExpired = useMemo(() => {
    if (!basePackExpiry) return false;
    const deact = new Date(basePackExpiry.split(" ")[0]).getTime();
    return deact < new Date().getTime();
  }, [basePackExpiry]);

  const latestPack = useMemo(() => {
    if (allPacks.length === 0) return null;
    const sorted = [...allPacks].sort((a, b) => {
      const da = a.activation_date ? new Date(a.activation_date).getTime() : 0;
      const db = b.activation_date ? new Date(b.activation_date).getTime() : 0;
      return db - da;
    });
    return sorted[0] || null;
  }, [allPacks]);

  const lastRechargeDate = latestPack?.activation_date || "";

  const activePacks = useMemo(() => {
    const now = new Date().getTime();
    return allPacks.filter((p) => {
      const deact = p.deactivation_date
        ? new Date(p.deactivation_date.split(" ")[0]).getTime()
        : 0;
      if (!deact) return true;
      return deact >= now;
    });
  }, [allPacks]);

  const getPackName = (p: AccountBouque) => {
    return (
      p.name?.trim() ||
      p.bouque_name?.trim() ||
      p.description?.trim() ||
      "Pack Name"
    );
  };

  const getPackTypeLabel = (type: number) => {
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

  const getPackTypeColor = (type: number) => {
    switch (type) {
      case 0:
        return {
          dot: "bg-orange-500",
          text: "text-orange-700",
          bg: "bg-orange-50",
        };
      case 1:
        return {
          dot: "bg-red-500",
          text: "text-red-700",
          bg: "bg-red-50",
        };
      case 2:
        return {
          dot: "bg-blue-500",
          text: "text-blue-700",
          bg: "bg-blue-50",
        };
      case 3:
        return {
          dot: "bg-emerald-500",
          text: "text-emerald-700",
          bg: "bg-emerald-50",
        };
      default:
        return {
          dot: "bg-gray-500",
          text: "text-gray-700",
          bg: "bg-gray-50",
        };
    }
  };

  const formatDate = (str?: string) => {
    if (!str) return "--";
    const d = new Date(str.split(" ")[0]);
    if (isNaN(d.getTime())) return str;
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  const getDaysRemaining = (deactivation?: string) => {
    if (!deactivation) return 0;
    const deact = new Date(deactivation.split(" ")[0]).getTime();
    const now = new Date().getTime();
    const diff = Math.ceil((deact - now) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const getProgressPercent = (pack: AccountBouque) => {
    const days = getDaysRemaining(pack.deactivation_date);
    if (days <= 0) return 0;
    if (days >= 30) return 100;
    return Math.round((days / 30) * 100);
  };

  const stats = [
    {
      label: "Subscriber ID",
      value: stbno || "--",
      icon: User,
    },
    {
      label: "Last Recharged",
      value: loading ? "..." : formatDate(lastRechargeDate),
      icon: Calendar,
    },
    {
      label: "Last Amount",
      icon: IndianRupee,
      highlight: true,
    },
    {
      label: "Active Packs",
      value: loading ? "..." : String(activePacks.length),
      icon: Radio,
    },
  ];

  return (
    <>
      {/* ═══════════ SIMPLE BORDER HIGHLIGHT ANIMATION ═══════════ */}
      <style jsx global>{`
        @keyframes simplePulse {
          0%,
          100% {
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.6);
          }
          50% {
            box-shadow: 0 0 0 6px rgba(239, 68, 68, 0);
          }
        }

        @keyframes arrowFly {
          0% {
            transform: translate(0, 0);
            opacity: 1;
          }
          50% {
            transform: translate(4px, -4px);
            opacity: 0.6;
          }
          100% {
            transform: translate(0, 0);
            opacity: 1;
          }
        }

        .recharge-simple-pulse {
          animation: simplePulse 1.8s ease-out infinite;
        }

        .arrow-fly {
          animation: arrowFly 1.4s ease-in-out infinite;
        }
      `}</style>

      <div className="min-h-screen bg-white text-gray-900 pb-16 mt-[5rem]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6">
          {/* ═══════════ Top Greeting Bar ═══════════ */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 mt-[3rem]">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
                Hey,{" "}
                <span className="text-red-600">{profileName || username}</span>
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage your cable TV account & packs from one place
              </p>
            </div>

            {/* ✅ SIMPLE BORDER HIGHLIGHT BUTTON */}
            <button
              onClick={() => router.push("/recharge-period")}
              className="recharge-simple-pulse group self-start md:self-auto flex items-center gap-2 bg-gradient-to-r from-red-600 via-red-500 to-orange-500 hover:from-red-500 hover:via-red-400 hover:to-orange-400 text-white font-bold px-6 py-3 rounded-full transition-all shadow-lg shadow-red-200"
            >
              <Wallet className="w-4 h-4" />
              Quick Recharge
              <ArrowUpRight className="arrow-fly w-4 h-4" />
            </button>
          </div>

          {/* ═══════════ Hero Banner Strip ═══════════ */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-600 via-red-500 to-orange-500 p-6 md:p-8 mb-6 shadow-xl shadow-red-100">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-white rounded-full" />
              <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-white rounded-full" />
            </div>

            <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="text-white">
                <p className="text-xs uppercase tracking-widest font-bold text-white/80 mb-1">
                  Base Pack Expires On
                </p>
                <div className="flex items-baseline gap-3">
                  <p className="text-3xl md:text-4xl font-black">
                    {loading ? "..." : formatDate(basePackExpiry)}
                  </p>
                  {!loading && basePack && (
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        isExpired
                          ? "bg-black/30 text-white"
                          : "bg-white/20 text-white"
                      }`}
                    >
                      {isExpired
                        ? "Expired"
                        : `${getDaysRemaining(basePackExpiry)} days left`}
                    </span>
                  )}
                </div>
                <p className="text-xs text-white/80 mt-2 font-medium">
                  {basePackName}
                </p>
              </div>

              <div className="flex items-center gap-6 text-white">
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-white/70 mb-1">
                    Total Active
                  </p>
                  <p className="text-2xl font-black">
                    {activePacks.length}
                    <span className="text-sm font-medium text-white/80 ml-1">
                      packs
                    </span>
                  </p>
                </div>
                <div className="w-px h-10 bg-white/30" />
              </div>
            </div>
          </div>

          {/* ═══════════ Inline Stats Strip ═══════════ */}
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100 bg-white border border-gray-100 rounded-2xl mb-6 shadow-sm overflow-hidden">
            {stats.map((s, i) => {
              const Icon = s.icon;
              return (
                <div
                  key={i}
                  className="flex items-center gap-3 px-4 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      s.highlight
                        ? "bg-red-600 text-white shadow-md shadow-red-200"
                        : "bg-red-50 text-red-600"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                      {s.label}
                    </p>
                    <p
                      className={`text-sm font-bold truncate ${
                        s.highlight ? "text-red-600" : "text-gray-900"
                      }`}
                    >
                      {s.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ═══════════ Main Split Layout ═══════════ */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ▓▓▓ LEFT Column ▓▓▓ */}
            <div className="lg:col-span-2">
              {/* ✅ 1st: Quick Actions */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-red-600" />
                  <h2 className="text-lg font-bold text-gray-900">
                    Quick Actions
                  </h2>
                </div>

                <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden divide-y divide-gray-50 shadow-sm">
                  {[
                    {
                      icon: PlusCircle,
                      label: "Add New Packs",
                      desc: "Browse & add channels to your subscription",
                      path: "/add-packs",
                    },
                    {
                      icon: RefreshCcw,
                      label: "Manage Packs",
                      desc: "Renew, modify, or remove existing packs",
                      path: "/renew-packs",
                    },
                    {
                      icon: Receipt,
                      label: "Transactions",
                      desc: "View your complete payment history",
                      path: "/transactions",
                    },
                    {
                      icon: PhoneCall,
                      label: "Contact LCO",
                      desc: "Get support from your cable operator",
                      path: "/contact-lco",
                    },
                  ].map((action, i) => {
                    const Icon = action.icon;
                    return (
                      <div
                        key={i}
                        onClick={() => {
                          if (action.path === "/add-packs" && isExpired) {
                            alert(
                              "Base pack renew అవసరం. ముందు base pack renew చేయండి."
                            );
                            router.push("/renew-packs");
                            return;
                          }
                          router.push(action.path);
                        }}
                        className="group relative flex items-center gap-4 px-5 py-4 cursor-pointer transition-all duration-300 hover:bg-gradient-to-r hover:from-red-600 hover:via-red-500 hover:to-orange-500"
                      >
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-black scale-y-0 group-hover:scale-y-100 origin-center transition-transform duration-300" />

                        <div className="w-10 h-10 rounded-xl bg-red-50 group-hover:bg-white/20 flex items-center justify-center shrink-0 transition-colors duration-300 shadow-sm group-hover:shadow-md group-hover:shadow-red-900/30 backdrop-blur-sm">
                          <Icon className="w-5 h-5 text-red-600 group-hover:text-white transition-colors duration-300" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm text-gray-900 group-hover:text-white transition-colors duration-300">
                            {action.label}
                          </p>
                          <p className="text-xs text-gray-500 group-hover:text-white/90 transition-colors duration-300 truncate">
                            {action.desc}
                          </p>
                        </div>

                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-white group-hover:translate-x-1 transition-all duration-300 shrink-0" />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ✅ 2nd: Active Packs */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-red-600" />
                    <h2 className="text-lg font-bold text-gray-900">
                      Active Packs
                    </h2>
                    <span className="text-xs font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
                      {activePacks.length}
                    </span>
                  </div>
                  <button
                    onClick={() => router.push("/add-packs")}
                    className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
                  >
                    + Add more
                  </button>
                </div>

                {loading && (
                  <div className="space-y-3">
                    {[1, 2].map((i) => (
                      <div
                        key={i}
                        className="bg-white border border-gray-100 rounded-xl p-5 animate-pulse"
                      >
                        <div className="h-4 w-2/3 bg-gray-100 rounded mb-3" />
                        <div className="h-2 w-full bg-gray-100 rounded" />
                      </div>
                    ))}
                  </div>
                )}

                {!loading && activePacks.length === 0 && (
                  <div className="bg-red-50/50 border-2 border-dashed border-red-200 rounded-2xl p-10 text-center">
                    <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-7 h-7 text-red-500" />
                    </div>
                    <p className="text-sm font-bold text-gray-900">
                      No active packs
                    </p>
                    <p className="text-xs text-gray-500 mt-1 mb-4">
                      Recharge now to activate your first pack
                    </p>
                    <button
                      onClick={() => router.push("/recharge-period")}
                      className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-5 py-2 rounded-full"
                    >
                      Recharge Now
                    </button>
                  </div>
                )}

                {!loading && activePacks.length > 0 && (
                  <div className="space-y-3">
                    {activePacks.map((pack, idx) => {
                      const name = getPackName(pack);
                      const typeLabel = getPackTypeLabel(pack.bouque_type);
                      const colors = getPackTypeColor(pack.bouque_type);
                      const daysLeft = getDaysRemaining(pack.deactivation_date);
                      const progress = getProgressPercent(pack);

                      return (
                        <div
                          key={pack.id ?? `${pack.bouque_id}-${idx}`}
                          className="group relative bg-white border border-gray-100 hover:border-red-200 rounded-2xl p-4 md:p-5 transition-all duration-300 hover:shadow-lg hover:shadow-red-50/50"
                        >
                          <div
                            className={`absolute left-0 top-4 bottom-4 w-1 rounded-r-full ${colors.dot}`}
                          />

                          <div className="flex flex-col md:flex-row md:items-center gap-4 pl-3">
                            <div className="flex items-start gap-3 flex-1 min-w-0">
                              <div
                                className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${colors.bg}`}
                              >
                                <Radio className={`w-5 h-5 ${colors.text}`} />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span
                                    className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}
                                  >
                                    {typeLabel}
                                  </span>
                                  <span className="text-[10px] text-gray-400 font-mono">
                                    #{pack.bouque_id}
                                  </span>
                                </div>
                                <p className="font-bold text-sm text-gray-900 truncate">
                                  {name}
                                </p>
                                <div className="flex items-center gap-3 mt-1 text-[11px] text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    Expires{" "}
                                    {formatDate(pack.deactivation_date)}
                                  </span>
                                  <span
                                    className={`font-bold ${
                                      daysLeft <= 3
                                        ? "text-red-600"
                                        : "text-emerald-600"
                                    }`}
                                  >
                                    • {daysLeft} days left
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="md:w-32 shrink-0">
                              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                                <span>Cycle</span>
                                <span>{progress}%</span>
                              </div>
                              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-700 ${
                                    progress <= 15
                                      ? "bg-red-500"
                                      : progress <= 40
                                      ? "bg-orange-500"
                                      : "bg-gradient-to-r from-red-500 to-orange-500"
                                  }`}
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* ▓▓▓ RIGHT: LCO Sidebar ▓▓▓ */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-4 h-4 text-red-600" />
                <h2 className="text-lg font-bold text-gray-900">Your LCO</h2>
              </div>

              {/* LCO Profile Panel */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 p-6 mb-4 text-white">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/20 rounded-full blur-3xl -mr-10 -mt-10" />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-14 h-14 rounded-2xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-900/50">
                      <Building2 className="w-7 h-7 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-widest font-bold text-red-400">
                        Cable Operator
                      </p>
                      <p className="text-lg font-bold truncate">
                        {lcoDetails.operator || "--"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-red-400 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] uppercase tracking-widest text-white/50 font-bold">
                          Subscriber
                        </p>
                        <p className="text-sm font-semibold truncate">
                          {lcoDetails.name || "--"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-red-400 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] uppercase tracking-widest text-white/50 font-bold">
                          Phone
                        </p>
                        <p className="text-sm font-semibold truncate">
                          {lcoDetails.phone || "--"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-red-400 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] uppercase tracking-widest text-white/50 font-bold">
                          Email
                        </p>
                        <p className="text-sm font-semibold truncate">
                          {lcoDetails.email || "--"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => router.push("/contact-lco")}
                    className="mt-5 w-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    Contact Operator
                  </button>
                </div>
              </div>

              {/* Recharge Reminder Panel */}
              <div className="bg-red-50 border border-red-100 rounded-2xl p-5 mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center shrink-0 shadow-md shadow-red-200">
                    <CalendarDays className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-red-600">
                      Next Recharge
                    </p>
                    <p className="text-xl font-black text-gray-900 mt-0.5">
                      {loading ? "..." : formatDate(basePackExpiry)}
                    </p>
                    <p className="text-xs text-gray-600 mt-1 truncate">
                      {basePackName}
                    </p>
                    {!loading && basePack && (
                      <span
                        className={`inline-block mt-2 text-[10px] font-bold px-2 py-1 rounded-full ${
                          isExpired
                            ? "bg-red-600 text-white"
                            : "bg-white text-red-600 border border-red-200"
                        }`}
                      >
                        {isExpired
                          ? "Expired"
                          : `${getDaysRemaining(basePackExpiry)} days left`}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Tip Panel */}
              <div className="bg-white border border-gray-100 rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900 mb-1">
                      Pro Tip
                    </p>
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      Recharge before expiry to avoid service interruption and
                      keep your favourite channels active.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
