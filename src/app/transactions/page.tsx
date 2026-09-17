// app/transactions/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Receipt,
  Loader2,
  FileQuestion,
  CreditCard,
  Calendar,
  Hash,
  Tag,
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

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("access_token")
      : null;
  const accountId =
    typeof window !== "undefined"
      ? localStorage.getItem("accountId")
      : null;

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
        setError(err instanceof Error ? err.message : "Something went wrong.");
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

  // ✅ Payment type classification (credit/debit)
  const getPaymentKind = (tx: Transaction): "credit" | "debit" => {
    const label = (tx.transactionfor_lbl || tx.name_lbl || "").toLowerCase();
    // Refund = credit, else debit
    if (label.includes("refund")) return "credit";
    return "debit";
  };

  // Filter transactions
  const filteredTransactions = transactions.filter((tx) => {
    if (filter === "all") return true;
    return getPaymentKind(tx) === filter;
  });

  // ────────────────────────────────────────────────
  // Render
  // ────────────────────────────────────────────────
  return (
    <>
      <UserHeader />

      <div className="min-h-screen bg-[#0d0d0d] text-white pt-24 pb-16 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Back button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-4 transition"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          {/* Header */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="bg-green-600/20 p-2.5 rounded-lg">
                <Receipt className="text-green-500" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-yellow-400">
                  Transactions
                </h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  Your payment history & receipts
                </p>
              </div>
            </div>

            {/* Filter pills */}
            {!loading && transactions.length > 0 && (
              <div className="flex gap-1 bg-black border border-gray-800 rounded-md p-1">
                {(["all", "debit", "credit"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide rounded transition ${
                      filter === f
                        ? "bg-yellow-500 text-black"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Summary Stats */}
          {!loading && transactions.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
              <div className="bg-black border border-gray-800 rounded-lg p-4">
                <p className="text-[10px] text-gray-500 uppercase tracking-wide">
                  Total Transactions
                </p>
                <p className="text-xl font-bold text-white mt-1">
                  {transactions.length}
                </p>
              </div>
              <div className="bg-black border border-gray-800 rounded-lg p-4">
                <p className="text-[10px] text-gray-500 uppercase tracking-wide">
                  Total Amount
                </p>
                <p className="text-xl font-bold text-yellow-400 mt-1">
                  ₹{" "}
                  {transactions
                    .reduce((sum, tx) => sum + getAmount(tx), 0)
                    .toFixed(2)}
                </p>
              </div>
              <div className="bg-black border border-gray-800 rounded-lg p-4 col-span-2 md:col-span-1">
                <p className="text-[10px] text-gray-500 uppercase tracking-wide">
                  Total Tax
                </p>
                <p className="text-xl font-bold text-cyan-400 mt-1">
                  ₹{" "}
                  {transactions
                    .reduce((sum, tx) => sum + getTax(tx), 0)
                    .toFixed(2)}
                </p>
              </div>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center gap-2 py-20 text-gray-400 text-sm">
              <Loader2 size={18} className="animate-spin" />
              Loading transactions...
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="bg-red-950 border border-red-700 rounded-md p-4 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && filteredTransactions.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <div className="bg-black border border-gray-800 rounded-full p-6 mb-4">
                <FileQuestion size={48} className="opacity-60" />
              </div>
              <p className="text-base font-semibold text-gray-400">
                {transactions.length === 0
                  ? "No Transactions Found"
                  : `No ${filter} transactions`}
              </p>
              <p className="text-xs text-gray-600 mt-1 text-center">
                {transactions.length === 0
                  ? "Your payment history will appear here once you recharge."
                  : "Try changing the filter above."}
              </p>
            </div>
          )}

          {/* ✅ NEW CARD LAYOUT */}
          {!loading && !error && filteredTransactions.length > 0 && (
            <div className="space-y-4">
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
                    className="group relative bg-gradient-to-br from-[#141414] to-[#0a0a0a] border border-gray-800 hover:border-gray-600 rounded-xl overflow-hidden transition-all"
                  >
                    {/* ✅ Top colored accent bar */}
                    <div
                      className={`h-1 w-full ${
                        isCredit
                          ? "bg-gradient-to-r from-green-500 via-emerald-400 to-transparent"
                          : "bg-gradient-to-r from-red-500 via-orange-400 to-transparent"
                      }`}
                    />

                    <div className="p-5">
                      {/* Top Row: Icon + Receipt + Amount */}
                      <div className="flex items-start justify-between gap-3 mb-4">
                        {/* Left: Payment icon + type */}
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div
                            className={`shrink-0 w-11 h-11 rounded-full flex items-center justify-center ${
                              isCredit
                                ? "bg-green-500/15 border border-green-500/30"
                                : "bg-red-500/15 border border-red-500/30"
                            }`}
                          >
                            <CreditCard
                              size={18}
                              className={
                                isCredit ? "text-green-400" : "text-red-400"
                              }
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[10px] uppercase tracking-wider font-bold text-gray-500">
                              {isCredit ? "Credit / Refund" : "Payment"}
                            </p>
                            <p className="text-sm font-semibold text-white truncate">
                              {tx.transactionfor_lbl ||
                                tx.name_lbl ||
                                "Recharge"}
                            </p>
                          </div>
                        </div>

                        {/* Right: Amount */}
                        <div className="text-right shrink-0">
                          <p
                            className={`text-2xl font-bold tracking-tight ${
                              isCredit ? "text-green-400" : "text-yellow-400"
                            }`}
                          >
                            {isCredit ? "+" : "-"} ₹ {amount.toFixed(2)}
                          </p>
                          <p className="text-[10px] text-gray-500 mt-0.5">
                            incl. tax
                          </p>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="border-t border-dashed border-gray-800 my-3" />

                      {/* Middle Row: Details Grid */}
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        {/* Date */}
                        <div className="flex items-start gap-2">
                          <Calendar
                            size={13}
                            className="text-gray-500 mt-0.5 shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-[10px] text-gray-500 uppercase tracking-wide">
                              Date
                            </p>
                            <p className="text-[12px] text-gray-200 font-medium truncate">
                              {formatDate(tx.created_at)}
                              {formatTime(tx.created_at) && (
                                <span className="text-gray-500 ml-1">
                                  {formatTime(tx.created_at)}
                                </span>
                              )}
                            </p>
                          </div>
                        </div>

                        {/* Receipt No */}
                        {receiptNo && (
                          <div className="flex items-start gap-2">
                            <Hash
                              size={13}
                              className="text-gray-500 mt-0.5 shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="text-[10px] text-gray-500 uppercase tracking-wide">
                                Receipt
                              </p>
                              <p className="text-[12px] text-cyan-300 font-mono font-medium truncate">
                                {receiptNo}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Amount breakdown */}
                      <div className="flex items-center gap-3 text-[11px] bg-black/60 border border-gray-800/70 rounded-md px-3 py-2">
                        <div className="flex-1">
                          <p className="text-gray-500">Base Amount</p>
                          <p className="text-gray-200 font-semibold">
                            ₹ {base.toFixed(2)}
                          </p>
                        </div>
                        <div className="w-px h-6 bg-gray-800" />
                        <div className="flex-1">
                          <p className="text-gray-500">Tax</p>
                          <p className="text-gray-200 font-semibold">
                            ₹ {tax.toFixed(2)}
                          </p>
                        </div>
                        <div className="w-px h-6 bg-gray-800" />
                        <div className="flex-1">
                          <p className="text-gray-500">Total</p>
                          <p className="text-yellow-400 font-bold">
                            ₹ {amount.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {/* Remark */}
                      {tx.remark && (
                        <div className="mt-3 flex items-start gap-2">
                          <Tag
                            size={12}
                            className="text-gray-600 mt-0.5 shrink-0"
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
