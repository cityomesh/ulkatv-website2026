// "use client";

// import React, { useEffect, useMemo, useState } from "react";

// import { FaSearch } from "react-icons/fa";

// // ======================================================
// // TYPES
// // ======================================================

// interface BouquetRate {
//   id?: number;
//   months?: number;
//   days?: number;
//   amount?: string;
//   tax_amount?: string;
//   price?: string;
//   rental?: string;
//   mrp?: number;
//   mrpTax?: string;
//   mrpPrice?: string;
//   rate_code?: string;
//   is_refundable?: number;
//   free_days?: number;
//   drp?: string;
//   total_days?: number;
//   name?: string;
//   factor?: number;
//   mrp_price?: number;
//   mrp_tax?: number;
// }

// interface BouqueItem {
//   id: number;
//   bouque_id?: number;
//   operator_id?: number;
//   is_refundable?: number;
//   rate_code?: string;
//   commision?: string;
//   remark?: string;
//   created_at?: string;
//   updated_at?: string;
//   created_by?: number;
//   updated_by?: number;
//   mrp_amt?: number | null;
//   drp?: number | null;
//   name: string;
//   code?: string;
//   isHD?: number;
//   type?: number;
//   type_lbl?: string;
//   boxtype_lbl?: string;
//   status?: number;
//   status_lbl?: string;
//   rate?: BouquetRate[];
// }

// interface BouquetApiResult {
//   success?: boolean;
//   status?: number;
//   message?: string;
//   data?: BouqueItem[];
// }

// // ======================================================
// // CACHE
// // ======================================================

// const BOUQUET_CACHE_KEY = "ulka_pagebouquets_bouquets_v5";
// const CACHE_MAX_AGE = 10 * 60 * 1000;

// // ======================================================
// // ✅ TABS
// // ======================================================

// const tabs = ["Channels", "Broadcaster Packs", "Ulka Bouquets"];

// // ======================================================
// // ✅ TYPE MAPPING (very simple)
// // ======================================================
// //   Channels            -> "Alacarte"
// //   Broadcaster Packs   -> "Add On"
// //   Ulka Bouquets       -> "Base"
// //
// // Bouquet API lo `type_lbl` field lo ee value match
// // ayye items matrame aa tab lo chupistunnam.
// // ======================================================

// const typeMapping: Record<string, "Alacarte" | "Add On" | "Base"> = {
//   Channels: "Alacarte",
//   "Broadcaster Packs": "Add On",
//   "Ulka Bouquets": "Base",
// };

// // ======================================================
// // NORMALIZE HELPER
// // ======================================================
// // "Add On", "Add-On", "AddOn"  -> "addon"
// // "Base", "BASE"               -> "base"
// // "Alacarte", "A-la-carte"     -> "alacarte"
// // ======================================================

// const normalizeType = (value: string | undefined | null): string => {
//   if (!value) return "";
//   return String(value).toLowerCase().replace(/[\s\-_]/g, "");
// };

// // ======================================================
// // BOUQUET DRP (1 month)
// // ======================================================

// const getBouquetDrp = (item: BouqueItem): string => {
//   if (!Array.isArray(item.rate) || item.rate.length === 0) return "";

//   const oneMonth =
//     item.rate.find((r) => Number(r.months) === 1) || item.rate[0];

//   const value = oneMonth?.drp;
//   if (value === undefined || value === null || value === "") return "";

//   const numeric = Number(value);
//   if (!Number.isNaN(numeric)) return numeric.toFixed(0);
//   return String(value);
// };

// // ======================================================
// // BOUQUET MRP
// // ======================================================

// const getBouquetMrp = (item: BouqueItem): string => {
//   if (!Array.isArray(item.rate) || item.rate.length === 0) return "";

//   const oneMonth =
//     item.rate.find((r) => Number(r.months) === 1) || item.rate[0];

//   const value = oneMonth?.mrp;
//   if (value === undefined || value === null) return "";

//   const numeric = Number(value);
//   if (!Number.isNaN(numeric)) return numeric.toFixed(0);
//   return String(value);
// };

// // ======================================================
// // READ CACHE
// // ======================================================

// const readCache = <T,>(key: string): T | null => {
//   try {
//     const raw = localStorage.getItem(key);
//     if (!raw) return null;

//     const parsed = JSON.parse(raw) as {
//       timestamp?: number;
//       data?: T;
//     };

//     if (
//       !parsed ||
//       typeof parsed.timestamp !== "number" ||
//       parsed.data === undefined
//     ) {
//       return null;
//     }

//     if (Date.now() - parsed.timestamp > CACHE_MAX_AGE) return null;

//     return parsed.data;
//   } catch {
//     return null;
//   }
// };

// // ======================================================
// // WRITE CACHE
// // ======================================================

// const writeCache = <T,>(key: string, data: T): void => {
//   try {
//     localStorage.setItem(
//       key,
//       JSON.stringify({ timestamp: Date.now(), data })
//     );
//   } catch {
//     // Ignore
//   }
// };

// // ======================================================
// // ✅ FETCH BOUQUETS (only API used now)
// // ======================================================

// const fetchBouqueData = async (): Promise<BouqueItem[]> => {
//   const token = localStorage.getItem("access_token");

//   if (!token) {
//     throw new Error(
//       "Login session not found. Please login again."
//     );
//   }

//   const response = await fetch("/api/ulka/bouquets", {
//     method: "GET",
//     headers: {
//       Accept: "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     cache: "no-store",
//   });

//   const result = (await response.json()) as BouquetApiResult;

//   if (!response.ok || result.success !== true) {
//     throw new Error(
//       result.message || `Failed to fetch data (${response.status})`
//     );
//   }

//   if (!Array.isArray(result.data)) return [];

//   return result.data;
// };

// // ======================================================
// // MAIN COMPONENT
// // ======================================================

// const BouquePage = () => {
//   // ==================================================
//   // TAB
//   // ==================================================
//   const [selectedTab, setSelectedTab] = useState("Channels");

//   // ==================================================
//   // DATA (only bouquets)
//   // ==================================================
//   const [bouqueData, setBouqueData] = useState<BouqueItem[]>([]);

//   // ==================================================
//   // SEARCH
//   // ==================================================
//   const [searchQuery, setSearchQuery] = useState("");

//   // ==================================================
//   // LOADING
//   // ==================================================
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);

//   // ==================================================
//   // ERROR
//   // ==================================================
//   const [error, setError] = useState<string | null>(null);

//   // ==================================================
//   // CURRENT TYPE
//   // ==================================================
//   const currentType = typeMapping[selectedTab];

//   // ==================================================
//   // INITIAL LOAD
//   // ==================================================
//   useEffect(() => {
//     let mounted = true;

//     const loadData = async () => {
//       // ---------------------------------------------
//       // 1) LOAD CACHE
//       // ---------------------------------------------
//       const cachedBouquets = readCache<BouqueItem[]>(BOUQUET_CACHE_KEY);

//       if (cachedBouquets && cachedBouquets.length > 0) {
//         console.log("⚡ Cached bouquets:", cachedBouquets.length);
//         setBouqueData(cachedBouquets);
//         setLoading(false);
//       }

//       // ---------------------------------------------
//       // 2) BACKGROUND REFRESH
//       // ---------------------------------------------
//       setRefreshing(true);
//       console.log("🚀 Starting ULKA bouquet refresh...");

//       try {
//         const newBouquets = await fetchBouqueData();

//         if (!mounted) return;

//         console.log("✅ Fresh bouquets:", newBouquets.length);

//         setBouqueData(newBouquets);
//         writeCache(BOUQUET_CACHE_KEY, newBouquets);
//         setError(null);
//         setLoading(false);
//       } catch (err) {
//         if (!mounted) return;

//         console.error("Bouquets failed:", err);

//         if (!cachedBouquets || cachedBouquets.length === 0) {
//           setBouqueData([]);
//           setError(
//             err instanceof Error
//               ? err.message
//               : "Failed to load ULKA data"
//           );
//         }
//         setLoading(false);
//       }

//       setRefreshing(false);
//       console.log("✅ ULKA refresh complete.");
//     };

//     void loadData();

//     return () => {
//       mounted = false;
//     };
//   }, []);

//   // ==================================================
//   // ✅ FILTER DATA BY TYPE (all tabs from bouquets)
//   // ==================================================
//   // Channels            -> "Alacarte"
//   // Broadcaster Packs   -> "Add On"
//   // Ulka Bouquets       -> "Base"
//   //
//   // Ee currentType batti bouqueData ni filter chestunnam.
//   // Chinnna debug log kuda pettanu — console lo chudandi.
//   // ==================================================
//   const filteredData = useMemo(() => {
//     const wantedType = normalizeType(currentType);
//     const query = searchQuery.trim().toLowerCase();

//     const filtered = bouqueData.filter((item) => {
//       const itemType = normalizeType(item.type_lbl);
//       if (itemType !== wantedType) return false;

//       if (query) {
//         const nameMatch = item.name?.toLowerCase().includes(query);
//         if (!nameMatch) return false;
//       }

//       if (item.status !== undefined && item.status !== 1) {
//         return false;
//       }

//       return true;
//     });

//     console.log(
//       `Tab "${selectedTab}" (type="${currentType}"): ${filtered.length} / ${bouqueData.length} items`
//     );

//     return filtered;
//   }, [bouqueData, currentType, searchQuery, selectedTab]);

//   // ==================================================
//   // DEBUG: ee line temporary ga peeki, mee API lo
//   // unna anni type_lbl values console lo chudandi
//   // ==================================================
//   useEffect(() => {
//     if (bouqueData.length > 0) {
//       const types = Array.from(
//         new Set(bouqueData.map((b) => b.type_lbl || "(empty)"))
//       );
//       console.log("📋 All type_lbl values in API:", types);
//     }
//   }, [bouqueData]);

//   // ==================================================
//   // TAB CHANGE
//   // ==================================================
//   const handleTabChange = (tab: string) => {
//     setSelectedTab(tab);
//     setSearchQuery("");
//   };

//   // ==================================================
//   // TAB COLOR
//   // ==================================================
//   const getCardColor = () => {
//     if (selectedTab === "Channels") return "bg-green-100";
//     if (selectedTab === "Broadcaster Packs") return "bg-blue-100";
//     return "bg-red-100";
//   };

//   // ==================================================
//   // RENDER
//   // ==================================================
//   return (
//     <div className="p-4 sm:p-10 md:p-20 mt-[2rem] bg-white text-black min-h-screen">
//       {/* HEADER */}
//       <div className="text-center mb-8">
//         <h1 className="text-2xl font-bold mb-4">
//           Ulka Subscription Plans
//         </h1>

//         <p className="text-gray-600 mb-6">
//           View all channels, broadcaster packs and bouquets available on ULKA TV
//         </p>

//         {/* TABS */}
//         <div className="flex flex-wrap justify-center gap-4">
//           {tabs.map((tab) => (
//             <button
//               key={tab}
//               type="button"
//               onClick={() => handleTabChange(tab)}
//               className={`px-6 py-3 rounded-md font-medium transition ${
//                 selectedTab === tab
//                   ? "bg-black text-white"
//                   : "bg-red-500 text-black hover:bg-red-600"
//               }`}
//             >
//               {tab}
//             </button>
//           ))}
//         </div>

//         {refreshing && bouqueData.length > 0 && (
//           <div className="mt-3 text-xs text-gray-400">
//             Updating latest ULKA data...
//           </div>
//         )}
//       </div>

//       {/* MAIN CONTENT */}
//       <div className="mt-10">
//         {/* Search */}
//         <div className="relative w-full max-w-8xl mx-auto mb-8">
//           <FaSearch className="absolute left-3 top-3 text-black" />
//           <input
//             type="text"
//             placeholder={`Search ${selectedTab.toLowerCase()}...`}
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full p-2 pl-10 border rounded-md outline-none focus:ring-2 focus:ring-black"
//           />
//         </div>

//         {/* Loading */}
//         {loading && bouqueData.length === 0 && (
//           <div className="text-center py-10 text-gray-600">
//             Loading...
//           </div>
//         )}

//         {/* Error */}
//         {!loading && error && bouqueData.length === 0 && (
//           <div className="max-w-5xl mx-auto mb-6 rounded-md border border-red-300 bg-red-50 p-5 text-red-700">
//             <p className="font-semibold">
//               Failed to load ULKA data
//             </p>
//             <p className="text-sm mt-1">{error}</p>
//             <p className="text-xs mt-3">
//               Please login again if your ULKA session has expired.
//             </p>
//           </div>
//         )}

//         {/* Count */}
//         {!loading && !error && filteredData.length > 0 && (
//           <div className="max-w-8xl mx-auto mb-4 text-sm text-gray-600">
//             Showing <strong>{filteredData.length}</strong>{" "}
//             {selectedTab.toLowerCase()} items
//           </div>
//         )}

//         {/* Grid */}
//         {!loading && !error && filteredData.length > 0 && (
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-6">
//             {filteredData.map((item) => (
//               <div
//                 key={item.id}
//                 className={`p-4 border rounded-md text-center hover:shadow-md transition ${getCardColor()}`}
//               >
//                 <p className="font-semibold mb-2">{item.name}</p>

//                 {item.isHD === 1 && (
//                   <span className="inline-block mb-2 px-2 py-0.5 text-[10px] font-bold rounded bg-yellow-400 text-black">
//                     HD
//                   </span>
//                 )}

//                 {item.type_lbl && (
//                   <p className="text-xs text-gray-500 mb-2">
//                     {item.type_lbl}
//                   </p>
//                 )}

//                 {getBouquetDrp(item) && (
//                   <p className="text-sm text-gray-700">
//                     Drp: ₹{getBouquetDrp(item)} / month
//                   </p>
//                 )}

//                 {getBouquetMrp(item) &&
//                   getBouquetMrp(item) !== getBouquetDrp(item) && (
//                     <p className="text-xs text-gray-500 mt-1">
//                       MRP: ₹{getBouquetMrp(item)}
//                     </p>
//                   )}
//               </div>
//             ))}
//           </div>
//         )}

//         {/* No data */}
//         {!loading && !error && filteredData.length === 0 && (
//           <div className="text-center py-10 text-gray-500">
//             No items found for {selectedTab}.
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default BouquePage;



"use client";

import React, { useEffect, useMemo, useState } from "react";

import Image from "next/image";
import { FaSearch } from "react-icons/fa";

// ======================================================
// TYPES
// ======================================================

interface Logo {
  name?: string;
  type?: string;
  ext?: string;
  data?: string;
}

interface Language {
  id?: number;
  name?: string;
  label?: string;
}

interface Genre {
  id?: number;
  name?: string;
  label?: string;
}

interface Broadcaster {
  id?: number;
  name?: string;
  label?: string;
}

interface Channel {
  id: number;
  code: string;
  name: string;

  broadcaster_id?: number;
  broadcaster_lbl?: string | Broadcaster;
  genre_id?: number;
  genre_lbl?: string | Genre;
  language_id?: number | number[];
  language_lbl?: string | string[] | Language | Language[];

  channel_type_lbl?: string;

  isHD?: number;
  isAlacarte?: number;
  isFta?: number;
  isNCF?: number;

  isAlacarte_lbl?: string;
  status_lbl?: string;
  isFta_lbl?: string;
  isNCF_lbl?: string;

  status?: number;
  description?: string;
  logo?: Logo | null;

  broadcasterRate?: string;
  drp?: string;

  revenue_share?: {
    mso_share?: number;
    mso_discount?: number;
    broadcaster_share?: number;
  };

  lcn_code?: string | null;

  created_at?: string;
  updated_at?: string;
}

interface Rate {
  id: number;
  months: number;
  drp: string;
}

interface BouqueItem {
  id: number;
  name: string;
  type_lbl: string;
  rate: Rate[];
}

interface ChannelApiResult {
  success?: boolean;
  status?: number;
  message?: string;
  data?: Channel[];
}

interface BouquetApiResult {
  success?: boolean;
  status?: number;
  message?: string;
  data?: BouqueItem[];
}

// ======================================================
// CACHE
// ======================================================

const CHANNEL_CACHE_KEY = "ulka_pagebouquets_channels_v1";
const BOUQUET_CACHE_KEY = "ulka_pagebouquets_bouquets_v1";

const CACHE_MAX_AGE = 10 * 60 * 1000;

// ======================================================
// TABS
// ======================================================

const tabs = ["Channels", "Broadcaster Packs", "Ulka Bouquets"];

// ======================================================
// BOUQUET TYPE MAPPING
// ======================================================
// Channels tab ki idi use avvadu (separate JSX block).
// Broadcaster Packs -> "Add On"
// Ulka Bouquets     -> "Base"
// ======================================================

const typeMapping: Record<string, string> = {
  "Broadcaster Packs": "Add On",
  "Ulka Bouquets": "Base",
};

// ======================================================
// NORMALIZE LANGUAGE
// ======================================================

const normalizeLanguage = (value: string): string => {
  const language = value.trim().toLowerCase();
  const mapping: Record<string, string> = {};
  return mapping[language] || value.trim();
};

// ======================================================
// NORMALIZE GENRE
// ======================================================

const normalizeGenre = (value: string): string => {
  const genre = value.trim().toLowerCase();

  const mapping: Record<string, string> = {
    entertainment: "Entertainment",
    kids: "Kids",
    kid: "Kids",
    movies: "Movies",
    movie: "Movies",
    news: "News",
    sports: "Sports",
    sport: "Sports",
    music: "Music",
    comedy: "Comedy",
    lifestyle: "LifeStyle",
    "life style": "LifeStyle",
    spiritual: "Spiritual",
    spirituality: "Spiritual",
    infotainment: "Infotainment",
  };

  return mapping[genre] || value.trim();
};

// ======================================================
// LANGUAGE NAME
// ======================================================

const getLanguageName = (channel: Channel): string => {
  const value = channel.language_lbl;

  if (!value) return "";

  if (typeof value === "string") return value;

  if (Array.isArray(value)) {
    if (value.length === 0) return "";
    const first = value[0];
    if (typeof first === "string") return first;
    return first?.name || first?.label || "";
  }

  if (typeof value === "object") {
    return value.name || value.label || "";
  }

  return "";
};

// ======================================================
// GENRE NAME
// ======================================================

const getGenreName = (channel: Channel): string => {
  const value = channel.genre_lbl;

  if (!value) return "";

  if (typeof value === "string") return value;

  if (Array.isArray(value)) {
    if (value.length === 0) return "";
    const first = value[0];
    if (typeof first === "string") return first;
    return first?.name || first?.label || "";
  }

  if (typeof value === "object") {
    return value.name || value.label || "";
  }

  return "";
};

// ======================================================
// CHANNEL MRP
// ======================================================

const getChannelMrp = (channel: Channel): string => {
  const mrp = channel.broadcasterRate;

  if (mrp === undefined || mrp === null || mrp === "") return "";

  const numericMrp = Number(mrp);
  if (!Number.isNaN(numericMrp)) return numericMrp.toFixed(0);
  return String(mrp);
};

// ======================================================
// LOGO URL
// ======================================================

const getLogoUrl = (channel: Channel): string => {
  const logo = channel.logo;

  if (!logo) return "/placeholder.png";
  if (typeof logo !== "object") return "/placeholder.png";
  if (!logo.data || typeof logo.data !== "string") {
    return "/placeholder.png";
  }

  if (logo.data.startsWith("data:image/")) return logo.data;
  return `data:${logo.type || "image/png"};base64,${logo.data}`;
};

// ======================================================
// READ CACHE
// ======================================================

const readCache = <T,>(key: string): T | null => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as {
      timestamp?: number;
      data?: T;
    };

    if (
      !parsed ||
      typeof parsed.timestamp !== "number" ||
      parsed.data === undefined
    ) {
      return null;
    }

    const age = Date.now() - parsed.timestamp;
    if (age > CACHE_MAX_AGE) return null;

    return parsed.data;
  } catch {
    return null;
  }
};

// ======================================================
// WRITE CACHE
// ======================================================

const writeCache = <T,>(key: string, data: T): void => {
  try {
    localStorage.setItem(
      key,
      JSON.stringify({ timestamp: Date.now(), data })
    );
  } catch {
    // Ignore
  }
};

// ======================================================
// FETCH CHANNELS
// ======================================================

const fetchChannels = async (): Promise<Channel[]> => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error(
      "Login session not found. Please login again."
    );
  }

  const response = await fetch("/api/ulka/channels", {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const result = (await response.json()) as ChannelApiResult;

  if (!response.ok || result.success !== true) {
    throw new Error(
      result.message || `Failed to fetch channels (${response.status})`
    );
  }

  if (!Array.isArray(result.data)) return [];

  return result.data;
};

// ======================================================
// FETCH BOUQUETS
// ======================================================

const fetchBouqueData = async (): Promise<BouqueItem[]> => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error(
      "Login session not found. Please login again."
    );
  }

  const response = await fetch("/api/ulka/bouquets", {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const result = (await response.json()) as BouquetApiResult;

  if (!response.ok || result.success !== true) {
    throw new Error(
      result.message || `Failed to fetch bouquet data (${response.status})`
    );
  }

  if (!Array.isArray(result.data)) return [];

  return result.data;
};

// ======================================================
// MAIN COMPONENT
// ======================================================

const BouquePage = () => {
  // ==================================================
  // TAB
  // ==================================================
  const [selectedTab, setSelectedTab] = useState("Channels");

  // ==================================================
  // CATEGORY / SUBCATEGORY (for channels)
  // ==================================================
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    null
  );
  const [selectedSubcategory, setSelectedSubcategory] = useState<
    string | null
  >(null);

  // ==================================================
  // DATA
  // ==================================================
  const [channels, setChannels] = useState<Channel[]>([]);
  const [bouqueData, setBouqueData] = useState<BouqueItem[]>([]);

  // ==================================================
  // SEARCH
  // ==================================================
  const [searchQuery, setSearchQuery] = useState("");

  // ==================================================
  // SHOW ALL
  // ==================================================
  const [showAllChannels, setShowAllChannels] = useState(false);

  // ==================================================
  // LOADING
  // ==================================================
  const [loadingChannels, setLoadingChannels] = useState(true);
  const [loadingBouquets, setLoadingBouquets] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // ==================================================
  // ERRORS
  // ==================================================
  const [channelError, setChannelError] = useState<string | null>(null);
  const [bouquetError, setBouquetError] = useState<string | null>(null);

  // ==================================================
  // INITIAL LOAD
  // ==================================================
  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      // ---------------------------------------------
      // STEP 1: LOAD CACHE IMMEDIATELY
      // ---------------------------------------------
      const cachedChannels = readCache<Channel[]>(CHANNEL_CACHE_KEY);
      const cachedBouquets = readCache<BouqueItem[]>(BOUQUET_CACHE_KEY);

      if (cachedChannels && cachedChannels.length > 0) {
        console.log(
          "⚡ Showing cached channels immediately:",
          cachedChannels.length
        );
        setChannels(cachedChannels);
        setLoadingChannels(false);
      }

      if (cachedBouquets && cachedBouquets.length > 0) {
        console.log(
          "⚡ Showing cached bouquets immediately:",
          cachedBouquets.length
        );
        setBouqueData(cachedBouquets);
        setLoadingBouquets(false);
      }

      // ---------------------------------------------
      // STEP 2: BACKGROUND API REFRESH
      // ---------------------------------------------
      setRefreshing(true);
      console.log("🚀 Starting background ULKA refresh...");

      const [channelResult, bouquetResult] = await Promise.allSettled([
        fetchChannels(),
        fetchBouqueData(),
      ]);

      if (!mounted) return;

      // =============================================
      // CHANNEL RESULT
      // =============================================
      if (channelResult.status === "fulfilled") {
        const newChannels = channelResult.value;
        console.log("✅ Fresh channels:", newChannels.length);

        setChannels(newChannels);
        writeCache(CHANNEL_CACHE_KEY, newChannels);
        setChannelError(null);
        setLoadingChannels(false);
      } else {
        console.error("Channels refresh failed:", channelResult.reason);

        if (!cachedChannels || cachedChannels.length === 0) {
          setChannels([]);
          setChannelError(
            channelResult.reason instanceof Error
              ? channelResult.reason.message
              : "Failed to load ULKA channels"
          );
        }
        setLoadingChannels(false);
      }

      // =============================================
      // BOUQUET RESULT
      // =============================================
      if (bouquetResult.status === "fulfilled") {
        const newBouquets = bouquetResult.value;
        console.log("✅ Fresh bouquets:", newBouquets.length);

        setBouqueData(newBouquets);
        writeCache(BOUQUET_CACHE_KEY, newBouquets);
        setBouquetError(null);
        setLoadingBouquets(false);
      } else {
        console.error("Bouquets refresh failed:", bouquetResult.reason);

        if (!cachedBouquets || cachedBouquets.length === 0) {
          setBouqueData([]);
          setBouquetError(
            bouquetResult.reason instanceof Error
              ? bouquetResult.reason.message
              : "Failed to load ULKA bouquets"
          );
        }
        setLoadingBouquets(false);
      }

      setRefreshing(false);
      console.log("✅ ULKA background refresh completed.");
    };

    void loadData();

    return () => {
      mounted = false;
    };
  }, []);

  // ==================================================
  // DYNAMIC LANGUAGES (channels)
  // ==================================================
  const categories = useMemo(() => {
    const list = channels
      .map((channel) => {
        const language = getLanguageName(channel);
        if (!language) return "";
        return normalizeLanguage(language);
      })
      .filter(Boolean);

    return Array.from(new Set(list)).sort((a, b) => a.localeCompare(b));
  }, [channels]);

  // ==================================================
  // DYNAMIC GENRES (channels)
  // ==================================================
  const dynamicSubcategories = useMemo(() => {
    if (!selectedCategory) return [];

    const genres = channels
      .filter((channel) => {
        const language = normalizeLanguage(getLanguageName(channel));
        return (
          language.toLowerCase() === selectedCategory.toLowerCase()
        );
      })
      .map((channel) => normalizeGenre(getGenreName(channel)))
      .filter(Boolean);

    return Array.from(new Set(genres)).sort((a, b) =>
      a.localeCompare(b)
    );
  }, [channels, selectedCategory]);

  // ==================================================
  // CATEGORY CLICK
  // ==================================================
  const handleCategoryClick = (category: string) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
      setSelectedSubcategory(null);
      setShowAllChannels(false);
      return;
    }

    setSelectedCategory(category);
    setSelectedSubcategory(null);
    setShowAllChannels(false);
  };

  // ==================================================
  // GENRE CLICK
  // ==================================================
  const handleSubcategoryClick = (subcategory: string) => {
    setSelectedSubcategory(
      selectedSubcategory === subcategory ? null : subcategory
    );
    setShowAllChannels(false);
  };

  // ==================================================
  // FILTER CHANNELS (NO Alacarte filter — all channels)
  // ==================================================
  const filteredChannels = useMemo(() => {
    if (!selectedCategory) return [];

    const query = searchQuery.trim().toLowerCase();

    return channels.filter((channel) => {
      const languageName = normalizeLanguage(
        getLanguageName(channel)
      );

      if (
        languageName.toLowerCase() !== selectedCategory.toLowerCase()
      ) {
        return false;
      }

      if (selectedSubcategory) {
        const genreName = normalizeGenre(getGenreName(channel));

        if (
          genreName.toLowerCase() !== selectedSubcategory.toLowerCase()
        ) {
          return false;
        }
      }

      if (query) {
        const nameMatch = channel.name?.toLowerCase().includes(query);
        const codeMatch = channel.code?.toLowerCase().includes(query);
        if (!nameMatch && !codeMatch) return false;
      }

      if (channel.status !== undefined && channel.status !== 1) {
        return false;
      }

      return true;
    });
  }, [channels, selectedCategory, selectedSubcategory, searchQuery]);

  // ==================================================
  // FILTER BOUQUETS (Add On / Base)
  // ==================================================
  const filteredBouqueData = useMemo(() => {
    const expectedType = typeMapping[selectedTab];
    if (!expectedType) return [];

    const required = expectedType.toLowerCase().replace(/\s+/g, "");
    const query = searchQuery.trim().toLowerCase();

    return bouqueData.filter((item) => {
      const actual = item.type_lbl?.toLowerCase().replace(/\s+/g, "");
      const typeMatch = actual === required;

      const searchMatch =
        !query || item.name?.toLowerCase().includes(query);

      return typeMatch && searchMatch;
    });
  }, [bouqueData, selectedTab, searchQuery]);

  // ==================================================
  // TAB CHANGE
  // ==================================================
  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
    setSearchQuery("");
    setShowAllChannels(false);

    if (tab !== "Channels") {
      setSelectedCategory(null);
      setSelectedSubcategory(null);
    }
  };

  // ==================================================
  // RENDER
  // ==================================================
  return (
    <div className="p-4 sm:p-10 md:p-20 mt-[2rem] bg-white text-black min-h-screen">
      {/* ==================================================
          HEADER
      ================================================== */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-4">
          Ulka Subscription Plans
        </h1>

        <p className="text-gray-600 mb-6">
          View all channels and broadcaster packs available on ULKA TV
        </p>

        {/* TABS */}
        <div className="flex flex-wrap justify-center gap-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => handleTabChange(tab)}
              className={`px-6 py-3 rounded-md font-medium transition ${
                selectedTab === tab
                  ? "bg-black text-white"
                  : "bg-red-500 text-black hover:bg-red-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {refreshing &&
          (channels.length > 0 || bouqueData.length > 0) && (
            <div className="mt-3 text-xs text-gray-400">
              Updating latest ULKA data...
            </div>
          )}
      </div>

      {/* ==================================================
          CHANNELS TAB (all channels — NO Alacarte filter)
      ================================================== */}
      {selectedTab === "Channels" && (
        <div className="flex flex-col items-center mt-10">
          {loadingChannels && channels.length === 0 && (
            <div className="py-10 text-gray-600">
              Loading channels...
            </div>
          )}

          {!loadingChannels &&
            channelError &&
            channels.length === 0 && (
              <div className="w-full max-w-5xl mb-6 rounded-md border border-red-300 bg-red-50 p-5 text-red-700">
                <p className="font-semibold">
                  Failed to load ULKA channels
                </p>
                <p className="text-sm mt-1">{channelError}</p>
                <p className="text-xs mt-3">
                  Please login again if your ULKA session has expired.
                </p>
              </div>
            )}

          {!loadingChannels &&
            !channelError &&
            channels.length === 0 && (
              <div className="py-10 text-gray-500">
                No channels returned by ULKA.
              </div>
            )}

          {channels.length > 0 &&
            categories.map((category) => (
              <div key={category} className="w-full max-w-8xl mb-4">
                <button
                  type="button"
                  onClick={() => handleCategoryClick(category)}
                  className={`w-full flex justify-between items-center px-4 py-4 text-sm font-medium rounded-md transition ${
                    selectedCategory === category
                      ? "bg-black text-white"
                      : "bg-gray-200 text-black hover:bg-gray-300"
                  }`}
                >
                  <span>{category}</span>
                  <span className="text-xl font-bold">
                    {selectedCategory === category ? "−" : "+"}
                  </span>
                </button>

                {selectedCategory === category && (
                  <>
                    <div className="flex flex-wrap items-center gap-2 mt-4 px-4">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedSubcategory(null);
                          setShowAllChannels(false);
                        }}
                        className={`px-4 py-2 text-[15px] rounded-md border ${
                          selectedSubcategory === null
                            ? "bg-red-600 text-white"
                            : "bg-gray-100 text-black hover:bg-gray-200"
                        }`}
                      >
                        All
                      </button>

                      {dynamicSubcategories.map((genre) => (
                        <button
                          key={genre}
                          type="button"
                          onClick={() => handleSubcategoryClick(genre)}
                          className={`px-4 py-2 text-[15px] rounded-md border ${
                            selectedSubcategory === genre
                              ? "bg-red-600 text-white"
                              : "bg-gray-100 text-black hover:bg-gray-200"
                          }`}
                        >
                          {genre}
                        </button>
                      ))}

                      <div className="relative flex-grow max-w-sm ml-auto">
                        <FaSearch className="absolute left-3 top-3 text-black" />
                        <input
                          type="text"
                          placeholder="Search channels..."
                          value={searchQuery}
                          onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setShowAllChannels(false);
                          }}
                          className="w-full p-2 pl-10 border rounded-md outline-none focus:ring-2 focus:ring-black"
                        />
                      </div>
                    </div>

                    <div className="mt-3 p-4 bg-white rounded-md border border-gray-200">
                      <div className="mb-4 text-sm text-gray-600">
                        Showing{" "}
                        <strong>{filteredChannels.length}</strong>{" "}
                        channels for{" "}
                        <strong>{selectedCategory}</strong>
                        {selectedSubcategory && (
                          <>
                            {" / "}
                            <strong>{selectedSubcategory}</strong>
                          </>
                        )}
                      </div>

                      {filteredChannels.length === 0 && (
                        <div className="text-center py-10 text-gray-500">
                          No channels found.
                        </div>
                      )}

                      {filteredChannels.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
                          {(showAllChannels
                            ? filteredChannels
                            : filteredChannels.slice(0, 14)
                          ).map((channel) => {
                            const logoUrl = getLogoUrl(channel);

                            return (
                              <div
                                key={channel.id}
                                className="text-center border p-3 rounded-md bg-gray-50 hover:shadow-md transition"
                              >
                                <Image
                                  src={logoUrl}
                                  alt={channel.name || "Channel logo"}
                                  width={100}
                                  height={65}
                                  unoptimized
                                  className="mx-auto w-[100px] h-[65px] object-contain"
                                  onError={(e) => {
                                    e.currentTarget.src =
                                      "/placeholder.png";
                                  }}
                                />

                                <p className="mt-2 text-sm font-semibold">
                                  {channel.name}
                                </p>

                                {getChannelMrp(channel) && (
                                  <p className="mt-2 text-sm font-semibold text-green-700">
                                    MRP: ₹
                                    {getChannelMrp(channel)}
                                    {" / m"}
                                  </p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {filteredChannels.length > 14 && (
                        <div className="mt-6 text-center">
                          <button
                            type="button"
                            onClick={() =>
                              setShowAllChannels(!showAllChannels)
                            }
                            className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                          >
                            {showAllChannels
                              ? "Show Less"
                              : `Read More (${
                                  filteredChannels.length - 14
                                } more)`}
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
        </div>
      )}

      {/* ==================================================
          BOUQUETS TAB (Broadcaster Packs + Ulka Bouquets)
      ================================================== */}
      {["Broadcaster Packs", "Ulka Bouquets"].includes(selectedTab) && (
        <div className="mt-10">
          <div className="relative w-full max-w-8xl mx-auto mb-8">
            <FaSearch className="absolute left-3 top-3 text-black" />
            <input
              type="text"
              placeholder="Search bouquet..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 pl-10 border rounded-md outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {loadingBouquets && bouqueData.length === 0 && (
            <div className="text-center py-10 text-gray-600">
              Loading plans...
            </div>
          )}

          {!loadingBouquets &&
            bouquetError &&
            bouqueData.length === 0 && (
              <div className="max-w-5xl mx-auto mb-6 rounded-md border border-red-300 bg-red-50 p-5 text-red-700">
                <p className="font-semibold">
                  Failed to load ULKA plans
                </p>
                <p className="text-sm mt-1">{bouquetError}</p>
              </div>
            )}

          {bouqueData.length > 0 && !bouquetError && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-6">
              {filteredBouqueData.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 border rounded-md text-center hover:shadow-md transition ${
                    selectedTab === "Broadcaster Packs"
                      ? "bg-blue-100"
                      : "bg-red-100"
                  }`}
                >
                  <p className="font-semibold mb-2">{item.name}</p>

                  {item.type_lbl && (
                    <p className="text-xs text-gray-500 mb-2">
                      {item.type_lbl}
                    </p>
                  )}

                  {item.rate?.length > 0 && (
                    <p className="text-sm text-gray-700">
                      MRP: ₹{Number(item.rate[0].drp).toFixed(0)}
                      {" / m"}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {!loadingBouquets &&
            !bouquetError &&
            bouqueData.length > 0 &&
            filteredBouqueData.length === 0 && (
              <div className="text-center py-10 text-gray-500">
                No plans found.
              </div>
            )}
        </div>
      )}
    </div>
  );
};

export default BouquePage;
