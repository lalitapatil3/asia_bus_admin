import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import Badge from "../../components/ui/badge/Badge";
import Button from "../../components/ui/button/Button";
import { useGetUsers } from "../../hooks/useUsers";
import { useGetUserRoles, useGetUserPermissions } from "../../hooks/useAssignments";
import RoleAssignModal from "../../components/assignments/RoleAssignModal";
import PermissionAssignModal from "../../components/assignments/PermissionAssignModal";

export default function AssignmentsPage() {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"roles" | "direct" | "effective">("roles");
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [permModalOpen, setPermModalOpen] = useState(false);

  const { data: usersData } = useGetUsers({ limit: 50 });
  const users = usersData?.data ?? [];
  const { data: rolesData } = useGetUserRoles(selectedUserId);
  const { data: permsData } = useGetUserPermissions(selectedUserId);
  const assignments = rolesData ?? [];
  const permissions = permsData ?? { rolePermissions: [], directPermissions: [], effectivePermissions: [] };

  return (
    <>
      <PageMeta title="Assignments | RBAC Admin" />
      <PageBreadcrumb pageTitle="Assignments" />
      <ComponentCard title="User assignments">
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Select user</label>
          <select
            value={selectedUserId ?? ""}
            onChange={(e) => setSelectedUserId(e.target.value ? Number(e.target.value) : null)}
            className="w-full max-w-xs rounded-lg border border-gray-200 bg-white px-4 py-2 dark:border-white/10 dark:bg-white/5 dark:text-white"
          >
            <option value="">— Select user —</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>{u.firstName} {u.lastName} ({u.email})</option>
            ))}
          </select>
        </div>
        {selectedUserId && (
          <>
            <div className="mb-2 flex gap-2">
              <Button size="sm" onClick={() => setRoleModalOpen(true)}>Assign role</Button>
              <Button size="sm" onClick={() => setPermModalOpen(true)}>Grant/revoke permission</Button>
            </div>
            <div className="mb-2 flex gap-2">
              {(["roles", "direct", "effective"] as const).map((tab) => (
                <Button key={tab} size="sm" variant={activeTab === tab ? "primary" : "outline"} onClick={() => setActiveTab(tab)}>
                  {tab === "roles" ? "Assigned roles" : tab === "direct" ? "Direct overrides" : "Effective permissions"}
                </Button>
              ))}
            </div>
            {activeTab === "roles" && (
              <ul className="space-y-2">
                {assignments.map((a: { roleId: number; role: { name: string }; expiresAt?: string | null }) => (
                  <li key={a.roleId}><Badge>{a.role.name}</Badge> {a.expiresAt ? `(expires ${new Date(a.expiresAt).toLocaleDateString()})` : ""}</li>
                ))}
              </ul>
            )}
            {activeTab === "direct" && (
              <div className="flex flex-wrap gap-2">
                {[...(permissions.directPermissions ?? [])].map((p: { resource: string; action: string }, i: number) => (
                  <Badge key={i}>{p.resource}:{p.action}</Badge>
                ))}
              </div>
            )}
            {activeTab === "effective" && (
              <div className="flex flex-wrap gap-2">
                {(permissions.effectivePermissions ?? []).map((p: { resource: string; action: string }, i: number) => (
                  <Badge key={i}>{p.resource}:{p.action}</Badge>
                ))}
              </div>
            )}
          </>
        )}
      </ComponentCard>
      {selectedUserId && (
        <>
          <RoleAssignModal isOpen={roleModalOpen} onClose={() => setRoleModalOpen(false)} userId={selectedUserId} />
          <PermissionAssignModal isOpen={permModalOpen} onClose={() => setPermModalOpen(false)} userId={selectedUserId} />
        </>
      )}
    </>
  );
}
