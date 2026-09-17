

// // Dashboard/page.tsx
// "use client";

// import {
//   Calendar,
//   PlusCircle,
//   RefreshCcw,
//   Receipt,
//   PhoneCall,
//   Wallet,
// } from "lucide-react";
// import { useState, useEffect, useMemo } from "react";
// import { useRouter } from "next/navigation";

// interface AccountBouque {
//   id?: string | number;
//   bouque_id: number;
//   bouque_type: number; // 0=NCF, 1=BASE, 2=ADDON, 3=ALACARTE
//   name?: string;
//   bouque_name?: string;
//   description?: string;
//   amount?: string;
//   mrp?: string;
//   rate?: { mrp: string }[];
//   activation_date?: string;
//   deactivation_date?: string;
//   left?: string;
//   boxtype_lbl?: string;
//   status_lbl?: string;
// }

// export default function DashboardPage() {
//   const router = useRouter();

//   const [username, setUsername] = useState("User");
//   const [isExpired, setIsExpired] = useState(false);
//   const [basePackExpiry, setBasePackExpiry] = useState("");
//   const [activationDate, setActivationDate] = useState("");
//   const [stbno, setStbno] = useState("");
//   const [allPacks, setAllPacks] = useState<AccountBouque[]>([]);
//   const [loading, setLoading] = useState(true);

//   // Load username
//   useEffect(() => {
//     const stored = localStorage.getItem("name") || localStorage.getItem("username");
//     if (stored) setUsername(stored);
//   }, []);

//   // Fetch profile + active packs
//   useEffect(() => {
//     const loadDashboard = async () => {
//       const token = localStorage.getItem("access_token");
//       const subscriberId = localStorage.getItem("subscriberId");
//       const accountId = localStorage.getItem("accountId");

//       if (!token || !subscriberId || !accountId) {
//         setLoading(false);
//         return;
//       }

//       try {
//         // 1️⃣ Profile — for base pack expiry & stbno
//         const profileRes = await fetch(
//           `/api/profile?subscriber_id=${subscriberId}`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         const profileData = await profileRes.json();
//         console.log("[Dashboard] Profile:", profileData);

//         if (
//           profileData.success &&
//           (profileRes.status === 200 || profileRes.status === 201) &&
//           profileData.data?.accounts?.[0]
//         ) {
//           const account = profileData.data.accounts[0];

//           if (account.deactivation_date) {
//             const deactivation = new Date(account.deactivation_date);
//             setBasePackExpiry(account.deactivation_date);
//             setIsExpired(deactivation.getTime() < new Date().getTime());
//           }
//           if (account.activation_date) {
//             setActivationDate(account.activation_date);
//           }
//           if (account.stbno) setStbno(account.stbno);

//           if (account.brand_id) {
//             localStorage.setItem("brandId", String(account.brand_id));
//           }
//           if (profileData.data.profile?.sublocation_details?.operator_id) {
//             localStorage.setItem(
//               "operatorId",
//               String(profileData.data.profile.sublocation_details.operator_id)
//             );
//           }
//         }

//         // 2️⃣ Account-Bouque — for all packs (active + expired)
//         const packsRes = await fetch(
//           `/api/base-packs?subscriber_id=${subscriberId}&account_id=${accountId}`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         const packsData = await packsRes.json();
//         console.log("[Dashboard] Packs:", packsData);

//         if (
//           packsRes.ok &&
//           packsData.success &&
//           Array.isArray(packsData.data)
//         ) {
//           setAllPacks(packsData.data);
//         }
//       } catch (e) {
//         console.error("Dashboard load error:", e);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadDashboard();
//   }, []);

//   // ✅ Active packs = deactivation_date >= now
//   const activePacks = useMemo(() => {
//     const now = new Date().getTime();
//     return allPacks.filter((p) => {
//       const deact = p.deactivation_date
//         ? new Date(p.deactivation_date.split(" ")[0]).getTime()
//         : 0;
//       if (!deact) return true;
//       return deact >= now;
//     });
//   }, [allPacks]);

//   const getPackName = (p: AccountBouque) => {
//     return (
//       p.name?.trim() ||
//       p.bouque_name?.trim() ||
//       p.description?.trim() ||
//       "Pack Name"
//     );
//   };

//   const getPrice = (p: AccountBouque) => {
//     if (p.rate && Array.isArray(p.rate) && p.rate[0]?.mrp) {
//       return parseFloat(p.rate[0].mrp) || 0;
//     }
//     return parseFloat(p.mrp || p.amount || "0") || 0;
//   };

//   const getBadgeLabel = (type: number) => {
//     switch (type) {
//       case 0:
//         return "NCF";
//       case 1:
//         return "BASE";
//       case 2:
//         return "ADDON";
//       case 3:
//         return "ALACARTE";
//       default:
//         return "PACK";
//     }
//   };

//   const getBadgeColor = (type: number) => {
//     switch (type) {
//       case 0:
//         return "bg-orange-500";
//       case 1:
//         return "bg-red-600";
//       case 2:
//         return "bg-blue-600";
//       case 3:
//         return "bg-green-600";
//       default:
//         return "bg-gray-600";
//     }
//   };

//   const formatDate = (str?: string) => {
//     if (!str) return "--";
//     const d = new Date(str.split(" ")[0]);
//     if (isNaN(d.getTime())) return str;
//     return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
//   };

//   return (
//     <div className="min-h-screen bg-[#1c1b20] text-white p-6 md:p-20 mt-[2rem] flex justify-center">
//       <div className="w-full max-w-6xl">
//         <h1 className="text-2xl font-bold text-yellow-400 mb-6">
//           Welcome, {username}
//         </h1>

//         {/* Top Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//           <div className="bg-black text-center p-4 rounded-lg shadow-md">
//             <p className="text-sm text-gray-400">Subscriber Id</p>
//             <p className="font-bold">{stbno || "--"}</p>
//           </div>
//           <div className="bg-black text-center p-4 rounded-lg shadow-md">
//             <p className="text-sm text-gray-400">Last recharged on</p>
//             <p className="font-bold mt-2 text-sm">
//               {formatDate(activationDate)}
//             </p>
//           </div>
//           <div className="bg-black text-center p-4 rounded-lg shadow-md">
//             <p className="text-sm text-gray-400">Last recharge amount</p>
//             <p className="font-bold text-yellow-400">Rs.</p>
//           </div>
//         </div>

//         {/* Middle Row */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//           <div className="bg-black text-center p-4 rounded-lg shadow-md">
//             <p className="text-sm text-gray-400 mb-2">
//               Next Recharge On (Base Pack)
//             </p>
//             <div
//               className={`${
//                 isExpired ? "bg-red-700" : "bg-red-600"
//               } text-white font-bold rounded-md py-4`}
//             >
//               {loading ? "Loading..." : formatDate(basePackExpiry)}
//             </div>
//           </div>

//           {/* Action Button */}
//           <div className="bg-black flex flex-col justify-center items-center p-6 rounded-lg shadow-md">
//             <Wallet className="text-yellow-400 w-8 h-8 mb-2" />
//             {loading ? (
//               <p className="text-gray-400 text-sm">Loading...</p>
//             ) : isExpired ? (
//               <>
//                 <p className="text-red-400 text-xs mb-2 text-center">
//                   Base pack expired on {formatDate(basePackExpiry)}
//                 </p>
//                 <button
//                   onClick={() => router.push("/renew-packs")}
//                   className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2 rounded transition"
//                 >
//                   Renew Now
//                 </button>
//                 <button
//                   onClick={() => router.push("/contact-lco")}
//                   className="bg-gray-700 hover:bg-gray-600 text-white text-xs font-bold px-6 py-2 rounded mt-2 transition"
//                 >
//                   Contact LCO
//                 </button>
//               </>
//             ) : (
//               <>
//                 <p className="text-green-400 text-xs mb-2 text-center">
//                   Active till {formatDate(basePackExpiry)}
//                 </p>
//                 <button
//                   onClick={() => router.push("/add-packs")}
//                   className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6 py-2 rounded transition"
//                 >
//                   Add Packs
//                 </button>
//               </>
//             )}
//           </div>

//           <div className="bg-black p-4 rounded-lg shadow-md">
//             <h3 className="text-sm font-semibold mb-2">
//               LCO Details (For Complaints)
//             </h3>
//             <p>
//               <span className="text-gray-400">Name:</span> demolco
//             </p>
//             <p>
//               <span className="text-gray-400">Phone:</span> 9731093445
//             </p>
//             <p>
//               <span className="text-gray-400">Email:</span> demolco@mail.com
//             </p>
//           </div>
//         </div>

//         {/* Quick Actions */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//           <div
//             onClick={() => {
//               if (isExpired) {
//                 alert("Base pack renew అవసరం. ముందు base pack renew చేయండి.");
//                 router.push("/renew-packs");
//                 return;
//               }
//               router.push("/add-packs");
//             }}
//             className={`bg-black flex flex-col justify-center items-center p-6 rounded-lg shadow-md cursor-pointer transition ${
//               isExpired ? "opacity-50 hover:opacity-70" : "hover:bg-gray-800"
//             }`}
//           >
//             <PlusCircle className="text-red-500 w-10 h-10 mb-2" />
//             <p className="font-semibold">Add New Packs</p>
//           </div>

//           <div
//             onClick={() => router.push("/renew-packs")}
//             className="bg-black flex flex-col justify-center items-center p-6 rounded-lg shadow-md cursor-pointer hover:bg-gray-800 transition"
//           >
//             <RefreshCcw className="text-orange-500 w-10 h-10 mb-2" />
//             <p className="font-semibold">Manage / Renew Packs</p>
//           </div>

//           <div
//             onClick={() => router.push("/transactions")}
//             className="bg-black flex flex-col justify-center items-center p-6 rounded-lg shadow-md cursor-pointer hover:bg-gray-800 transition"
//           >
//             <Receipt className="text-green-500 w-10 h-10 mb-2" />
//             <p className="font-semibold">Transactions &amp; Receipts</p>
//           </div>

//           <div
//             onClick={() => router.push("/contact-lco")}
//             className="bg-black flex flex-col justify-center items-center p-6 rounded-lg shadow-md cursor-pointer hover:bg-gray-800 transition"
//           >
//             <PhoneCall className="text-yellow-400 w-10 h-10 mb-2" />
//             <p className="font-semibold">Contact Your Cable Operator</p>
//           </div>
//         </div>

//         {/* ✅ Active Packs — Horizontal Scroll */}
//         <div>
//           <div className="flex items-center justify-between mb-3">
//             <h2 className="text-lg font-bold text-yellow-400">
//               Active Packs ({activePacks.length})
//             </h2>
//             {activePacks.length > 1 && (
//               <p className="text-[11px] text-gray-500">
//                 ← Scroll sideways →
//               </p>
//             )}
//           </div>

//           {loading && (
//             <div className="bg-black p-6 rounded-lg text-center text-gray-400 text-sm">
//               Loading packs...
//             </div>
//           )}

//           {!loading && activePacks.length === 0 && (
//             <div className="bg-black p-6 rounded-lg text-center text-gray-400 text-sm">
//               No active packs.
//             </div>
//           )}

//           {!loading && activePacks.length > 0 && (
//             <div className="flex gap-3 overflow-x-auto pb-3 scroll-smooth snap-x snap-mandatory">
//               {activePacks.map((pack, idx) => {
//                 const name = getPackName(pack);
//                 const price = getPrice(pack);
//                 const badge = getBadgeLabel(pack.bouque_type);
//                 const badgeColor = getBadgeColor(pack.bouque_type);

//                 return (
//                   <div
//                     key={pack.id ?? `${pack.bouque_id}-${idx}`}
//                     className="min-w-[260px] max-w-[260px] bg-black rounded-lg border border-gray-800 p-4 flex flex-col snap-start shrink-0"
//                   >
//                     {/* Name + Badge */}
//                     <div className="flex items-start justify-between gap-2 mb-3">
//                       <p
//                         className="font-bold text-sm leading-snug text-white line-clamp-2 flex-1"
//                         title={name}
//                       >
//                         {name}
//                       </p>
//                       <span
//                         className={`shrink-0 text-[9px] text-white px-2 py-0.5 rounded font-bold ${badgeColor}`}
//                       >
//                         {badge}
//                       </span>
//                     </div>

//                     {/* Price */}
//                     <p className="text-cyan-400 font-bold text-base mb-3">
//                       ₹ {price.toFixed(2)}/-
//                     </p>

//                     {/* Expiry + Days Left */}
//                     <div className="space-y-1 mt-auto pt-3 border-t border-gray-800">
//                       <div className="flex justify-between text-[11px]">
//                         <span className="text-gray-500">Expiry Date</span>
//                         <span className="text-gray-200 font-semibold">
//                           {formatDate(pack.deactivation_date)}
//                         </span>
//                       </div>
//                       <div className="flex justify-between text-[11px]">
//                         <span className="text-gray-500">Days Left</span>
//                         <span
//                           className={`font-semibold ${
//                             pack.left === "0 Days"
//                               ? "text-red-400"
//                               : "text-green-400"
//                           }`}
//                         >
//                           {pack.left || "--"}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }



// app/dashboard/page.tsx
"use client";

import {
  PlusCircle,
  RefreshCcw,
  Receipt,
  PhoneCall,
  Wallet,
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
  const [stbno, setStbno] = useState("");
  const [allPacks, setAllPacks] = useState<AccountBouque[]>([]);
  const [loading, setLoading] = useState(true);

  // Load username
  useEffect(() => {
    const stored =
      localStorage.getItem("name") || localStorage.getItem("username");
    if (stored) setUsername(stored);
  }, []);

  // Fetch profile + all packs
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
          profileData.data?.accounts?.[0]
        ) {
          const account = profileData.data.accounts[0];
          if (account.stbno) setStbno(account.stbno);
          if (account.brand_id) {
            localStorage.setItem("brandId", String(account.brand_id));
          }
          if (profileData.data.profile?.sublocation_details?.operator_id) {
            localStorage.setItem(
              "operatorId",
              String(profileData.data.profile.sublocation_details.operator_id)
            );
          }
        }

        const packsRes = await fetch(
          `/api/base-packs?subscriber_id=${subscriberId}&account_id=${accountId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const packsData = await packsRes.json();
        console.log("[Dashboard] Packs:", packsData);

        if (
          packsRes.ok &&
          packsData.success &&
          Array.isArray(packsData.data)
        ) {
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

  // Base pack (bouque_type === 1) — latest by deactivation_date
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

  // Last recharge date
  const lastRechargeDate = useMemo(() => {
    if (allPacks.length === 0) return "";
    const sorted = [...allPacks].sort((a, b) => {
      const da = a.activation_date
        ? new Date(a.activation_date).getTime()
        : 0;
      const db = b.activation_date
        ? new Date(b.activation_date).getTime()
        : 0;
      return db - da;
    });
    return sorted[0]?.activation_date || "";
  }, [allPacks]);

  // Active packs
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

  // Helpers
  const getPackName = (p: AccountBouque) => {
    return (
      p.name?.trim() ||
      p.bouque_name?.trim() ||
      p.description?.trim() ||
      "Pack Name"
    );
  };

  const getPrice = (p: AccountBouque) => {
    if (p.rate && Array.isArray(p.rate) && p.rate[0]?.mrp) {
      return parseFloat(p.rate[0].mrp) || 0;
    }
    return parseFloat(p.mrp || p.amount || "0") || 0;
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

  const formatDate = (str?: string) => {
    if (!str) return "--";
    const d = new Date(str.split(" ")[0]);
    if (isNaN(d.getTime())) return str;
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  return (
    <div className="min-h-screen bg-[#1c1b20] text-white p-6 md:p-20 mt-[2rem] flex justify-center">
      <div className="w-full max-w-6xl">
        <h1 className="text-2xl font-bold text-yellow-400 mb-6">
          Welcome, {username}
        </h1>

        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-black text-center p-4 rounded-lg shadow-md">
            <p className="text-sm text-gray-400">Subscriber Id</p>
            <p className="font-bold">{stbno || "--"}</p>
          </div>
          <div className="bg-black text-center p-4 rounded-lg shadow-md">
            <p className="text-sm text-gray-400">Last recharged on</p>
            <p className="font-bold mt-2 text-sm">
              {loading ? "Loading..." : formatDate(lastRechargeDate)}
            </p>
          </div>
          <div className="bg-black text-center p-4 rounded-lg shadow-md">
            <p className="text-sm text-gray-400">Last recharge amount</p>
            <p className="font-bold text-yellow-400">Rs.</p>
          </div>
        </div>

        {/* Middle Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Next Recharge On */}
          <div className="bg-black text-center p-4 rounded-lg shadow-md">
            <p className="text-sm text-gray-400 mb-2">
              Next Recharge On (Base Pack)
            </p>
            <div
              className={`${
                isExpired ? "bg-red-700" : "bg-red-600"
              } text-white font-bold rounded-md py-4`}
            >
              {loading ? "Loading..." : formatDate(basePackExpiry)}
            </div>
            {basePack && (
              <p className="text-[11px] text-gray-500 mt-2">{basePackName}</p>
            )}
          </div>

          {/* ✅ Recharge Now Card — replaces status text & Add Packs button */}
          <div className="bg-black flex flex-col justify-center items-center p-6 rounded-lg shadow-md">
            <Wallet className="text-yellow-400 w-8 h-8 mb-3" />
            <button
              onClick={() => router.push("/renew-packs")}
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-md transition shadow-lg shadow-red-900/40"
            >
              Recharge Now
            </button>
          </div>

          {/* LCO Details */}
          <div className="bg-black p-4 rounded-lg shadow-md">
            <h3 className="text-sm font-semibold mb-2">
              LCO Details (For Complaints)
            </h3>
            <p>
              <span className="text-gray-400">Name:</span> demolco
            </p>
            <p>
              <span className="text-gray-400">Phone:</span> 9731093445
            </p>
            <p>
              <span className="text-gray-400">Email:</span> demolco@mail.com
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div
            onClick={() => {
              if (isExpired) {
                alert(
                  "Base pack renew అవసరం. ముందు base pack renew చేయండి."
                );
                router.push("/renew-packs");
                return;
              }
              router.push("/add-packs");
            }}
            className={`bg-black flex flex-col justify-center items-center p-6 rounded-lg shadow-md cursor-pointer transition ${
              isExpired ? "opacity-50 hover:opacity-70" : "hover:bg-gray-800"
            }`}
          >
            <PlusCircle className="text-red-500 w-10 h-10 mb-2" />
            <p className="font-semibold">Add New Packs</p>
          </div>

          <div
            onClick={() => router.push("/renew-packs")}
            className="bg-black flex flex-col justify-center items-center p-6 rounded-lg shadow-md cursor-pointer hover:bg-gray-800 transition"
          >
            <RefreshCcw className="text-orange-500 w-10 h-10 mb-2" />
            <p className="font-semibold">Manage / Renew Packs</p>
          </div>

          <div
            onClick={() => router.push("/transactions")}
            className="bg-black flex flex-col justify-center items-center p-6 rounded-lg shadow-md cursor-pointer hover:bg-gray-800 transition"
          >
            <Receipt className="text-green-500 w-10 h-10 mb-2" />
            <p className="font-semibold">Transactions &amp; Receipts</p>
          </div>

          <div
            onClick={() => router.push("/contact-lco")}
            className="bg-black flex flex-col justify-center items-center p-6 rounded-lg shadow-md cursor-pointer hover:bg-gray-800 transition"
          >
            <PhoneCall className="text-yellow-400 w-10 h-10 mb-2" />
            <p className="font-semibold">Contact Your Cable Operator</p>
          </div>
        </div>

        {/* Active Packs — Horizontal Scroll */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-yellow-400">
              Active Packs ({activePacks.length})
            </h2>
            {activePacks.length > 1 && (
              <p className="text-[11px] text-gray-500">← Scroll sideways →</p>
            )}
          </div>

          {loading && (
            <div className="bg-black p-6 rounded-lg text-center text-gray-400 text-sm">
              Loading packs...
            </div>
          )}

          {!loading && activePacks.length === 0 && (
            <div className="bg-black p-6 rounded-lg text-center text-gray-400 text-sm">
              No active packs.
            </div>
          )}

          {!loading && activePacks.length > 0 && (
            <div className="flex gap-3 overflow-x-auto pb-3 scroll-smooth snap-x snap-mandatory">
              {activePacks.map((pack, idx) => {
                const name = getPackName(pack);
                const price = getPrice(pack);
                const badge = getBadgeLabel(pack.bouque_type);
                const badgeColor = getBadgeColor(pack.bouque_type);

                return (
                  <div
                    key={pack.id ?? `${pack.bouque_id}-${idx}`}
                    className="min-w-[260px] max-w-[260px] bg-black rounded-lg border border-gray-800 p-4 flex flex-col snap-start shrink-0"
                  >
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <p
                        className="font-bold text-sm leading-snug text-white line-clamp-2 flex-1"
                        title={name}
                      >
                        {name}
                      </p>
                      <span
                        className={`shrink-0 text-[9px] text-white px-2 py-0.5 rounded font-bold ${badgeColor}`}
                      >
                        {badge}
                      </span>
                    </div>

                    <p className="text-cyan-400 font-bold text-base mb-3">
                      ₹ {price.toFixed(2)}/-
                    </p>

                    <div className="space-y-1 mt-auto pt-3 border-t border-gray-800">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-gray-500">Expiry Date</span>
                        <span className="text-gray-200 font-semibold">
                          {formatDate(pack.deactivation_date)}
                        </span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-gray-500">Days Left</span>
                        <span
                          className={`font-semibold ${
                            pack.left === "0 Days"
                              ? "text-red-400"
                              : "text-green-400"
                          }`}
                        >
                          {pack.left || "--"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
