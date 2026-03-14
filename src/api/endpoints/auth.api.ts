import { api } from "../axios";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthUser {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  roles: { id: number; name: string }[];
  permissions: { resource: string; action: string; permissionName: string; source: string; conditions?: unknown }[];
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export const authApi = {
  login: (payload: LoginPayload) =>
    api.post<{ success: boolean; message: string; data: LoginResponse }>("/auth/login", payload).then((r) => r.data.data),

  logout: () => api.post("/auth/logout").then((r) => r.data),

  me: () =>
    api
      .get<{ success: boolean; data: AuthUser }>("/auth/me")
      .then((r) => r.data.data),
};
