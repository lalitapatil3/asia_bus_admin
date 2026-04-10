import { useMemo, useState } from "react";
import { Link } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import { DataTable } from "../../components/ui/data-table";
import type { DataTableColumn } from "../../components/ui/data-table";
import Button from "../../components/ui/button/Button";
import PermissionGate from "../../components/common/PermissionGate";
import { useGetCities } from "../../hooks/useCities";
import { CityData } from "../../api/endpoints/cities.api";

export default function CitiesListPage() {
  const [page, setPage] = useState(1);
  const limit = 100;

  const { data, isLoading } = useGetCities({ page, limit });
  const cities = data?.cities ?? [];
  const totalPages = data?.totalPages ?? 1;

  const citiesWithSlNo = useMemo(() => {
    return cities.map((city, idx) => ({
      ...city,
      slNo: (page - 1) * limit + idx + 1,
    }));
  }, [cities, page, limit]);

  const columns: DataTableColumn<CityData & { slNo?: number }>[] = useMemo(
    () => [
      {
        id: "slNo",
        header: "Sl. No.",
        accessorKey: "slNo",
      },
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
        id: "latitude",
        header: "Latitude",
        accessorKey: "latitude",
        cell: (row) => (
          <span className="text-gray-500 dark:text-gray-400">
            {row.latitude || "N/A"}
          </span>
        ),
      },
      {
        id: "longitude",
        header: "Longitude",
        accessorKey: "longitude",
        cell: (row) => (
          <span className="text-gray-500 dark:text-gray-400">
            {row.longitude || "N/A"}
          </span>
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
        <DataTable
          columns={columns}
          data={citiesWithSlNo}
          isLoading={isLoading}
          emptyMessage="No cities found"
        />

        {/* Pagination Controls */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 sm:px-6 dark:border-gray-800 mt-4">
          <div className="flex justify-between flex-1 sm:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
            >
              Next
            </Button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-400">
                Showing page <span className="font-medium">{page}</span> of{" "}
                <span className="font-medium">{totalPages}</span>
              </p>
            </div>
            <div>
              <nav className="inline-flex -space-x-px rounded-[8px] shadow-sm ml-4" aria-label="Pagination">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-l-[8px] rounded-r-none border-r-0"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="rounded-r-[8px] rounded-l-none"
                >
                  Next
                </Button>
              </nav>
            </div>
          </div>
        </div>
      </ComponentCard>
    </>
  );
}
