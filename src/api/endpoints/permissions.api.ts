import { api } from "../axios";

export interface PermissionItem {
  id: number;
  name: string;
  resource: string;
  action: string;
  description?: string;
}

export interface PermissionsListResponse {
  success: boolean;
  data: {
    flat: PermissionItem[];
    grouped: Record<string, PermissionItem[]>;
    meta: { total: number; page: number; limit: number; totalPages: number };
  };
}

export const permissionsApi = {
  list: (params?: { page?: number; limit?: number }) =>
    api.get<PermissionsListResponse>("/permissions", { params }).then((r) => r.data),

  getById: (id: number) =>
    api.get<{ success: boolean; data: PermissionItem & { roles?: unknown[]; userOverrides?: unknown[] } }>(`/permissions/${id}`).then((r) => r.data.data),

  create: (body: { resource: string; action: string; description?: string }) =>
    api.post<{ success: boolean; data: PermissionItem }>("/permissions", body).then((r) => r.data.data),

  update: (id: number, body: { description?: string }) =>
    api.put<{ success: boolean; data: PermissionItem }>(`/permissions/${id}`, body).then((r) => r.data.data),

  delete: (id: number) => api.delete(`/permissions/${id}`).then((r) => r.data),
};
