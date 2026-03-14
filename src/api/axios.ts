import axios, { AxiosError } from "axios";
import { useAuthStore } from "../store/authStore";

const baseURL = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api/v1";

export const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; errors?: unknown }>) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearAuth();
      window.location.href = "/";
      return Promise.reject(error);
    }
    const message =
      error.response?.data?.message ??
      (Array.isArray(error.response?.data?.errors)
        ? (error.response.data.errors as { message?: string }[])[0]?.message
        : null) ??
      error.message ??
      "Request failed";
    return Promise.reject(new Error(message));
  }
);
