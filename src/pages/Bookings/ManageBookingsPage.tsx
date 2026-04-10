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
import { useGetMyBookings } from "../../hooks/useBookings";
import type {
  BookingRecord,
  BookingStatus,
  BookingDateType,
  BookingListParams,
} from "../../api/endpoints/bookings.api";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const statusColorMap: Record<
  BookingStatus,
  "success" | "warning" | "error" | "info"
> = {
  confirmed: "success",
  blocked:   "warning",
  cancelled: "error",
  expired:   "error",
  failed:    "error",
};

const statusLabelMap: Record<BookingStatus, string> = {
  confirmed: "BOOKED",
  blocked:   "BLOCKED",
  cancelled: "CANCELLED",
  expired:   "EXPIRED",
  failed:    "FAILED",
};

const fmtDate = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString("en-IN", {
         day: "2-digit", month: "short", year: "numeric",
       })
    : "—";

// ─── Component ────────────────────────────────────────────────────────────────

export default function ManageBookingsPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  // Role guard — vendor only
  useEffect(() => {
    const isVendor = user?.roles?.some((r) => r.name === "vendor");
    if (!isVendor) navigate("/unauthorized", { replace: true });
  }, [user, navigate]);

  // ── Filter state ────────────────────────────────────────────────────────────
  const [tin, setTin]           = useState("");
  const [mobile, setMobile]     = useState("");
  const [dateType, setDateType] = useState<BookingDateType>("booking");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate]     = useState("");
  const [status, setStatus]     = useState<BookingStatus | "">("");
  const [page, setPage]         = useState(1);

  // Applied params — only update when Search clicked
  const [applied, setApplied] = useState<BookingListParams>({ page: 1, limit: 15 });

  const handleSearch = () => {
    setPage(1);
    setApplied({
      page: 1, limit: 15,
      tin:      tin.trim()   || undefined,
      mobile:   mobile.trim() || undefined,
      status:   status        || undefined,
      dateType,
      fromDate: fromDate      || undefined,
      toDate:   toDate        || undefined,
    });
  };

  const handleReset = () => {
    setTin(""); setMobile(""); setDateType("booking");
    setFromDate(""); setToDate(""); setStatus(""); setPage(1);
    setApplied({ page: 1, limit: 15 });
  };

  // Sync page into applied
  useEffect(() => {
    setApplied((prev) => ({ ...prev, page }));
  }, [page]);

  // ── Data fetching ───────────────────────────────────────────────────────────
  const { data, isLoading, isError, error } = useGetMyBookings(applied);
  const bookings = data?.data ?? [];
  const meta     = data?.meta;

  // ── Columns ─────────────────────────────────────────────────────────────────
  const columns: DataTableColumn<BookingRecord>[] = useMemo(
    () => [
      {
        id: "status",
        header: "Status",
        cell: (row) => (
          <Badge size="sm" color={statusColorMap[row.status]}>
            {statusLabelMap[row.status] ?? row.status.toUpperCase()}
          </Badge>
        ),
      },
      {
        id: "tin",
        header: "Ticket Number",
        cell: (row) => (
          <span className="font-mono font-semibold text-brand-600 dark:text-brand-400 text-theme-sm">
            {row.tin ?? "—"}
          </span>
        ),
      },
      {
        id: "bookingDate",
        header: "Booking Date",
        cell: (row) => (
          <span className="text-theme-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
            {fmtDate(row.bookingDate)}
          </span>
        ),
      },
      {
        id: "journeyDate",
        header: "Journey Date",
        cell: (row) => (
          <span className="text-theme-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
            {fmtDate(row.journeyDate)}
          </span>
        ),
      },
      {
        id: "passenger",
        header: "Passenger Name",
        cell: (row) => (
          <div>
            <span className="block font-medium text-gray-800 dark:text-white/90 text-theme-sm">
              {row.passengerName}
            </span>
            {row.passengerMobile && row.passengerMobile !== "—" && (
              <span className="text-theme-xs text-gray-400">{row.passengerMobile}</span>
            )}
          </div>
        ),
      },
      {
        id: "seats",
        header: "Seats",
        cell: (row) => (
          <span className="text-theme-sm font-semibold text-gray-700 dark:text-gray-200">
            {row.seats}
          </span>
        ),
      },
      {
        id: "operator",
        header: "Operator",
        cell: (row) => (
          <span className="text-theme-sm text-brand-600 dark:text-brand-400">
            {row.operatorName}
          </span>
        ),
      },
      {
        id: "route",
        header: "Route",
        cell: (row) => (
          <span className="text-theme-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
            {row.route}
          </span>
        ),
      },
      {
        id: "fare",
        header: "Fare (Rs.)",
        cell: (row) => (
          <span className="font-semibold text-theme-sm text-gray-800 dark:text-white">
            {row.fare.toFixed(2)}
          </span>
        ),
      },
    ],
    []
  );

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <>
      <PageMeta
        title="Manage Bookings | AsiaBus"
        description="View and filter your bus booking history."
      />
      <PageBreadcrumb pageTitle="Manage Bookings" />

      <div className="space-y-5">
        {/* ── Filter Bar ────────────────────────────────────────────────── */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          {/* Row 1 */}
          <div className="flex flex-wrap items-end gap-3">
            {/* Ticket Number */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Ticket Number
              </label>
              <input
                type="text"
                placeholder="e.g. DAAKBDGU"
                value={tin}
                onChange={(e) => setTin(e.target.value)}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 dark:border-white/10 dark:bg-white/5 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 w-40"
              />
            </div>

            {/* Mobile Number */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Mobile Number
              </label>
              <input
                type="text"
                placeholder="Passenger mobile"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 dark:border-white/10 dark:bg-white/5 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 w-40"
              />
            </div>

            {/* Date Type */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Date Filter By
              </label>
              <select
                value={dateType}
                onChange={(e) => setDateType(e.target.value as BookingDateType)}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 dark:border-white/10 dark:bg-white/5 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 w-40"
              >
                <option value="booking">Date of Booking</option>
                <option value="journey">Journey Date</option>
              </select>
            </div>

            {/* From Date */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
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
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
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

            {/* Status */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Status
              </label>
              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as BookingStatus | "")
                }
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 dark:border-white/10 dark:bg-white/5 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 w-36"
              >
                <option value="">All Status</option>
                <option value="confirmed">Booked</option>
                <option value="cancelled">Cancelled</option>
                <option value="blocked">Blocked</option>
                <option value="expired">Expired</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="flex gap-2 pb-0.5">
              <Button size="sm" variant="primary" onClick={handleSearch}>
                Search
              </Button>
              <Button size="sm" variant="outline" onClick={handleReset}>
                Reset
              </Button>
            </div>
          </div>
        </div>

        {/* ── Data Table ────────────────────────────────────────────────── */}
        <ComponentCard title="Booking History">
          {isError && (
            <div className="mb-4 rounded-lg bg-error-50 dark:bg-error-500/10 border border-error-200 dark:border-error-500/20 px-4 py-3 text-sm text-error-700 dark:text-error-400">
              {(error as Error)?.message || "Failed to load bookings. Please try again."}
            </div>
          )}

          <DataTable
            columns={columns}
            data={bookings}
            isLoading={isLoading}
            emptyMessage="No bookings found for the selected filters."
          />

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between px-1">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Page {meta.page} of {meta.totalPages} &nbsp;·&nbsp; {meta.total} total
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
