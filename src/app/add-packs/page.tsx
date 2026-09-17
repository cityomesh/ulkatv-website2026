// // app/add-packs/page.tsx
// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { Search, Info } from "lucide-react";
// import UserHeader from "../../components/UserHeader";

// interface Pack {
//   id: number;
//   mrp: string;
//   description: string;
//   boxtype_lbl: string;
// }

// export default function AddPacksPage() {
//   const router = useRouter();
//   const [activeTab, setActiveTab] = useState<"addon" | "alacarte">("addon");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [addons, setAddons] = useState<Pack[]>([]);
//   const [alacartes, setAlacartes] = useState<Pack[]>([]);
//   const [selectedIds, setSelectedIds] = useState<Record<number, boolean>>({});
//   const [error, setError] = useState<string | null>(null);

//   const subscriberId = typeof window !== "undefined" ? localStorage.getItem("subscriberId") || "" : "";
//   const accountId = typeof window !== "undefined" ? localStorage.getItem("accountId") || "" : "";
//   const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

//   useEffect(() => {
//     if (!token) {
//       setError("You are not logged in.");
//       setLoading(false);
//       return;
//     }
//     if (!subscriberId || !accountId) {
//       setError("Subscriber or Account ID missing. Please log in again.");
//       setLoading(false);
//       return;
//     }

//     const loadData = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const addonRes = await fetch(
//           `/api/addon/list?subscriber_id=${subscriberId}&account_id=${accountId}`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         const addonData = await addonRes.json();
//         if (addonRes.ok && addonData.success && Array.isArray(addonData.data)) {
//           setAddons(addonData.data);
//         } else setAddons([]);

//         const alacarteRes = await fetch(
//           `/api/alacarte/list?subscriber_id=${subscriberId}&account_id=${accountId}`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         const alacarteData = await alacarteRes.json();
//         if (alacarteRes.ok && alacarteData.success && Array.isArray(alacarteData.data)) {
//           setAlacartes(alacarteData.data);
//         } else setAlacartes([]);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "Something went wrong.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadData();
//   }, [subscriberId, accountId, token]);

//   const toggleSelect = (id: number) => {
//     setSelectedIds((prev) => ({ ...prev, [id]: !prev[id] }));
//   };

//   const getFilteredData = () => {
//     const data = activeTab === "addon" ? addons : alacartes;
//     if (!Array.isArray(data)) return [];
//     if (!searchTerm.trim()) return data;
//     return data.filter((item) =>
//       item.description?.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   };

//   const filteredData = getFilteredData();

//   const handleProceed = () => {
//     const ids = Object.keys(selectedIds).filter((k) => selectedIds[Number(k)]).map(Number);
//     if (ids.length === 0) return alert("Please select at least one pack.");
//     router.push(`/checkout?ids=${ids.join(",")}&type=${activeTab}`);
//   };

//   return (
//     <>
//       {/* ✅ Only UserHeader - no website header here */}
//       <UserHeader />

//       <div className="min-h-screen bg-[#1c1b20] text-white px-4 md:px-8 pt-24 pb-32">
//         <div className="max-w-7xl mx-auto">
//           <h1 className="text-2xl font-bold text-yellow-400 mb-6">Add New Packs</h1>

//           {error && (
//             <div className="bg-red-950 border border-red-700 rounded-md p-4 text-red-400 mb-4">
//               {error}
//             </div>
//           )}

//           {/* Tabs */}
//           <div className="flex border-b border-gray-700 mb-4">
//             <button
//               onClick={() => setActiveTab("addon")}
//               className={`px-4 py-2 font-semibold ${
//                 activeTab === "addon"
//                   ? "text-yellow-400 border-b-2 border-yellow-400"
//                   : "text-gray-400 hover:text-white"
//               }`}
//             >
//               Add-ons
//             </button>
//             <button
//               onClick={() => setActiveTab("alacarte")}
//               className={`px-4 py-2 font-semibold ${
//                 activeTab === "alacarte"
//                   ? "text-yellow-400 border-b-2 border-yellow-400"
//                   : "text-gray-400 hover:text-white"
//               }`}
//             >
//               Ala-Carte
//             </button>
//           </div>

//           {/* Search */}
//           <div className="relative mb-6">
//             <input
//               type="text"
//               placeholder="Search packs..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full p-3 pl-10 bg-black border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
//             />
//             <Search className="absolute left-3 top-3 text-gray-400" size={20} />
//           </div>

//           {loading && <div className="text-center py-8">Loading packs...</div>}
//           {!loading && !error && filteredData.length === 0 && (
//             <div className="text-center py-8 text-gray-400">No packs available.</div>
//           )}

//           {/* ✅ 6 CARDS PER ROW - equal width & height */}
//           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-24">
//             {filteredData.map((pack) => {
//               const isSelected = !!selectedIds[pack.id];
//               const price = parseFloat(pack.mrp) || 0;
//               return (
//                 <div
//                   key={pack.id}
//                   onClick={() => toggleSelect(pack.id)}
//                   className={`relative bg-black rounded-lg border-2 cursor-pointer transition flex flex-col justify-between p-4 h-48 ${
//                     isSelected
//                       ? "border-yellow-400 shadow-lg shadow-yellow-500/20"
//                       : "border-gray-800 hover:border-gray-600"
//                   }`}
//                 >
//                   <div className="flex justify-between items-start">
//                     <input
//                       type="checkbox"
//                       checked={isSelected}
//                       onChange={() => {}}
//                       className="w-5 h-5 accent-yellow-400 cursor-pointer"
//                     />
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         alert(`Details for ${pack.description}`);
//                       }}
//                       className="text-gray-400 hover:text-white"
//                     >
//                       <Info size={18} />
//                     </button>
//                   </div>

//                   <div className="flex-1 flex items-center my-2">
//                     <p
//                       className="font-semibold text-sm leading-snug line-clamp-3"
//                       title={pack.description}
//                     >
//                       {pack.description}
//                     </p>
//                   </div>

//                   <div className="flex flex-col gap-2">
//                     <span className="text-[10px] bg-gray-800 px-2 py-1 rounded-full text-gray-300 self-start">
//                       {pack.boxtype_lbl}
//                     </span>
//                     <span className="text-base font-bold text-yellow-400">
//                       ₹ {price.toFixed(2)}
//                     </span>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//           {/* Bottom bar */}
//           <div className="fixed bottom-0 left-0 right-0 bg-black p-4 border-t border-gray-700 z-40">
//             <div className="max-w-7xl mx-auto flex justify-between items-center">
//               <span className="text-sm text-gray-400">
//                 {Object.values(selectedIds).filter(Boolean).length} pack(s) selected
//               </span>
//               <button
//                 onClick={handleProceed}
//                 className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-2 rounded-md transition"
//               >
//                 Proceed to Pay
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );



// app/add-packs/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Info, Check } from "lucide-react";
import UserHeader from "../../components/UserHeader";

interface Pack {
  id: number;
  mrp: string;
  rate?: { mrp: string }[];
  description: string;
  boxtype_lbl: string;
}

export default function AddPacksPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"addon" | "alacarte">("addon");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [addons, setAddons] = useState<Pack[]>([]);
  const [alacartes, setAlacartes] = useState<Pack[]>([]);
  const [selectedIds, setSelectedIds] = useState<Record<number, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  const subscriberId =
    typeof window !== "undefined"
      ? localStorage.getItem("subscriberId") || ""
      : "";
  const accountId =
    typeof window !== "undefined"
      ? localStorage.getItem("accountId") || ""
      : "";
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("access_token")
      : null;

  useEffect(() => {
    if (!token) {
      setError("You are not logged in.");
      setLoading(false);
      return;
    }
    if (!subscriberId || !accountId) {
      setError("Subscriber or Account ID missing. Please log in again.");
      setLoading(false);
      return;
    }

    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const addonRes = await fetch(
          `/api/addon/list?subscriber_id=${subscriberId}&account_id=${accountId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const addonData = await addonRes.json();
        if (addonRes.ok && addonData.success && Array.isArray(addonData.data)) {
          setAddons(addonData.data);
        } else setAddons([]);

        const alacarteRes = await fetch(
          `/api/alacarte/list?subscriber_id=${subscriberId}&account_id=${accountId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const alacarteData = await alacarteRes.json();
        if (
          alacarteRes.ok &&
          alacarteData.success &&
          Array.isArray(alacarteData.data)
        ) {
          setAlacartes(alacarteData.data);
        } else setAlacartes([]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [subscriberId, accountId, token]);

  // Save packs to localStorage so checkout page can read them
  useEffect(() => {
    if (addons.length > 0 || alacartes.length > 0) {
      localStorage.setItem("packs", JSON.stringify([...addons, ...alacartes]));
    }
  }, [addons, alacartes]);

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getPrice = (pack: Pack) => {
    if (pack.rate && Array.isArray(pack.rate) && pack.rate[0]?.mrp) {
      return parseFloat(pack.rate[0].mrp) || 0;
    }
    return parseFloat(pack.mrp) || 0;
  };

  const getFilteredData = () => {
    const data = activeTab === "addon" ? addons : alacartes;
    if (!Array.isArray(data)) return [];
    if (!searchTerm.trim()) return data;
    return data.filter((item) =>
      item.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredData = getFilteredData();

  // Selected packs (across both tabs)
  const allPacks = [...addons, ...alacartes];
  const selectedPacks = allPacks.filter((p) => selectedIds[p.id]);

  const handleMakePayment = () => {
    const ids = selectedPacks.map((p) => p.id);
    if (ids.length === 0) return;
    router.push(`/checkout?ids=${ids.join(",")}&type=${activeTab}`);
  };

  const getBoxType = (label: string) => {
    const upper = (label || "").toUpperCase();
    if (upper.includes("HD")) return "HD";
    if (upper.includes("SD")) return "SD";
    return label;
  };

  return (
    <>
      <UserHeader />

      <div className="min-h-screen bg-[#0d0d0d] text-white pb-32">
        {/* Top Content Wrapper */}
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 pt-24">
          {/* Tabs */}
          <div className="flex justify-center gap-12 border-b border-gray-800 mb-6">
            <button
              onClick={() => {
                setActiveTab("addon");
                setSearchTerm("");
              }}
              className={`pb-3 text-sm font-semibold tracking-wide transition ${
                activeTab === "addon"
                  ? "text-yellow-400 border-b-2 border-yellow-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Add ons
            </button>
            <button
              onClick={() => {
                setActiveTab("alacarte");
                setSearchTerm("");
              }}
              className={`pb-3 text-sm font-semibold tracking-wide transition ${
                activeTab === "alacarte"
                  ? "text-yellow-400 border-b-2 border-yellow-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              À la carte
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex justify-end mb-6">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-2.5 pl-4 pr-10 bg-transparent border border-gray-700 rounded-md text-white text-sm focus:outline-none focus:border-cyan-500"
              />
              <Search
                className="absolute right-3 top-3 text-gray-400"
                size={18}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-950 border border-red-700 rounded-md p-4 text-red-400 mb-4 text-sm">
              {error}
            </div>
          )}

          {loading && (
            <div className="text-center py-12 text-gray-400 text-sm">
              Loading packs...
            </div>
          )}

          {!loading && !error && filteredData.length === 0 && (
            <div className="text-center py-12 text-gray-400 text-sm">
              No packs available.
            </div>
          )}

          {/* ✅ CARD GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredData.map((pack) => {
              const isSelected = !!selectedIds[pack.id];
              const price = getPrice(pack);
              const boxType = getBoxType(pack.boxtype_lbl);

              return (
                <div
                  key={pack.id}
                  className={`relative rounded-lg border transition-all flex flex-col p-4 h-[290px] ${
                    isSelected
                      ? "bg-[#0f1f1f] border-green-500 shadow-[0_0_0_1px_rgba(34,197,94,0.5)]"
                      : "bg-black border-gray-800 hover:border-gray-600"
                  }`}
                >
                  {/* Top: Pack Name + Info icon */}
                  <div className="flex justify-between items-start gap-2 mb-4">
                    <p
                      className="text-[13px] font-semibold leading-snug text-white line-clamp-3"
                      title={pack.description}
                    >
                      {pack.description}
                    </p>
                    <button
                      onClick={() => alert(`Details for ${pack.description}`)}
                      className="shrink-0 text-cyan-400 hover:text-cyan-300 transition"
                      title="More info"
                    >
                      <Info size={16} />
                    </button>
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <span className="text-cyan-400 text-[22px] font-semibold">
                      ₹ {price.toFixed(2)}
                    </span>
                    <span className="text-cyan-400 text-[12px] font-medium">
                      /month
                    </span>
                  </div>

                  {/* HD / SD badge */}
                  <div className="flex items-center gap-1.5 text-gray-300 text-[12px] mb-3">
                    <Check size={13} className="text-gray-400" />
                    <span>{boxType}</span>
                  </div>

                  {/* View Channels */}
                  <button
                    onClick={() => alert(`Channels for ${pack.description}`)}
                    className="text-cyan-400 text-[12px] underline hover:text-cyan-300 self-start mb-4"
                  >
                    View Channels
                  </button>

                  {/* Select / Selected Button */}
                  <button
                    onClick={() => toggleSelect(pack.id)}
                    className={`w-full py-2 rounded text-[13px] font-semibold transition mb-2 ${
                      isSelected
                        ? "bg-green-600 hover:bg-green-500 text-white border border-green-500"
                        : "bg-transparent border border-white text-white hover:bg-white hover:text-black"
                    }`}
                  >
                    {isSelected ? "Selected" : "Select"}
                  </button>

                  {/* Footer note */}
                  <p className="text-[10px] text-gray-400 mt-auto leading-tight">
                    Network Capacity Fee extra as applicable
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ✅ BOTTOM BAR — Only shows when at least 1 pack is selected */}
        {selectedPacks.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 z-40 animate-[slideUp_0.3s_ease-out]">
            <div className="bg-black/95 backdrop-blur-md border-t border-gray-800 shadow-[0_-8px_24px_rgba(0,0,0,0.6)]">
              <div className="max-w-[1400px] mx-auto flex justify-between items-center px-4 md:px-8 py-3">
                <div className="min-w-0 flex-1 mr-4">
                  <p className="text-white font-bold text-base">
                    {selectedPacks.length} Pack
                    {selectedPacks.length !== 1 ? "s" : ""} Selected
                  </p>
                  <p className="text-gray-300 text-[13px] truncate">
                    {selectedPacks.map((p) => p.description).join(", ")}
                  </p>
                  <p className="text-gray-500 text-[11px] mt-0.5">
                    Network Capacity Fee and GST extra as applicable
                  </p>
                </div>

                <button
                  onClick={handleMakePayment}
                  className="shrink-0 px-6 py-3 rounded-md font-bold text-sm bg-red-600 hover:bg-red-700 text-white transition shadow-lg shadow-red-900/40"
                >
                  ₹ Make Payment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
