import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import { DataTable, TableIconButton } from "../../components/ui/data-table";
import type { DataTableColumn } from "../../components/ui/data-table";
import Badge from "../../components/ui/badge/Badge";
import Button from "../../components/ui/button/Button";
import PermissionGate from "../../components/common/PermissionGate";
import {
  useGetVendors,
  useDeleteVendor,
  useApproveVendor,
  useRejectVendor,
} from "../../hooks/useVendors";
import type {
  VendorListItem,
  VendorStatus,
} from "../../api/endpoints/vendors.api";
import { EyeIcon, CheckLineIcon, CloseLineIcon, TrashBinIcon } from "../../icons";

export const statusColors: Record<
  VendorStatus,
  "warning" | "success" | "error"
> = {
  pending: "warning",
  approved: "success",
  rejected: "error",
};

export default function VendorsListPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchDebounced, setSearchDebounced] = useState("");
  const [statusFilter, setStatusFilter] = useState<VendorStatus | "">("");

  useEffect(() => {
    const t = setTimeout(() => setSearchDebounced(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const params = useMemo(
    () => ({
      page,
      limit: 10,
      status: statusFilter || undefined,
      search: searchDebounced || undefined,
    }),
    [page, searchDebounced, statusFilter]
  );

  const { data, isLoading } = useGetVendors(params);
  const deleteVendor = useDeleteVendor();
  const approveVendor = useApproveVendor();
  const rejectVendor = useRejectVendor();

  const vendors = data?.data ?? [];
  const meta = data?.meta;

  const handleDelete = (id: number, name: string) => {
    if (window.confirm(`Deactivate vendor "${name}"?`)) {
      deleteVendor.mutate(id);
    }
  };

  const handleApprove = (id: number, name: string) => {
    if (window.confirm(`Approve vendor "${name}"?`)) {
      approveVendor.mutate(id);
    }
  };

  const handleReject = (id: number, name: string) => {
    if (window.confirm(`Reject vendor "${name}"?`)) {
      rejectVendor.mutate(id);
    }
  };

  const columns: DataTableColumn<VendorListItem>[] = useMemo(
    () => [
      {
        id: "name",
        header: "Name",
        accessorKey: "fullName",
        enableSorting: true,
        cell: (row) => (
          <div>
            <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
              {row.fullName}
            </span>
            {row.email && (
              <span className="text-theme-xs text-gray-500 dark:text-gray-400">
                {row.email}
              </span>
            )}
          </div>
        ),
      },
      {
        id: "company",
        header: "Company",
        accessorKey: "companyName",
        enableSorting: true,
        cell: (row) => (
          <span className="text-gray-500 text-theme-sm dark:text-gray-400">
            {row.companyName}
          </span>
        ),
      },
      {
        id: "mobile",
        header: "Mobile",
        accessorKey: "mobileNo",
        cell: (row) => (
          <span className="text-theme-sm dark:text-gray-400">
            {row.mobileNo}
          </span>
        ),
      },
      {
        id: "city",
        header: "City",
        accessorKey: "city",
        cell: (row) => (
          <span className="text-theme-sm text-gray-500 dark:text-gray-400">
            {row.city}
          </span>
        ),
      },
      {
        id: "status",
        header: "Status",
        cell: (row) => (
          <Badge size="sm" color={statusColors[row.status]}>
            {row.status}
          </Badge>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: (row) => (
          <div className="flex flex-wrap items-center gap-1">
            <Link to={`/vendors/${row.id}`}>
              <TableIconButton title="View" aria-label="View vendor">
                <EyeIcon className="size-4" />
              </TableIconButton>
            </Link>
            <PermissionGate resource="vendors" action="update">
              {row.status === "pending" && (
                <>
                  <TableIconButton
                    onClick={() => handleApprove(row.id, row.fullName)}
                    title="Approve"
                    aria-label="Approve vendor"
                    disabled={approveVendor.isPending}
                    className="hover:bg-success-50 hover:text-success-600 dark:hover:bg-success-500/15 dark:hover:text-success-400"
                  >
                    <CheckLineIcon className="size-4" />
                  </TableIconButton>
                  <TableIconButton
                    onClick={() => handleReject(row.id, row.fullName)}
                    title="Reject"
                    aria-label="Reject vendor"
                    disabled={rejectVendor.isPending}
                    className="hover:bg-error-50 hover:text-error-600 dark:hover:bg-error-500/15 dark:hover:text-error-400"
                  >
                    <CloseLineIcon className="size-4" />
                  </TableIconButton>
                </>
              )}
            </PermissionGate>
            <PermissionGate resource="vendors" action="delete">
              <TableIconButton
                onClick={() => handleDelete(row.id, row.fullName)}
                title="Deactivate"
                aria-label="Deactivate vendor"
                className="hover:bg-error-50 hover:text-error-600 dark:hover:bg-error-500/15 dark:hover:text-error-400"
              >
                <TrashBinIcon className="size-4" />
              </TableIconButton>
            </PermissionGate>
          </div>
        ),
      },
    ],
    [approveVendor.isPending, rejectVendor.isPending]
  );

  return (
    <>
      <PageMeta title="Vendors | Admin" description="Manage vendors" />
      <PageBreadcrumb pageTitle="Vendors" />
      <div className="space-y-6">
        <ComponentCard title="All Vendors">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4 px-4">
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                placeholder="Search name, company, mobile..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-white/5 dark:text-white"
              />
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter((e.target.value as VendorStatus) || "")
                }
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-white/5 dark:text-white"
              >
                <option value="">All statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <PermissionGate resource="vendors" action="create">
              <Link to="/vendors/new">
                <Button size="sm">Add Vendor</Button>
              </Link>
            </PermissionGate>
          </div>
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <DataTable
              columns={columns}
              data={vendors}
              isLoading={isLoading}
              emptyMessage="No vendors found"
            />
          </div>
          {meta && meta.totalPages > 1 && (
            <div className="mt-4 flex justify-center gap-2">
              <Button
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <span className="flex items-center px-2 text-sm text-gray-600 dark:text-gray-400">
                Page {meta.page} of {meta.totalPages}
              </span>
              <Button
                size="sm"
                disabled={page >= meta.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </ComponentCard>
      </div>
    </>
  );
}
