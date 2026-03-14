import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { rolesApi } from "../api/endpoints/roles.api";

export const rolesKey = ["roles"] as const;

export function useGetRoles(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: [...rolesKey, params],
    queryFn: () => rolesApi.list(params),
  });
}

export function useGetRole(id: number | null) {
  return useQuery({
    queryKey: [...rolesKey, id],
    queryFn: () => rolesApi.getById(id!),
    enabled: id != null,
  });
}

export function useGetRoleHierarchy(id: number | null) {
  return useQuery({
    queryKey: [...rolesKey, "hierarchy", id],
    queryFn: () => rolesApi.getHierarchy(id!),
    enabled: id != null,
  });
}

export function useCreateRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: rolesApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: rolesKey });
      toast.success("Role created");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: Parameters<typeof rolesApi.update>[1] }) => rolesApi.update(id, body),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: rolesKey });
      qc.invalidateQueries({ queryKey: [...rolesKey, id] });
      toast.success("Role updated");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: rolesApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: rolesKey });
      toast.success("Role deleted");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
