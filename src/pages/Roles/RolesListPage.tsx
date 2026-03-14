import { useState, useMemo } from "react";
import { Link } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import { DataTable, TableIconButton } from "../../components/ui/data-table";
import type { DataTableColumn } from "../../components/ui/data-table";
import Button from "../../components/ui/button/Button";
import PermissionGate from "../../components/common/PermissionGate";
import { useGetRoles, useDeleteRole } from "../../hooks/useRoles";
import { PencilIcon, TrashBinIcon } from "../../icons";

interface RoleRow {
  id: number;
  name: string;
  level: number;
  permissions?: unknown[];
  userCount?: number;
}

export default function RolesListPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetRoles({ page, limit: 10 });
  const deleteRole = useDeleteRole();
  const roles = (data?.data ?? []) as RoleRow[];
  const meta = data?.meta;

  const handleDelete = (id: number, name: string) => {
    if (
      window.confirm(
        `Delete role "${name}"? This will fail if users are assigned or child roles exist.`
      )
    ) {
      deleteRole.mutate(id);
    }
  };

  const columns: DataTableColumn<RoleRow>[] = useMemo(
    () => [
      {
        id: "name",
        header: "Name",
        accessorKey: "name",
        enableSorting: true,
        cell: (row) => (
          <span className="font-medium text-gray-800 dark:text-white/90">
            {row.name}
          </span>
        ),
      },
      {
        id: "level",
        header: "Level",
        accessorKey: "level",
        enableSorting: true,
        cell: (row) => (
          <span className="text-gray-500 dark:text-gray-400">{row.level}</span>
        ),
      },
      {
        id: "permissions",
        header: "Permissions",
        cell: (row) => (
          <span className="text-gray-500 dark:text-gray-400">
            {(row.permissions ?? []).length}
          </span>
        ),
      },
      {
        id: "users",
        header: "Users",
        cell: (row) => (
          <span className="text-gray-500 dark:text-gray-400">
            {row.userCount ?? 0}
          </span>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: (row) => (
          <div className="flex items-center gap-1">
            <Link to={`/roles/${row.id}/edit`}>
              <TableIconButton title="Edit" aria-label="Edit role">
                <PencilIcon className="size-4" />
              </TableIconButton>
            </Link>
            <PermissionGate resource="roles" action="delete">
              <TableIconButton
                onClick={() => handleDelete(row.id, row.name)}
                title="Delete"
                aria-label="Delete role"
                className="hover:bg-error-50 hover:text-error-600 dark:hover:bg-error-500/15 dark:hover:text-error-400"
              >
                <TrashBinIcon className="size-4" />
              </TableIconButton>
            </PermissionGate>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <>
      <PageMeta title="Roles | RBAC Admin" description="Manage roles" />
      <PageBreadcrumb pageTitle="Roles" />
      <ComponentCard title="Roles">
        <div className="mb-4 flex justify-end px-4">
          <PermissionGate resource="roles" action="create">
            <Link to="/roles/new">
              <Button size="sm">Add role</Button>
            </Link>
          </PermissionGate>
        </div>
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.03]">
          <DataTable
            columns={columns}
            data={roles}
            isLoading={isLoading}
            emptyMessage="No roles found"
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
    </>
  );
}
