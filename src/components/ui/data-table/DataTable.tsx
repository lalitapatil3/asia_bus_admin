import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type RowData,
} from "@tanstack/react-table";
import { useState, type ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../table";
import { AngleDownIcon, AngleUpIcon } from "../../../icons";

const headerClass =
  "px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400";

export interface DataTableColumn<T extends RowData> {
  id: string;
  header: string;
  accessorKey?: keyof T | string;
  cell?: (row: T) => ReactNode;
  enableSorting?: boolean;
}

interface DataTableProps<T extends RowData> {
  columns: DataTableColumn<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export function DataTable<T extends RowData>({
  columns,
  data,
  isLoading = false,
  emptyMessage = "No data",
}: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const tableColumns: ColumnDef<T>[] = columns.map((col) => ({
    id: col.id,
    accessorKey: col.accessorKey as string,
    header: col.header,
    enableSorting: col.enableSorting ?? false,
    cell: col.cell
      ? ({ row }) => col.cell!(row.original)
      : ({ getValue }) => String(getValue() ?? ""),
  }));

  const table = useReactTable({
    data,
    columns: tableColumns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const headerRows = table.getHeaderGroups();
  const bodyRows = table.getRowModel().rows;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.03] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
        <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
          {headerRows.map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const canSort = header.column.getCanSort();
                const isSorted = header.column.getIsSorted();
                return (
                  <TableCell
                    key={header.id}
                    isHeader
                    className={headerClass}
                  >
                    <div
                      className={
                        canSort
                          ? "flex cursor-pointer select-none items-center gap-1"
                          : ""
                      }
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {canSort && (
                        <span className="inline-flex text-gray-400">
                          {isSorted === "asc" ? (
                            <AngleUpIcon className="size-4" />
                          ) : isSorted === "desc" ? (
                            <AngleDownIcon className="size-4" />
                          ) : (
                            <AngleDownIcon className="size-4 opacity-40" />
                          )}
                        </span>
                      )}
                    </div>
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
          {isLoading ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="py-8 text-center text-gray-500"
              >
                Loading...
              </TableCell>
            </TableRow>
          ) : bodyRows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="py-8 text-center text-gray-500"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            bodyRows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="text-start">
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
        </Table>
      </div>
    </div>
  );
}

const iconButtonClass =
  "inline-flex size-8 items-center justify-center rounded border border-transparent text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 focus:outline-hidden focus:ring-2 focus:ring-brand-500 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white";

/** Icon button for table actions (view, edit, delete, approve, reject). Omit onClick when used inside a Link. */
export function TableIconButton({
  onClick,
  title,
  "aria-label": ariaLabel,
  className = "",
  children,
  disabled,
}: {
  onClick?: () => void;
  title: string;
  "aria-label": string;
  className?: string;
  children: ReactNode;
  disabled?: boolean;
}) {
  const combinedClass = `${iconButtonClass} ${className}`.trim();
  if (onClick == null) {
    return (
      <span
        role="img"
        title={title}
        aria-label={ariaLabel}
        className={combinedClass}
      >
        {children}
      </span>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={ariaLabel}
      disabled={disabled}
      className={combinedClass}
    >
      {children}
    </button>
  );
}
