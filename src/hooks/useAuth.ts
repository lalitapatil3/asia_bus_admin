import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { authApi } from "../api/endpoints/auth.api";
import { useAuthStore } from "../store/authStore";

export function useLogin() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (payload: { email: string; password: string }) => authApi.login(payload),
    onSuccess: (data, _variables, _context) => {
      setAuth(data.user, data.token);
      toast.success("Signed in successfully");
      navigate("/dashboard", { replace: true });
    },
    onError: (err: Error) => {
      toast.error(err.message || "Sign in failed");
    },
  });
}

export function useLogout() {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      clearAuth();
      toast.success("Signed out");
      navigate("/", { replace: true });
    },
  });
}

export function useMe() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const updateUser = useAuthStore((s) => s.updateUser);

  return useMutation({
    mutationFn: () => authApi.me(),
    onSuccess: (data) => {
      updateUser(data);
    },
  });
}
