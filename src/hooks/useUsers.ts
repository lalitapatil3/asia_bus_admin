import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { usersApi } from "../api/endpoints/users.api";

export const usersKey = ["users"] as const;

export function useGetUsers(params?: { page?: number; limit?: number; search?: string; isActive?: boolean; roleId?: number }) {
  return useQuery({
    queryKey: [...usersKey, params],
    queryFn: () => usersApi.list(params),
  });
}

export function useGetUser(id: number | null) {
  return useQuery({
    queryKey: [...usersKey, id],
    queryFn: () => usersApi.getById(id!),
    enabled: id != null,
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: usersApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: usersKey });
      toast.success("User created");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: Parameters<typeof usersApi.update>[1] }) => usersApi.update(id, body),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: usersKey });
      qc.invalidateQueries({ queryKey: [...usersKey, id] });
      toast.success("User updated");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: usersApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: usersKey });
      toast.success("User deactivated");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useChangePassword() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: { currentPassword: string; newPassword: string } }) =>
      usersApi.changePassword(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: usersKey });
      toast.success("Password updated");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
