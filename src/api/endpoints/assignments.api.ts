import { api } from "../axios";

export interface UserRoleAssignment {
  roleId: number;
  role: { id: number; name: string; level?: number };
  assignedAt: string;
  expiresAt?: string | null;
}

export interface UserPermissionsResponse {
  rolePermissions: { resource: string; action: string; permissionName: string; source: string }[];
  directPermissions: { resource: string; action: string; permissionName: string; source: string; conditions?: unknown }[];
  effectivePermissions: { resource: string; action: string; permissionName: string; source: string }[];
}

export const assignmentsApi = {
  getUserRoles: (userId: number) =>
    api.get<{ success: boolean; data: UserRoleAssignment[] }>(`/assignments/users/${userId}/roles`).then((r) => r.data.data),

  getRoleUsers: (roleId: number, params?: { page?: number; limit?: number }) =>
    api.get<{ success: boolean; data: { userId: number; user: unknown; assignedAt: string; expiresAt?: string }[]; meta: unknown }>(`/assignments/roles/${roleId}/users`, { params }).then((r) => r.data),

  assignRole: (body: { userId: number; roleId: number; expiresAt?: string }) =>
    api.post("/assignments/roles/assign", body).then((r) => r.data),

  revokeRole: (body: { userId: number; roleId: number }) =>
    api.post("/assignments/roles/revoke", body).then((r) => r.data),

  grantOrRevokePermission: (body: {
    userId: number;
    permissionId: number;
    type: "grant" | "revoke";
    conditions?: object;
    expiresAt?: string;
  }) => api.post("/assignments/permissions/grant", body).then((r) => r.data),

  getUserPermissions: (userId: number) =>
    api.get<{ success: boolean; data: UserPermissionsResponse }>(`/assignments/users/${userId}/permissions`).then((r) => r.data.data),
};
