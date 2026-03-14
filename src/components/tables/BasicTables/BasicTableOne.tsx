import { useMemo } from "react";
import { DataTable } from "../../ui/data-table";
import type { DataTableColumn } from "../../ui/data-table";
import Badge from "../../ui/badge/Badge";

interface Order {
  id: number;
  user: {
    image: string;
    name: string;
    role: string;
  };
  projectName: string;
  team: {
    images: string[];
  };
  status: string;
  budget: string;
}

const tableData: Order[] = [
  {
    id: 1,
    user: {
      image: "/images/user/user-17.jpg",
      name: "Lindsey Curtis",
      role: "Web Designer",
    },
    projectName: "Agency Website",
    team: {
      images: [
        "/images/user/user-22.jpg",
        "/images/user/user-23.jpg",
        "/images/user/user-24.jpg",
      ],
    },
    budget: "3.9K",
    status: "Active",
  },
  {
    id: 2,
    user: {
      image: "/images/user/user-18.jpg",
      name: "Kaiya George",
      role: "Project Manager",
    },
    projectName: "Technology",
    team: { images: ["/images/user/user-25.jpg", "/images/user/user-26.jpg"] },
    budget: "24.9K",
    status: "Pending",
  },
  {
    id: 3,
    user: {
      image: "/images/user/user-17.jpg",
      name: "Zain Geidt",
      role: "Content Writing",
    },
    projectName: "Blog Writing",
    team: { images: ["/images/user/user-27.jpg"] },
    budget: "12.7K",
    status: "Active",
  },
  {
    id: 4,
    user: {
      image: "/images/user/user-20.jpg",
      name: "Abram Schleifer",
      role: "Digital Marketer",
    },
    projectName: "Social Media",
    team: {
      images: [
        "/images/user/user-28.jpg",
        "/images/user/user-29.jpg",
        "/images/user/user-30.jpg",
      ],
    },
    budget: "2.8K",
    status: "Cancel",
  },
  {
    id: 5,
    user: {
      image: "/images/user/user-21.jpg",
      name: "Carla George",
      role: "Front-end Developer",
    },
    projectName: "Website",
    team: {
      images: [
        "/images/user/user-31.jpg",
        "/images/user/user-32.jpg",
        "/images/user/user-33.jpg",
      ],
    },
    budget: "4.5K",
    status: "Active",
  },
];

export default function BasicTableOne() {
  const columns: DataTableColumn<Order>[] = useMemo(
    () => [
      {
        id: "user",
        header: "User",
        cell: (row) => (
          <div className="flex items-center gap-3">
            <div className="size-10 overflow-hidden rounded-full">
              <img
                width={40}
                height={40}
                src={row.user.image}
                alt={row.user.name}
              />
            </div>
            <div>
              <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                {row.user.name}
              </span>
              <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                {row.user.role}
              </span>
            </div>
          </div>
        ),
      },
      {
        id: "projectName",
        header: "Project Name",
        accessorKey: "projectName",
        enableSorting: true,
        cell: (row) => (
          <span className="text-gray-500 text-theme-sm dark:text-gray-400">
            {row.projectName}
          </span>
        ),
      },
      {
        id: "team",
        header: "Team",
        cell: (row) => (
          <div className="flex -space-x-2">
            {row.team.images.map((teamImage, index) => (
              <div
                key={index}
                className="size-6 overflow-hidden rounded-full border-2 border-white dark:border-gray-900"
              >
                <img
                  width={24}
                  height={24}
                  src={teamImage}
                  alt={`Team member ${index + 1}`}
                  className="size-full"
                />
              </div>
            ))}
          </div>
        ),
      },
      {
        id: "status",
        header: "Status",
        accessorKey: "status",
        enableSorting: true,
        cell: (row) => (
          <Badge
            size="sm"
            color={
              row.status === "Active"
                ? "success"
                : row.status === "Pending"
                  ? "warning"
                  : "error"
            }
          >
            {row.status}
          </Badge>
        ),
      },
      {
        id: "budget",
        header: "Budget",
        accessorKey: "budget",
        enableSorting: true,
        cell: (row) => (
          <span className="text-gray-500 text-theme-sm dark:text-gray-400">
            {row.budget}
          </span>
        ),
      },
    ],
    []
  );

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <DataTable
        columns={columns}
        data={tableData}
        emptyMessage="No orders"
      />
    </div>
  );
}
