import { useMemo } from "react";
import { Link } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import { DataTable, TableIconButton } from "../../components/ui/data-table";
import type { DataTableColumn } from "../../components/ui/data-table";
import Button from "../../components/ui/button/Button";
import PermissionGate from "../../components/common/PermissionGate";
import { useGetStates, useDeleteState } from "../../hooks/useStates";
import { PencilIcon, TrashBinIcon } from "../../icons";
import { StateData } from "../../api/endpoints/states.api";

export default function StatesListPage() {
  const { data: states = [], isLoading } = useGetStates();
  const deleteState = useDeleteState();

  const handleDelete = (id: number, name: string) => {
    if (window.confirm(`Delete state "${name}"? This will fail if cities are associated with it.`)) {
      deleteState.mutate(id);
    }
  };

  const columns: DataTableColumn<StateData>[] = useMemo(
    () => [
      {
        id: "id",
        header: "ID",
        accessorKey: "id",
      },
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
        id: "seatSellerStateId",
        header: "Seat Seller ID",
        accessorKey: "seatSellerStateId",
      },
      {
        id: "actions",
        header: "Actions",
        cell: (row) => (
          <div className="flex items-center gap-1">
            <PermissionGate resource="states" action="update">
              <Link to={`/states/${row.id}/edit`}>
                <TableIconButton title="Edit" aria-label="Edit state">
                  <PencilIcon className="size-4" />
                </TableIconButton>
              </Link>
            </PermissionGate>
            <PermissionGate resource="states" action="delete">
              <TableIconButton
                onClick={() => handleDelete(row.id, row.name)}
                title="Delete"
                aria-label="Delete state"
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
      <PageMeta title="States | Master Data" description="Manage states" />
      <PageBreadcrumb pageTitle="States" />
      <ComponentCard title="States">
        <div className="mb-4 flex justify-end px-4">
          <PermissionGate resource="states" action="create">
            <Link to="/states/new">
              <Button size="sm">Add State</Button>
            </Link>
          </PermissionGate>
        </div>
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.03]">
          <DataTable
            columns={columns}
            data={states}
            isLoading={isLoading}
            emptyMessage="No states found"
          />
        </div>
      </ComponentCard>
    </>
  );
}
