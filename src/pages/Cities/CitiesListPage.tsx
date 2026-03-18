import { useMemo } from "react";
import { Link } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import { DataTable, TableIconButton } from "../../components/ui/data-table";
import type { DataTableColumn } from "../../components/ui/data-table";
import Button from "../../components/ui/button/Button";
import PermissionGate from "../../components/common/PermissionGate";
import { useGetCities, useDeleteCity } from "../../hooks/useCities";
import { PencilIcon, TrashBinIcon } from "../../icons";
import { CityData } from "../../api/endpoints/cities.api";

export default function CitiesListPage() {
  const { data: cities = [], isLoading } = useGetCities();
  const deleteCity = useDeleteCity();

  const handleDelete = (id: number, name: string) => {
    if (window.confirm(`Delete city "${name}"?`)) {
      deleteCity.mutate(id);
    }
  };

  const columns: DataTableColumn<CityData>[] = useMemo(
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
        id: "state",
        header: "State",
        cell: (row) => (
          <span className="text-gray-500 dark:text-gray-400">
            {row.State?.name ?? "Unknown"}
          </span>
        ),
      },
      {
        id: "seatSellerCityId",
        header: "Seat Seller ID",
        accessorKey: "seatSellerCityId",
      },
      {
        id: "actions",
        header: "Actions",
        cell: (row) => (
          <div className="flex items-center gap-1">
            <PermissionGate resource="cities" action="update">
              <Link to={`/cities/${row.id}/edit`}>
                <TableIconButton title="Edit" aria-label="Edit city">
                  <PencilIcon className="size-4" />
                </TableIconButton>
              </Link>
            </PermissionGate>
            <PermissionGate resource="cities" action="delete">
              <TableIconButton
                onClick={() => handleDelete(row.id, row.name)}
                title="Delete"
                aria-label="Delete city"
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
      <PageMeta title="Cities | Master Data" description="Manage cities" />
      <PageBreadcrumb pageTitle="Cities" />
      <ComponentCard title="Cities">
        <div className="mb-4 flex justify-end px-4">
          <PermissionGate resource="cities" action="create">
            <Link to="/cities/new">
              <Button size="sm">Add City</Button>
            </Link>
          </PermissionGate>
        </div>
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.03]">
          <DataTable
            columns={columns}
            data={cities}
            isLoading={isLoading}
            emptyMessage="No cities found"
          />
        </div>
      </ComponentCard>
    </>
  );
}
