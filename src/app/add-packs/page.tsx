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
  // LOAD CHANNEL LOGOS (base64)
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

        const addonData = await addonRes.json();
        if (
          addonRes.ok &&
          addonData.success &&
          Array.isArray(addonData.data)
        ) {
          setAddons(addonData.data);
        } else setAddons([]);

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

      <div className="min-h-screen bg-[#0d0d0d] text-white pb-32">
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

          {/* CARD GRID */}
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
                  <div className="flex justify-between items-start gap-2 mb-4">
                    <p
                      className="text-[13px] font-semibold leading-snug text-white line-clamp-3"
                      title={pack.description}
                    >
                      {pack.description}
                    </p>
                    <button
                      onClick={() => openModal(pack, "info")}
                      className="shrink-0 text-cyan-400 hover:text-cyan-300 transition"
                      title="More info"
                    >
                      <Info size={16} />
                    </button>
                  </div>

                  <div className="mb-4">
                    <span className="text-cyan-400 text-[22px] font-semibold">
                      ₹ {price.toFixed(2)}
                    </span>
                    <span className="text-cyan-400 text-[12px] font-medium">
                      /month
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-gray-300 text-[12px] mb-3">
                    <Check size={13} className="text-gray-400" />
                    <span>{boxType}</span>
                  </div>

                  <button
                    onClick={() => openModal(pack, "channels")}
                    className="text-cyan-400 text-[12px] underline hover:text-cyan-300 self-start mb-4"
                  >
                    View Channels
                  </button>

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

                  <p className="text-[10px] text-gray-400 mt-auto leading-tight">
                    Network Capacity Fee extra as applicable
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* BOTTOM BAR */}
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

      {/* MODAL */}
      {modalOpen && modalPack && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-3xl max-h-[88vh] bg-[#111] border border-gray-800 rounded-lg flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 p-5 border-b border-gray-800">
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-wider text-cyan-400 font-semibold mb-1">
                  {modalMode === "channels"
                    ? "Channels in this pack"
                    : "Pack Details"}
                </p>
                <h3 className="text-white font-semibold text-base leading-snug pr-4">
                  {modalPack.description}
                </h3>
                {bouquetDetails && (
                  <p className="text-gray-400 text-xs mt-1">
                    Total{" "}
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
                className="shrink-0 p-1.5 rounded hover:bg-gray-800 text-gray-400 hover:text-white transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5">
              {modalLoading && (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                  <Loader2 className="animate-spin mb-3" size={26} />
                  <p className="text-sm">Loading channels...</p>
                </div>
              )}

              {!modalLoading && modalError && (
                <div className="rounded-md border border-red-700 bg-red-950/60 p-4 text-red-400 text-sm">
                  {modalError}
                </div>
              )}

              {!modalLoading &&
                !modalError &&
                bouquetDetails &&
                modalMode === "info" && (
                  <div className="mb-5 rounded-md border border-cyan-900 bg-cyan-950/30 p-4">
                    <div className="flex items-center gap-2 text-cyan-400 mb-3">
                      <Tv size={16} />
                      <p className="font-semibold text-sm">
                        Package Summary
                      </p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                      <div>
                        <p className="text-gray-500 text-xs">Pack ID</p>
                        <p className="text-white">{bouquetDetails.id}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">
                          Total Genres
                        </p>
                        <p className="text-white">
                          {bouquetDetails.channels.length}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">
                          Total Channels
                        </p>
                        <p className="text-white">
                          {bouquetDetails.channels.reduce(
                            (sum, g) => sum + (g.channels_count || 0),
                            0
                          )}
                        </p>
                      </div>
                      <div className="col-span-2 sm:col-span-3">
                        <p className="text-gray-500 text-xs">Price</p>
                        <p className="text-cyan-400 font-semibold">
                          ₹ {getPrice(modalPack).toFixed(2)} / month
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

              {/* GENRE ACCORDION */}
              {!modalLoading &&
                !modalError &&
                bouquetDetails &&
                bouquetDetails.channels.length > 0 && (
                  <div className="space-y-3">
                    {bouquetDetails.channels.map((genre) => {
                      const isExpanded =
                        expandedGenre === genre.genre_id;

                      return (
                        <div
                          key={genre.genre_id}
                          className="rounded-md overflow-hidden border border-gray-800"
                        >
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedGenre(
                                isExpanded ? null : genre.genre_id
                              )
                            }
                            className="w-full flex items-center justify-center relative px-14 py-5 bg-white text-black hover:bg-gray-100 transition-colors"
                          >
                            <span className="text-[15px] sm:text-base font-bold tracking-wide uppercase text-center">
                              {genre.genre_name}
                            </span>
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[11px] font-semibold px-2 py-0.5 rounded bg-gray-200 text-gray-700">
                              {genre.channels_count}
                            </span>
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg font-bold leading-none">
                              {isExpanded ? "−" : "+"}
                            </span>
                          </button>

                          {isExpanded && (
                            <div className="bg-[#0a0a0a] border-t border-gray-800 p-4">
                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {genre.channel_list.map((ch) => (
                                  <div
                                    key={ch.id}
                                    className="text-center border border-gray-800 p-3 rounded-md bg-black hover:border-cyan-700 transition"
                                  >
                                    {/* ✅ next/image — no warning, no cut */}
                                    <div className="w-full h-[65px] flex items-center justify-center mb-2">
                                      <Image
                                        src={getChannelLogo(ch)}
                                        alt={ch.name}
                                        width={120}
                                        height={65}
                                        unoptimized
                                        className="w-full h-[65px] object-contain object-center"
                                        onError={(e) => {
                                          const target =
                                            e.currentTarget;
                                          if (
                                            target.src !==
                                              ch.logo_url &&
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

                                    <p className="text-[12px] font-semibold text-white leading-tight line-clamp-2">
                                      {ch.name}
                                    </p>

                                    <p className="mt-1 text-[10px] text-gray-400 uppercase">
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
