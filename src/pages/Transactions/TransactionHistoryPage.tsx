import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import { DataTable } from "../../components/ui/data-table";
import type { DataTableColumn } from "../../components/ui/data-table";
import Badge from "../../components/ui/badge/Badge";
import Button from "../../components/ui/button/Button";
import { useAuthStore } from "../../store/authStore";
import {
  useGetAllTransactions,
  useGetVendorOptions,
} from "../../hooks/useTransactions";
import type { AdminTransaction } from "../../api/endpoints/transactions.api";
import type { TransactionListParams } from "../../api/endpoints/transactions.api";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const statusColor = (
  status: AdminTransaction["status"]
): "success" | "warning" | "error" => {
  if (status === "captured") return "success";
  if (status === "pending") return "warning";
  return "error";
};

const typeColor = (type: "CREDIT" | "DEBIT"): "success" | "error" =>
  type === "CREDIT" ? "success" : "error";

const fmt = (n: string | number) =>
  `₹${parseFloat(String(n)).toFixed(2)}`;

// ─── Component ───────────────────────────────────────────────────────────────

export default function TransactionHistoryPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  // ── Role guard ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const isAdmin = user?.roles?.some(
      (r) => r.name === "admin" || r.name === "super_admin"
    );
    if (!isAdmin) navigate("/unauthorized", { replace: true });
  }, [user, navigate]);

  // ── Filter state ────────────────────────────────────────────────────────────
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [vendorId, setVendorId] = useState<number | "">("");
  const [page, setPage] = useState(1);

  // Applied filters (only change when user clicks "Apply")
  const [applied, setApplied] = useState<TransactionListParams>({
    page: 1,
    limit: 15,
  });

  const handleApply = () => {
    setPage(1);
    setApplied({
      page: 1,
      limit: 15,
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
      vendorId: vendorId !== "" ? Number(vendorId) : undefined,
    });
  };

  const handleReset = () => {
    setFromDate("");
    setToDate("");
    setVendorId("");
    setPage(1);
    setApplied({ page: 1, limit: 15 });
  };

  // Sync pagination changes into applied without re-running user filters
  useEffect(() => {
    setApplied((prev) => ({ ...prev, page }));
  }, [page]);

  // ── Data fetching ───────────────────────────────────────────────────────────
  const { data, isLoading, isError, error } = useGetAllTransactions(applied);
  const { data: vendorOptions = [] } = useGetVendorOptions();

  const transactions = data?.data ?? [];
  const meta = data?.meta;

  // ── Summary stats ──────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const credits = transactions
      .filter((t) => t.type === "CREDIT")
      .reduce((s, t) => s + parseFloat(t.amount), 0);
    const debits = transactions
      .filter((t) => t.type === "DEBIT")
      .reduce((s, t) => s + parseFloat(t.amount), 0);
    return { total: transactions.length, credits, debits };
  }, [transactions]);

  // ── Table columns ──────────────────────────────────────────────────────────
  const columns: DataTableColumn<AdminTransaction>[] = useMemo(
    () => [
      {
        id: "id",
        header: "#",
        accessorKey: "id",
        cell: (row) => (
          <span className="text-gray-400 text-theme-xs font-mono">
            #{row.id}
          </span>
        ),
      },
      {
        id: "vendor",
        header: "Vendor",
        cell: (row) => (
          <div>
            <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
              {row.vendorName || "—"}
            </span>
            {row.companyName && (
              <span className="text-theme-xs text-gray-500 dark:text-gray-400">
                {row.companyName}
              </span>
            )}
          </div>
        ),
      },
      {
        id: "date",
        header: "Date & Time",
        cell: (row) => (
          <span className="text-theme-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
            {new Date(row.created_at).toLocaleString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        ),
      },
      {
        id: "type",
        header: "Type",
        cell: (row) => (
          <Badge size="sm" color={typeColor(row.type)}>
            {row.type}
          </Badge>
        ),
      },
      {
        id: "txnType",
        header: "Category",
        cell: (row) => (
          <span className="text-theme-xs text-gray-500 dark:text-gray-400 capitalize">
            {row.transactionType?.replace(/_/g, " ").toLowerCase() || "—"}
          </span>
        ),
      },
      {
        id: "amount",
        header: "Amount",
        cell: (row) => (
          <span
            className={`font-semibold text-theme-sm ${
              row.type === "CREDIT"
                ? "text-success-600 dark:text-success-400"
                : "text-error-600 dark:text-error-400"
            }`}
          >
            {row.type === "CREDIT" ? "+" : "-"} {fmt(row.amount)}
          </span>
        ),
      },
      {
        id: "balance",
        header: "Balance After",
        cell: (row) => (
          <span className="text-theme-sm text-gray-700 dark:text-gray-200">
            {fmt(row.balance)}
          </span>
        ),
      },
      {
        id: "status",
        header: "Status",
        cell: (row) => (
          <Badge size="sm" color={statusColor(row.status)}>
            {row.status.toUpperCase()}
          </Badge>
        ),
      },
    ],
    []
  );

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <PageMeta
        title="Transaction History | Admin"
        description="View and filter all vendor wallet transactions."
      />
      <PageBreadcrumb pageTitle="Transaction History" />

      <div className="space-y-6">
        {/* ── Filter Bar ───────────────────────────────────────────────── */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-4">
            Filters
          </h3>
          <div className="flex flex-wrap items-end gap-4">
            {/* From Date */}
            <div className="flex flex-col gap-1 min-w-[160px]">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                From Date
              </label>
              <input
                type="date"
                value={fromDate}
                max={toDate || undefined}
                onChange={(e) => setFromDate(e.target.value)}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 dark:border-white/10 dark:bg-white/5 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* To Date */}
            <div className="flex flex-col gap-1 min-w-[160px]">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                To Date
              </label>
              <input
                type="date"
                value={toDate}
                min={fromDate || undefined}
                onChange={(e) => setToDate(e.target.value)}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 dark:border-white/10 dark:bg-white/5 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* Vendor Dropdown */}
            <div className="flex flex-col gap-1 min-w-[220px]">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                Vendor
              </label>
              <select
                value={vendorId}
                onChange={(e) =>
                  setVendorId(e.target.value ? Number(e.target.value) : "")
                }
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 dark:border-white/10 dark:bg-white/5 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="">All Vendors</option>
                {vendorOptions.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.fullName}
                    {v.companyName ? ` — ${v.companyName}` : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pb-0.5">
              <Button size="sm" variant="primary" onClick={handleApply}>
                Apply Filters
              </Button>
              <Button size="sm" variant="outline" onClick={handleReset}>
                Reset
              </Button>
            </div>
          </div>
        </div>

        {/* ── Summary Stats ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Total Transactions"
            value={meta?.total ?? stats.total}
            accent="slate"
          />
          <StatCard
            label="Total Credits"
            value={`₹${stats.credits.toFixed(2)}`}
            accent="success"
          />
          <StatCard
            label="Total Debits"
            value={`₹${stats.debits.toFixed(2)}`}
            accent="error"
          />
        </div>

        {/* ── Data Table ───────────────────────────────────────────────── */}
        <ComponentCard title="All Transactions">
          {isError && (
            <div className="mb-4 rounded-lg bg-error-50 dark:bg-error-500/10 border border-error-200 dark:border-error-500/20 px-4 py-3 text-sm text-error-700 dark:text-error-400">
              {(error as Error)?.message ||
                "Failed to load transactions. Please try again."}
            </div>
          )}

          <DataTable
            columns={columns}
            data={transactions}
            isLoading={isLoading}
            emptyMessage="No transactions found for the selected filters."
          />

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between px-1">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Showing page {meta.page} of {meta.totalPages} &nbsp;·&nbsp;{" "}
                {meta.total} total records
              </span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={page >= meta.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </ComponentCard>
      </div>
    </>
  );
}

// ─── Stat Card Sub-component ──────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string | number;
  accent: "slate" | "success" | "error";
}

const accentMap: Record<
  StatCardProps["accent"],
  { border: string; text: string; label: string }
> = {
  slate: {
    border: "border-slate-200 dark:border-slate-800",
    text: "text-slate-800 dark:text-white",
    label: "text-slate-500 dark:text-slate-400",
  },
  success: {
    border: "border-success-200 dark:border-success-500/20",
    text: "text-success-700 dark:text-success-400",
    label: "text-success-600 dark:text-success-400",
  },
  error: {
    border: "border-error-200 dark:border-error-500/20",
    text: "text-error-700 dark:text-error-400",
    label: "text-error-600 dark:text-error-400",
  },
};

function StatCard({ label, value, accent }: StatCardProps) {
  const c = accentMap[accent];
  return (
    <div
      className={`bg-white dark:bg-slate-900 border ${c.border} rounded-2xl px-6 py-4 shadow-sm`}
    >
      <p className={`text-xs font-medium uppercase tracking-wide ${c.label}`}>
        {label}
      </p>
      <p className={`mt-1 text-2xl font-bold ${c.text}`}>{value}</p>
    </div>
  );
}
