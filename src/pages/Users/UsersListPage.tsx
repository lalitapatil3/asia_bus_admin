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
import { useGetUsers, useDeleteUser } from "../../hooks/useUsers";
import { useGetRoles } from "../../hooks/useRoles";
import { EyeIcon, PencilIcon, TrashBinIcon } from "../../icons";

interface UserRow {
  id: number;
  firstName: string;
  lastName?: string;
  email: string;
  isActive: boolean;
  roles: { id: number; name: string }[];
}

export default function UsersListPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchDebounced, setSearchDebounced] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<number | "">("");
  const deleteUser = useDeleteUser();

  useEffect(() => {
    const t = setTimeout(() => setSearchDebounced(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const params = useMemo(
    () => ({
      page,
      limit: 10,
      search: searchDebounced || undefined,
      isActive: statusFilter === "" ? undefined : statusFilter === "active",
      roleId: roleFilter === "" ? undefined : roleFilter,
    }),
    [page, searchDebounced, statusFilter, roleFilter]
  );

  const { data, isLoading } = useGetUsers(params);
  const { data: rolesData } = useGetRoles({ limit: 100 });
  const roles = rolesData?.data ?? [];
  const users = (data?.data ?? []) as UserRow[];
  const meta = data?.meta;

  const handleDelete = (id: number, email: string) => {
    if (window.confirm(`Deactivate user ${email}?`)) {
      deleteUser.mutate(id);
    }
  };

  const columns: DataTableColumn<UserRow>[] = useMemo(
    () => [
      {
        id: "name",
        header: "Name",
        accessorKey: "firstName",
        enableSorting: true,
        cell: (row) => (
          <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
            {row.firstName} {row.lastName}
          </span>
        ),
      },
      {
        id: "email",
        header: "Email",
        accessorKey: "email",
        enableSorting: true,
        cell: (row) => (
          <span className="text-gray-500 text-theme-sm dark:text-gray-400">
            {row.email}
          </span>
        ),
      },
      {
        id: "roles",
        header: "Roles",
        cell: (row) => (
          <div className="flex max-w-[200px] flex-wrap gap-2">
            {(row.roles ?? []).map((r) => (
              <Badge key={r.id} size="sm" color="info">
                {r.name}
              </Badge>
            ))}
          </div>
        ),
      },
      {
        id: "status",
        header: "Status",
        cell: (row) => (
          <Badge size="sm" color={row.isActive ? "success" : "error"}>
            {row.isActive ? "Active" : "Inactive"}
          </Badge>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: (row) => (
          <div className="flex items-center gap-1">
            <Link to={`/users/${row.id}`}>
              <TableIconButton title="View" aria-label="View user">
                <EyeIcon className="size-4" />
              </TableIconButton>
            </Link>
            <PermissionGate resource="users" action="update">
              <Link to={`/users/${row.id}/edit`}>
                <TableIconButton title="Edit" aria-label="Edit user">
                  <PencilIcon className="size-4" />
                </TableIconButton>
              </Link>
            </PermissionGate>
            <PermissionGate resource="users" action="delete">
              <TableIconButton
                onClick={() => handleDelete(row.id, row.email)}
                title="Deactivate"
                aria-label="Deactivate user"
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
      <PageMeta title="Users | RBAC Admin" description="Manage users" />
      <PageBreadcrumb pageTitle="Users" />
      <div className="space-y-6">
        <ComponentCard title="All Users">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4 px-4">
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-white/5 dark:text-white"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-white/5 dark:text-white"
              >
                <option value="">All statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <select
                value={roleFilter}
                onChange={(e) =>
                  setRoleFilter(e.target.value ? Number(e.target.value) : "")
                }
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-white/5 dark:text-white"
              >
                <option value="">All roles</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
            <PermissionGate resource="users" action="create">
              <Link to="/users/new">
                <Button size="sm">Add User</Button>
              </Link>
            </PermissionGate>
          </div>
          <DataTable
            columns={columns}
            data={users}
            isLoading={isLoading}
            emptyMessage="No users found"
          />
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
