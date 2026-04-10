import { useState } from "react";
import { useParams, Link } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import Badge from "../../components/ui/badge/Badge";
import Button from "../../components/ui/button/Button";
import PermissionGate from "../../components/common/PermissionGate";
import { useGetUser } from "../../hooks/useUsers";
import { useGetUserRoles, useRevokeRole } from "../../hooks/useAssignments";
import RoleAssignModal from "../../components/assignments/RoleAssignModal";
import PermissionAssignModal from "../../components/assignments/PermissionAssignModal";

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const userId = id ? parseInt(id, 10) : null;
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [permModalOpen, setPermModalOpen] = useState(false);

  const { data: user, isLoading } = useGetUser(userId);
  const { data: rolesData } = useGetUserRoles(userId);
  const revokeRole = useRevokeRole();
  const assignments = rolesData ?? [];

  if (!userId || (user === undefined && !isLoading)) {
    return <div className="p-4">User not found</div>;
  }

  return (
    <>
      <PageMeta title={user ? `${user.firstName} ${user.lastName} | Users` : "User | RBAC Admin"} description="User detail" />
      <PageBreadcrumb pageTitle={user ? `${user.firstName} ${user.lastName}` : "User"} />
      <div className="space-y-6">
        <ComponentCard title="User info">
          {isLoading ? (
            <p className="text-gray-500">Loading...</p>
          ) : user ? (
            <div className="space-y-2">
              <p><span className="font-medium">Email:</span> {user.email}</p>
              <p><span className="font-medium">Name:</span> {user.firstName} {user.lastName}</p>
              <p>
                <span className="font-medium">Status:</span>{" "}
                <Badge size="sm" color={user.isActive ? "success" : "error"}>{user.isActive ? "Active" : "Inactive"}</Badge>
              </p>
              <div className="pt-2">
                <PermissionGate resource="users" action="update">
                  <Link to={`/users/${user.id}/edit`}>
                    <Button size="sm">Edit user</Button>
                  </Link>
                </PermissionGate>
              </div>
            </div>
          ) : null}
        </ComponentCard>

        <ComponentCard title="Roles">
          <div className="mb-2 flex justify-end">
            <PermissionGate resource="users" action="manage">
              <Button size="sm" onClick={() => setRoleModalOpen(true)}>Assign role</Button>
            </PermissionGate>
          </div>
          <ul className="space-y-2">
            {assignments.map((a: { roleId: number; role: { id: number; name: string }; expiresAt?: string | null }) => (
              <li key={a.roleId} className="flex items-center justify-between rounded border border-gray-200 px-3 py-2 dark:border-white/10">
                <span><Badge color="info">{a.role.name}</Badge> {a.expiresAt ? `(expires ${new Date(a.expiresAt).toLocaleDateString()})` : ""}</span>
                <PermissionGate resource="users" action="manage">
                  <Button size="sm" variant="error" onClick={() => revokeRole.mutate({ userId, roleId: a.roleId })}>Revoke</Button>
                </PermissionGate>
              </li>
            ))}
          </ul>
        </ComponentCard>

        <ComponentCard title="Effective permissions">
          <div className="mb-2 flex justify-end">
            <PermissionGate resource="users" action="manage">
              <Button size="sm" onClick={() => setPermModalOpen(true)}>Grant / revoke permission</Button>
            </PermissionGate>
          </div>
          <div className="flex flex-wrap gap-2">
            {(user?.effectivePermissions ?? []).map((p: { resource: string; action: string }, i: number) => (
              <Badge key={`${p.resource}-${p.action}-${i}`} size="sm">{p.resource}:{p.action}</Badge>
            ))}
          </div>
        </ComponentCard>
      </div>

      <RoleAssignModal isOpen={roleModalOpen} onClose={() => setRoleModalOpen(false)} userId={userId} onSuccess={() => {}} />
      <PermissionAssignModal isOpen={permModalOpen} onClose={() => setPermModalOpen(false)} userId={userId} onSuccess={() => {}} />
    </>
  );
}
