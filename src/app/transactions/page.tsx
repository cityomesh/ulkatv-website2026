// app/transactions/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Receipt,
  FileQuestion,
  Calendar,
  Hash,
  Tag,
  Sparkles,
  TrendingUp,
  TrendingDown,
  IndianRupee,
  Layers,
} from "lucide-react";
import UserHeader from "../../components/UserHeader";

interface Transaction {
  id: string | number;
  total_amount: string | number;
  tax: string | number;
  mrp?: string | number;
  amount?: string | number;
  discount?: string | number;
  tds?: string | number;
  created_at: string;
  reciept_no?: string;
  receipt_no?: string;
  remark?: string;
  name_lbl?: string;
  transactionfor_lbl?: string;
  operator_id_lbl?: string;
  created_by_lbl?: string;
  notes_lbl?: string;
}

export default function TransactionsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "credit" | "debit">("all");

  // ✅ Rotating loading message
  const [loadingMsg, setLoadingMsg] = useState("Connecting to server...");

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("access_token")
      : null;
  const accountId =
    typeof window !== "undefined"
      ? localStorage.getItem("accountId")
      : null;

  // ==================================================
  // LOADING MESSAGE ROTATION
  // ==================================================
  useEffect(() => {
    if (!loading) return;

    const messages = [
      "Connecting to server...",
      "Fetching your transactions...",
      "Loading payment history...",
      "Preparing receipts...",
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
  // FETCH TRANSACTIONS
  // ==================================================
  useEffect(() => {
    if (!token || !accountId) {
      setError("You are not logged in.");
      setLoading(false);
      return;
    }

    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `/api/transaction/list?account_id=${accountId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = await res.json();
        console.log("[Transactions] Response:", data);

        if (!res.ok) {
          throw new Error(
            (typeof data.message === "string" && data.message) ||
              data.error ||
              "Failed to fetch transactions."
          );
        }

        if (data.success && Array.isArray(data.data)) {
          setTransactions(data.data);
        } else if (Array.isArray(data)) {
          setTransactions(data);
        } else {
          setTransactions([]);
        }
      } catch (err) {
        console.error("Error loading transactions:", err);
        setError(
          err instanceof Error ? err.message : "Something went wrong."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [token, accountId]);

  // ────────────────────────────────────────────────
  // Helpers
  // ────────────────────────────────────────────────
  const formatDate = (str?: string) => {
    if (!str) return "--";
    const d = new Date(str.split(" ")[0]);
    if (isNaN(d.getTime())) return str;
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  const formatTime = (str?: string) => {
    if (!str) return "";
    const parts = str.split(" ");
    return parts[1] || "";
  };

  const getAmount = (tx: Transaction) => {
    return parseFloat(String(tx.total_amount || tx.amount || "0")) || 0;
  };

  const getTax = (tx: Transaction) => {
    return parseFloat(String(tx.tax || "0")) || 0;
  };

  const getBaseAmount = (tx: Transaction) => {
    const total = getAmount(tx);
    const tax = getTax(tx);
    return Math.max(total - tax, 0);
  };

  const getReceiptNo = (tx: Transaction) => {
    return tx.reciept_no || tx.receipt_no || "";
  };

  const getPaymentKind = (tx: Transaction): "credit" | "debit" => {
    const label = (tx.transactionfor_lbl || tx.name_lbl || "").toLowerCase();
    if (label.includes("refund")) return "credit";
    return "debit";
  };

  const filteredTransactions = transactions.filter((tx) => {
    if (filter === "all") return true;
    return getPaymentKind(tx) === filter;
  });

  // Stats
  const totalAmount = transactions.reduce(
    (sum, tx) => sum + getAmount(tx),
    0
  );
  const totalTax = transactions.reduce((sum, tx) => sum + getTax(tx), 0);
  const totalCount = transactions.length;

  // ────────────────────────────────────────────────
  // Render
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
                  <Receipt className="w-7 h-7 text-red-600 animate-pulse" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <h2 className="text-lg font-black text-gray-900">
                Loading Transactions
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

      <div className="min-h-screen bg-white text-gray-900 pb-16">
        <div className="max-w-4xl mx-auto px-4 md:px-8 pt-24">
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
                Payment History
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
              Your <span className="text-red-600">Transactions</span>
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              All your recharges, refunds &amp; receipts in one place
            </p>
          </div>

          {/* ═══════════ SUMMARY STATS STRIP ═══════════ */}
          {!loading && transactions.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 divide-x divide-gray-100 bg-white border border-gray-100 rounded-2xl mb-6 shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-4">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                  <Layers className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                    Total
                  </p>
                  <p className="text-sm font-bold text-gray-900">
                    {totalCount}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 px-4 py-4">
                <div className="w-10 h-10 rounded-xl bg-red-600 text-white shadow-md shadow-red-200 flex items-center justify-center shrink-0">
                  <IndianRupee className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                    Amount
                  </p>
                  <p className="text-sm font-bold text-red-600">
                    ₹ {totalAmount.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="col-span-2 md:col-span-1 flex items-center gap-3 px-4 py-4">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                  <Receipt className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                    Tax
                  </p>
                  <p className="text-sm font-bold text-gray-900">
                    ₹ {totalTax.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════ FILTER PILLS ═══════════ */}
          {!loading && transactions.length > 0 && (
            <div className="flex gap-2 mb-6 bg-gray-50 p-1.5 rounded-full border border-gray-100 w-full sm:w-fit">
              {(["all", "debit", "credit"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`flex-1 sm:flex-none px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-all ${
                    filter === f
                      ? "bg-red-600 text-white shadow-md shadow-red-200"
                      : "text-gray-600 hover:text-red-600"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          )}

          {/* ═══════════ ERROR ═══════════ */}
          {!loading && error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 text-sm font-medium">
              {error}
            </div>
          )}

          {/* ═══════════ EMPTY ═══════════ */}
          {!loading && !error && filteredTransactions.length === 0 && (
            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-16 text-center">
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                <FileQuestion className="w-7 h-7 text-red-500" />
              </div>
              <p className="text-sm font-bold text-gray-900">
                {transactions.length === 0
                  ? "No transactions found"
                  : `No ${filter} transactions`}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {transactions.length === 0
                  ? "Your payment history will appear here once you recharge."
                  : "Try changing the filter above."}
              </p>
            </div>
          )}

          {/* ═══════════ TRANSACTION LIST ═══════════ */}
          {!loading && !error && filteredTransactions.length > 0 && (
            <div className="space-y-3">
              {filteredTransactions.map((tx, idx) => {
                const amount = getAmount(tx);
                const tax = getTax(tx);
                const base = getBaseAmount(tx);
                const receiptNo = getReceiptNo(tx);
                const kind = getPaymentKind(tx);
                const isCredit = kind === "credit";

                return (
                  <div
                    key={tx.id ?? idx}
                    className="group relative bg-white border border-gray-100 hover:border-red-200 rounded-2xl transition-all duration-300 overflow-hidden hover:shadow-lg hover:shadow-red-50/60"
                  >
                    {/* Left accent bar */}
                    <div
                      className={`absolute left-0 top-0 bottom-0 w-1 transition-colors ${
                        isCredit ? "bg-emerald-500" : "bg-red-500"
                      }`}
                    />

                    <div className="p-4 md:p-5 pl-5 md:pl-6">
                      {/* Top Row: Icon + Type | Amount */}
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div
                            className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
                              isCredit
                                ? "bg-emerald-50 group-hover:bg-emerald-600"
                                : "bg-red-50 group-hover:bg-red-600"
                            }`}
                          >
                            {isCredit ? (
                              <TrendingUp
                                size={18}
                                className="text-emerald-600 group-hover:text-white transition-colors"
                              />
                            ) : (
                              <TrendingDown
                                size={18}
                                className="text-red-600 group-hover:text-white transition-colors"
                              />
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span
                                className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                                  isCredit
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-red-50 text-red-700"
                                }`}
                              >
                                {isCredit ? "Credit" : "Debit"}
                              </span>
                              {receiptNo && (
                                <span className="text-[10px] text-gray-400 font-mono">
                                  #{receiptNo}
                                </span>
                              )}
                            </div>
                            <p className="text-sm font-bold text-gray-900 truncate">
                              {tx.transactionfor_lbl ||
                                tx.name_lbl ||
                                "Recharge"}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <p
                            className={`text-xl font-black tracking-tight leading-tight ${
                              isCredit
                                ? "text-emerald-600"
                                : "text-red-600"
                            }`}
                          >
                            {isCredit ? "+" : "-"} ₹
                            {amount.toFixed(2)}
                          </p>
                          <p className="text-[10px] text-gray-400 font-medium mt-0.5">
                            incl. tax
                          </p>
                        </div>
                      </div>

                      {/* Middle Row: Date + Time */}
                      <div className="flex items-center gap-4 mb-3 text-[11px] text-gray-500">
                        <span className="flex items-center gap-1.5">
                          <Calendar size={12} className="text-gray-400" />
                          {formatDate(tx.created_at)}
                          {formatTime(tx.created_at) && (
                            <span className="text-gray-400">
                              • {formatTime(tx.created_at)}
                            </span>
                          )}
                        </span>
                        {receiptNo && (
                          <span className="flex items-center gap-1.5">
                            <Hash size={12} className="text-gray-400" />
                            <span className="font-mono">{receiptNo}</span>
                          </span>
                        )}
                      </div>

                      {/* Amount breakdown */}
                      <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5">
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                            Base
                          </p>
                          <p className="text-xs font-bold text-gray-900">
                            ₹{base.toFixed(2)}
                          </p>
                        </div>
                        <div className="w-px h-6 bg-gray-200" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                            Tax
                          </p>
                          <p className="text-xs font-bold text-gray-900">
                            ₹{tax.toFixed(2)}
                          </p>
                        </div>
                        <div className="w-px h-6 bg-gray-200" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
                            Total
                          </p>
                          <p
                            className={`text-xs font-black ${
                              isCredit
                                ? "text-emerald-600"
                                : "text-red-600"
                            }`}
                          >
                            ₹{amount.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {/* Remark */}
                      {tx.remark && (
                        <div className="mt-3 flex items-start gap-2">
                          <Tag
                            size={12}
                            className="text-gray-400 mt-0.5 shrink-0"
                          />
                          <p className="text-[11px] text-gray-500 leading-snug line-clamp-2">
                            {tx.remark}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
