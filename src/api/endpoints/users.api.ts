import { api } from "../axios";

export interface UserListItem {
  id: number;
  email: string;
  firstName: string;
  lastName?: string;
  isActive: boolean;
  roles: { id: number; name: string }[];
  createdAt?: string;
}

export interface UserDetail extends UserListItem {
  effectivePermissions?: { resource: string; action: string }[];
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export const usersApi = {
  list: (params?: { page?: number; limit?: number; search?: string; isActive?: boolean; roleId?: number }) =>
    api.get<PaginatedResponse<UserListItem>>("/users", { params }).then((r) => r.data),

  getById: (id: number) =>
    api.get<{ success: boolean; data: UserDetail }>(`/users/${id}`).then((r) => r.data.data),

  create: (body: { email: string; password: string; firstName: string; lastName?: string; roleIds?: number[] }) =>
    api.post<{ success: boolean; data: UserListItem }>("/users", body).then((r) => r.data.data),

  update: (id: number, body: { firstName?: string; lastName?: string; isActive?: boolean; roleIds?: number[] }) =>
    api.put<{ success: boolean; data: UserListItem }>(`/users/${id}`, body).then((r) => r.data.data),

  delete: (id: number) => api.delete(`/users/${id}`).then((r) => r.data),

  changePassword: (id: number, body: { currentPassword: string; newPassword: string }) =>
    api.put(`/users/${id}/password`, body).then((r) => r.data),
};
