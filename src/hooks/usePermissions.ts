import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { permissionsApi } from "../api/endpoints/permissions.api";

const permissionsKey = ["permissions"] as const;

export function useGetPermissions(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: [...permissionsKey, params],
    queryFn: () => permissionsApi.list(params),
  });
}

export function useGetPermission(id: number | null) {
  return useQuery({
    queryKey: [...permissionsKey, id],
    queryFn: () => permissionsApi.getById(id!),
    enabled: id != null,
  });
}

export function useCreatePermission() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: permissionsApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: permissionsKey });
      toast.success("Permission created");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdatePermission() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: { description?: string } }) => permissionsApi.update(id, body),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: permissionsKey });
      qc.invalidateQueries({ queryKey: [...permissionsKey, id] });
      toast.success("Permission updated");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeletePermission() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: permissionsApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: permissionsKey });
      toast.success("Permission deleted");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
