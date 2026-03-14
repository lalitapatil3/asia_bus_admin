import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import Badge from "../../components/ui/badge/Badge";
import Button from "../../components/ui/button/Button";
import PermissionGate from "../../components/common/PermissionGate";
import { useGetPermissions, useDeletePermission } from "../../hooks/usePermissions";

export default function PermissionsPage() {
  const [view, setView] = useState<"grouped" | "flat">("grouped");
  const { data, isLoading } = useGetPermissions({ limit: 200 });
  const deletePermission = useDeletePermission();
  const payload = data?.data;
  const flat = payload?.flat ?? [];
  const grouped = payload?.grouped ?? {};

  return (
    <>
      <PageMeta title="Permissions | RBAC Admin" />
      <PageBreadcrumb pageTitle="Permissions" />
      <div className="mb-4 flex items-center justify-between">
        <div className="flex gap-2">
          <Button size="sm" color={view === "grouped" ? "primary" : "default"} onClick={() => setView("grouped")}>Grouped</Button>
          <Button size="sm" color={view === "flat" ? "primary" : "default"} onClick={() => setView("flat")}>Flat</Button>
        </div>
      </div>
      <ComponentCard title="Permissions">
        {isLoading ? (
          <p className="text-gray-500">Loading...</p>
        ) : view === "grouped" ? (
          <div className="space-y-4">
            {Object.entries(grouped).map(([resource, perms]) => (
              <div key={resource}>
                <h3 className="mb-2 font-medium text-gray-800 dark:text-white">{resource}</h3>
                <div className="flex flex-wrap gap-2">
                  {(perms as { id: number; name: string; action: string }[]).map((p) => (
                    <Badge key={p.id} size="sm">{p.action}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <ul className="space-y-1">
            {flat.map((p: { id: number; name: string; resource: string; action: string }) => (
              <li key={p.id} className="flex items-center justify-between rounded border border-gray-100 px-3 py-2 dark:border-white/5">
                <span>{p.name}</span>
                <PermissionGate resource="permissions" action="delete">
                  <Button size="sm" color="error" onClick={() => window.confirm("Delete?") && deletePermission.mutate(p.id)}>Delete</Button>
                </PermissionGate>
              </li>
            ))}
          </ul>
        )}
      </ComponentCard>
    </>
  );
}
