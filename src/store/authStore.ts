import { create } from "zustand";
import type { AuthUser } from "../api/endpoints/auth.api";

const AUTH_KEY = "auth";

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: AuthUser, token: string) => void;
  clearAuth: () => void;
  initAuth: () => void;
  updateUser: (user: AuthUser) => void;
}

const loadStored = (): { user: AuthUser | null; token: string | null } => {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return { user: null, token: null };
    const parsed = JSON.parse(raw) as { user: AuthUser; token: string };
    return { user: parsed.user ?? null, token: parsed.token ?? null };
  } catch {
    return { user: null, token: null };
  }
};

const stored = loadStored();

export const useAuthStore = create<AuthState>((set) => ({
  user: stored.user,
  token: stored.token,
  isAuthenticated: !!stored.token,
  isLoading: false,

  setAuth: (user, token) => {
    localStorage.setItem(AUTH_KEY, JSON.stringify({ user, token }));
    set({ user, token, isAuthenticated: true });
  },

  clearAuth: () => {
    localStorage.removeItem(AUTH_KEY);
    set({ user: null, token: null, isAuthenticated: false });
  },

  initAuth: () => {
    const { user, token } = loadStored();
    set({ user, token, isAuthenticated: !!token, isLoading: false });
  },

  updateUser: (user) => {
    set((state) => {
      const next = { ...state, user };
      const raw = localStorage.getItem(AUTH_KEY);
      if (raw) {
        try {
          const parsed = JSON.parse(raw) as { token: string };
          localStorage.setItem(AUTH_KEY, JSON.stringify({ user, token: parsed.token }));
        } catch {
          // ignore
        }
      }
      return next;
    });
  },
}));
