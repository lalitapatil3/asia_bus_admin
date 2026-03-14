import { api } from "../axios";

export interface RoleListItem {
  id: number;
  name: string;
  description?: string;
  parentRoleId?: number;
  level: number;
  isActive: boolean;
  permissions?: { id: number; name: string; resource: string; action: string }[];
  userCount?: number;
}

export interface RoleHierarchy {
  ancestors: { id: number; name: string; level: number }[];
  descendants: { id: number; name: string; level: number }[];
}

export const rolesApi = {
  list: (params?: { page?: number; limit?: number }) =>
    api.get<{ success: boolean; data: RoleListItem[]; meta: { total: number; page: number; limit: number; totalPages: number } }>("/roles", { params }).then((r) => r.data),

  getById: (id: number) =>
    api.get<{ success: boolean; data: RoleListItem }>(`/roles/${id}`).then((r) => r.data.data),

  getHierarchy: (id: number) =>
    api.get<{ success: boolean; data: RoleHierarchy }>(`/roles/${id}/hierarchy`).then((r) => r.data.data),

  create: (body: { name: string; description?: string; parentRoleId?: number; level?: number; permissionIds?: number[] }) =>
    api.post<{ success: boolean; data: RoleListItem }>("/roles", body).then((r) => r.data.data),

  update: (id: number, body: { name?: string; description?: string; isActive?: boolean; permissionIds?: number[] }) =>
    api.put<{ success: boolean; data: RoleListItem }>(`/roles/${id}`, body).then((r) => r.data.data),

  delete: (id: number) => api.delete(`/roles/${id}`).then((r) => r.data),
};
