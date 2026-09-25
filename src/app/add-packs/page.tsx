// app/add-packs/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Search,
  Info,
  Check,
  X,
  Tv,
  Loader2,
  Layers,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import UserHeader from "../../components/UserHeader";
import { ULKA_TOKEN } from "../../lib/ulkaToken";

// ======================================================
// TYPES
// ======================================================
interface Pack {
  id: number;
  mrp: string;
  rate?: { mrp: string }[];
  description: string;
  boxtype_lbl: string;
}

interface BouquetChannel {
  name: string;
  id: string;
  type: string;
  logo_url: string;
}

interface BouquetGenre {
  genre_id: string;
  genre_name: string;
  channels_count: number;
  channel_list: BouquetChannel[];
}

interface BouquetDetails {
  id: number;
  name: string;
  channels: BouquetGenre[];
}

type ModalMode = "channels" | "info";

// ======================================================
// COMPONENT
// ======================================================
export default function AddPacksPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"addon" | "alacarte">("addon");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [addons, setAddons] = useState<Pack[]>([]);
  const [alacartes, setAlacartes] = useState<Pack[]>([]);
  const [selectedIds, setSelectedIds] = useState<Record<number, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  const [channelLogos, setChannelLogos] = useState<Record<string, string>>({});

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("channels");
  const [modalPack, setModalPack] = useState<Pack | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [bouquetDetails, setBouquetDetails] =
    useState<BouquetDetails | null>(null);
  const [expandedGenre, setExpandedGenre] = useState<string | null>(null);

  const [loadingMsg, setLoadingMsg] = useState("Connecting to server...");

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

  // ==================================================
  // LOADING MESSAGE ROTATION
  // ==================================================
  useEffect(() => {
    if (!loading) return;

    const messages = [
      "Connecting to server...",
      "Fetching available packs...",
      "Loading Add-Ons & À la carte...",
      "Preparing your channel list...",
      "Almost there, please wait...",
    ];

    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % messages.length;
      setLoadingMsg(messages[i]);
    }, 2200);

    return () => clearInterval(interval);
  }, [loading]);

  // ==================================================
  // LOAD CHANNEL LOGOS
  // ==================================================
  useEffect(() => {
    const loadChannelLogos = async () => {
      try {
        const res = await fetch("/api/ulka/channels", {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${ULKA_TOKEN}`,
          },
          cache: "no-store",
        });

        const json = await res.json();

        if (!json?.success || !Array.isArray(json.data)) return;

        const map: Record<string, string> = {};

        json.data.forEach(
          (ch: {
            id?: number | string;
            logo?: { data?: string; type?: string } | null;
          }) => {
            if (!ch?.id || !ch?.logo?.data) return;

            const data = ch.logo.data;
            const type = ch.logo.type || "image/png";

            map[String(ch.id)] = data.startsWith("data:image/")
              ? data
              : `data:${type};base64,${data}`;
          }
        );

        setChannelLogos(map);
      } catch {
        // silent fallback
      }
    };

    loadChannelLogos();
  }, []);

  // ==================================================
  // LOAD PACKS
  // ==================================================
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
      setLoadingMsg("Connecting to server...");

      try {
        const [addonRes, alacarteRes] = await Promise.all([
          fetch(
            `/api/addon/list?subscriber_id=${subscriberId}&account_id=${accountId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          ),
          fetch(
            `/api/alacarte/list?subscriber_id=${subscriberId}&account_id=${accountId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          ),
        ]);

        setLoadingMsg("Loading Add-Ons...");
        const addonData = await addonRes.json();
        if (
          addonRes.ok &&
          addonData.success &&
          Array.isArray(addonData.data)
        ) {
          setAddons(addonData.data);
        } else setAddons([]);

        setLoadingMsg("Loading À la carte packs...");
        const alacarteData = await alacarteRes.json();
        if (
          alacarteRes.ok &&
          alacarteData.success &&
          Array.isArray(alacarteData.data)
        ) {
          setAlacartes(alacarteData.data);
        } else setAlacartes([]);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong."
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [subscriberId, accountId, token]);

  useEffect(() => {
    if (addons.length > 0 || alacartes.length > 0) {
      localStorage.setItem(
        "packs",
        JSON.stringify([...addons, ...alacartes])
      );
    }
  }, [addons, alacartes]);

  // ==================================================
  // FETCH BOUQUET DETAILS
  // ==================================================
  const fetchBouquetDetails = useCallback(
    async (packId: number): Promise<BouquetDetails | null> => {
      if (!token) {
        setModalError("Not logged in.");
        return null;
      }

      setModalLoading(true);
      setModalError(null);
      setBouquetDetails(null);
      setExpandedGenre(null);

      try {
        const res = await fetch(`/api/bouquet/${packId}`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });

        const json = await res.json();

        if (!res.ok || json.success !== true || !json.data) {
          throw new Error(
            json.message || `Failed to load bouquet (${res.status})`
          );
        }

        const details: BouquetDetails = {
          id: json.data.id,
          name: json.data.name,
          channels: Array.isArray(json.data.channels)
            ? json.data.channels
            : [],
        };

        setBouquetDetails(details);

        if (details.channels.length > 0) {
          setExpandedGenre(details.channels[0].genre_id);
        }

        return details;
      } catch (err) {
        setModalError(
          err instanceof Error ? err.message : "Failed to load channels."
        );
        return null;
      } finally {
        setModalLoading(false);
      }
    },
    [token]
  );

  const openModal = async (pack: Pack, mode: ModalMode) => {
    setModalPack(pack);
    setModalMode(mode);
    setModalOpen(true);
    setBouquetDetails(null);
    setModalError(null);
    setExpandedGenre(null);
    await fetchBouquetDetails(pack.id);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalPack(null);
    setBouquetDetails(null);
    setModalError(null);
    setExpandedGenre(null);
  };

  // ==================================================
  // HELPERS
  // ==================================================
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

  const getChannelLogo = (ch: BouquetChannel): string => {
    return channelLogos[String(ch.id)] || ch.logo_url;
  };

  // ==================================================
  // RENDER
  // ==================================================
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
                  <Layers className="w-7 h-7 text-red-600 animate-pulse" />
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

            <p className="text-sm text-gray-500 font-medium text-center min-h-[20px] transition-all">
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
                This may take up to a minute.
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
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
              Add <span className="text-red-600">New Packs</span>
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Pick the channels you love — add them to your subscription
            </p>
          </div>

          {/* ═══════════ TABS ═══════════ */}
          <div className="flex gap-2 mb-6 bg-gray-50 p-1.5 rounded-full border border-gray-100 w-full sm:w-fit">
            <button
              onClick={() => {
                setActiveTab("addon");
                setSearchTerm("");
              }}
              className={`flex-1 sm:flex-none px-6 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all ${
                activeTab === "addon"
                  ? "bg-red-600 text-white shadow-md shadow-red-200"
                  : "text-gray-600 hover:text-red-600"
              }`}
            >
              Add Ons
            </button>
            <button
              onClick={() => {
                setActiveTab("alacarte");
                setSearchTerm("");
              }}
              className={`flex-1 sm:flex-none px-6 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all ${
                activeTab === "alacarte"
                  ? "bg-red-600 text-white shadow-md shadow-red-200"
                  : "text-gray-600 hover:text-red-600"
              }`}
            >
              À la carte
            </button>
          </div>

          {/* ═══════════ SEARCH BAR ═══════════ */}
          <div className="relative mb-6">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              size={18}
            />
            <input
              type="text"
              placeholder="Search packs by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-3.5 pl-12 pr-4 bg-white border border-gray-200 rounded-2xl text-gray-900 text-sm focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all shadow-sm"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* ═══════════ ERRORS ═══════════ */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 mb-4 text-sm font-medium">
              {error}
            </div>
          )}

          {/* ═══════════ EMPTY ═══════════ */}
          {!loading && !error && filteredData.length === 0 && (
            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-16 text-center">
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                <Search className="w-7 h-7 text-red-500" />
              </div>
              <p className="text-sm font-bold text-gray-900">
                No packs found
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {searchTerm
                  ? "Try a different search term"
                  : "No packs available in this category"}
              </p>
            </div>
          )}

          {/* ═══════════ PACK LIST ═══════════ */}
          {!loading && filteredData.length > 0 && (
            <div className="space-y-3">
              {filteredData.map((pack) => {
                const isSelected = !!selectedIds[pack.id];
                const price = getPrice(pack);
                const boxType = getBoxType(pack.boxtype_lbl);

                return (
                  <div
                    key={pack.id}
                    className={`group relative bg-white border rounded-2xl transition-all duration-300 overflow-hidden ${
                      isSelected
                        ? "border-red-400 shadow-lg shadow-red-100"
                        : "border-gray-100 hover:border-red-200 hover:shadow-md hover:shadow-red-50/60"
                    }`}
                  >
                    <div
                      className={`absolute left-0 top-0 bottom-0 w-1 transition-colors ${
                        isSelected ? "bg-red-600" : "bg-red-100"
                      }`}
                    />

                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 md:p-5 pl-5 md:pl-6">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
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
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-red-50 text-red-700">
                              {boxType || "PACK"}
                            </span>
                            <span className="text-[10px] text-gray-400 font-mono">
                              #{pack.id}
                            </span>
                          </div>
                          <p
                            className="font-bold text-sm md:text-base text-gray-900 leading-snug line-clamp-2"
                            title={pack.description}
                          >
                            {pack.description}
                          </p>
                          <p className="text-[11px] text-gray-400 mt-1">
                            Network Capacity Fee extra as applicable
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-start gap-4 sm:gap-6 sm:min-w-[220px]">
                        <div className="text-left sm:text-right">
                          <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                            Price
                          </p>
                          <p className="text-xl font-black text-red-600 leading-tight">
                            ₹{price.toFixed(0)}
                          </p>
                          <p className="text-[10px] text-gray-400 font-medium">
                            /month
                          </p>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <button
                            onClick={() => openModal(pack, "channels")}
                            className="text-[11px] font-bold text-red-600 hover:text-red-700 flex items-center gap-1 whitespace-nowrap"
                          >
                            <Tv size={12} />
                            Channels
                          </button>
                          <button
                            onClick={() => openModal(pack, "info")}
                            className="text-[11px] font-bold text-gray-500 hover:text-gray-800 flex items-center gap-1 whitespace-nowrap"
                          >
                            <Info size={12} />
                            Details
                          </button>
                        </div>
                      </div>

                      <div className="sm:min-w-[130px]">
                        <button
                          onClick={() => toggleSelect(pack.id)}
                          className={`w-full py-2.5 px-4 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                            isSelected
                              ? "bg-red-600 text-white shadow-md shadow-red-200 hover:bg-red-700"
                              : "bg-black text-white hover:bg-red-600"
                          }`}
                        >
                          {isSelected ? (
                            <>
                              <Check size={14} />
                              Selected
                            </>
                          ) : (
                            "Select"
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ═══════════ BOTTOM BAR ═══════════ */}
        {selectedPacks.length > 0 && (
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
                      {selectedPacks.length} Pack
                      {selectedPacks.length !== 1 ? "s" : ""} Selected
                    </p>
                  </div>
                  <p className="text-gray-400 text-[12px] truncate">
                    {selectedPacks.map((p) => p.description).join(" • ")}
                  </p>
                  <p className="text-gray-600 text-[10px] mt-0.5">
                    Network Capacity Fee and GST extra as applicable
                  </p>
                </div>

                <button
                  onClick={handleMakePayment}
                  className="shrink-0 px-8 py-3 rounded-full font-bold text-sm bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white transition-all shadow-lg shadow-red-900/40 hover:shadow-red-900/60 flex items-center justify-center gap-2"
                >
                  Make Payment
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ═══════════ MODAL ═══════════ */}
      {modalOpen && modalPack && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-3xl max-h-[88vh] bg-white rounded-2xl flex flex-col overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-gradient-to-r from-red-600 to-red-500 px-5 py-5">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
              <div className="relative flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-widest text-white/80 font-bold mb-1 flex items-center gap-1.5">
                    {modalMode === "channels" ? (
                      <>
                        <Tv size={12} />
                        Channels in this pack
                      </>
                    ) : (
                      <>
                        <Info size={12} />
                        Pack Details
                      </>
                    )}
                  </p>
                  <h3 className="text-white font-bold text-base md:text-lg leading-snug pr-4">
                    {modalPack.description}
                  </h3>
                  {bouquetDetails && (
                    <p className="text-white/80 text-xs mt-2">
                      {bouquetDetails.channels.reduce(
                        (sum, g) => sum + (g.channels_count || 0),
                        0
                      )}{" "}
                      channels • {bouquetDetails.channels.length} genres
                    </p>
                  )}
                </div>
                <button
                  onClick={closeModal}
                  className="shrink-0 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-5 bg-gray-50">
              {modalLoading && (
                <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                  <Loader2
                    className="animate-spin mb-3 text-red-600"
                    size={28}
                  />
                  <p className="text-sm font-medium">Loading channels...</p>
                </div>
              )}

              {!modalLoading && modalError && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 text-sm font-medium">
                  {modalError}
                </div>
              )}

              {!modalLoading &&
                !modalError &&
                bouquetDetails &&
                modalMode === "info" && (
                  <div className="mb-5 rounded-2xl border border-red-100 bg-white p-5">
                    <div className="flex items-center gap-2 text-red-600 mb-4">
                      <div className="p-1.5 bg-red-50 rounded-lg">
                        <Tv size={14} />
                      </div>
                      <p className="font-bold text-sm uppercase tracking-wider">
                        Package Summary
                      </p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400 text-[10px] uppercase tracking-widest font-bold mb-1">
                          Pack ID
                        </p>
                        <p className="text-gray-900 font-bold">
                          #{bouquetDetails.id}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-[10px] uppercase tracking-widest font-bold mb-1">
                          Genres
                        </p>
                        <p className="text-gray-900 font-bold">
                          {bouquetDetails.channels.length}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-[10px] uppercase tracking-widest font-bold mb-1">
                          Channels
                        </p>
                        <p className="text-gray-900 font-bold">
                          {bouquetDetails.channels.reduce(
                            (sum, g) => sum + (g.channels_count || 0),
                            0
                          )}
                        </p>
                      </div>
                      <div className="col-span-2 sm:col-span-3 pt-3 border-t border-gray-100">
                        <p className="text-gray-400 text-[10px] uppercase tracking-widest font-bold mb-1">
                          Monthly Price
                        </p>
                        <p className="text-red-600 font-black text-xl">
                          ₹ {getPrice(modalPack).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

              {!modalLoading &&
                !modalError &&
                bouquetDetails &&
                bouquetDetails.channels.length === 0 && (
                  <p className="text-center text-gray-500 text-sm py-8">
                    No channels available for this pack.
                  </p>
                )}

              {!modalLoading &&
                !modalError &&
                bouquetDetails &&
                bouquetDetails.channels.length > 0 && (
                  <div className="space-y-3">
                    {bouquetDetails.channels.map((genre) => {
                      const isExpanded = expandedGenre === genre.genre_id;

                      return (
                        <div
                          key={genre.genre_id}
                          className="rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm"
                        >
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedGenre(
                                isExpanded ? null : genre.genre_id
                              )
                            }
                            className={`w-full flex items-center justify-center relative px-14 py-5 transition-colors ${
                              isExpanded
                                ? "bg-gradient-to-r from-red-600 to-red-500 text-white"
                                : "bg-white text-gray-900 hover:bg-red-50"
                            }`}
                          >
                            <span className="text-[14px] sm:text-base font-black tracking-wide uppercase text-center">
                              {genre.genre_name}
                            </span>
                            <span
                              className={`absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                isExpanded
                                  ? "bg-white/20 text-white"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {genre.channels_count}
                            </span>
                            <span
                              className={`absolute right-4 top-1/2 -translate-y-1/2 text-lg font-bold leading-none w-6 h-6 rounded-full flex items-center justify-center ${
                                isExpanded
                                  ? "bg-white/20 text-white"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {isExpanded ? "−" : "+"}
                            </span>
                          </button>

                          {isExpanded && (
                            <div className="bg-gray-50 border-t border-gray-200 p-4">
                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                {genre.channel_list.map((ch) => (
                                  <div
                                    key={ch.id}
                                    className="group text-center border border-gray-200 p-3 rounded-xl bg-white hover:border-red-300 hover:shadow-md hover:shadow-red-50 transition-all"
                                  >
                                    <div className="w-full h-[65px] flex items-center justify-center mb-2 bg-gray-50 rounded-lg group-hover:bg-red-50/50 transition-colors">
                                      <Image
                                        src={getChannelLogo(ch)}
                                        alt={ch.name}
                                        width={120}
                                        height={65}
                                        unoptimized
                                        className="w-full h-[65px] object-contain object-center"
                                        onError={(e) => {
                                          const target = e.currentTarget;
                                          if (
                                            target.src !== ch.logo_url &&
                                            ch.logo_url
                                          ) {
                                            target.src = ch.logo_url;
                                          } else {
                                            target.src =
                                              "/placeholder.png";
                                          }
                                        }}
                                      />
                                    </div>

                                    <p className="text-[11px] font-bold text-gray-900 leading-tight line-clamp-2">
                                      {ch.name}
                                    </p>

                                    <p className="mt-1 text-[9px] text-gray-400 uppercase tracking-widest font-bold">
                                      {ch.type}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
