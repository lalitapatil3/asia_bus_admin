import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { assignmentsApi } from "../api/endpoints/assignments.api";
import { usersKey } from "./useUsers";
import { rolesKey } from "./useRoles";

const assignmentsKey = ["assignments"] as const;

export function useGetUserRoles(userId: number | null) {
  return useQuery({
    queryKey: [...assignmentsKey, "userRoles", userId],
    queryFn: () => assignmentsApi.getUserRoles(userId!),
    enabled: userId != null,
  });
}

export function useGetUserPermissions(userId: number | null) {
  return useQuery({
    queryKey: [...assignmentsKey, "userPermissions", userId],
    queryFn: () => assignmentsApi.getUserPermissions(userId!),
    enabled: userId != null,
  });
}

export function useAssignRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: assignmentsApi.assignRole,
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: [...assignmentsKey, "userRoles", variables.userId] });
      qc.invalidateQueries({ queryKey: usersKey });
      qc.invalidateQueries({ queryKey: rolesKey });
      toast.success("Role assigned");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useRevokeRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: assignmentsApi.revokeRole,
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: [...assignmentsKey, "userRoles", variables.userId] });
      qc.invalidateQueries({ queryKey: usersKey });
      qc.invalidateQueries({ queryKey: rolesKey });
      toast.success("Role revoked");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useGrantPermission() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: assignmentsApi.grantOrRevokePermission,
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: [...assignmentsKey, "userPermissions", variables.userId] });
      qc.invalidateQueries({ queryKey: usersKey });
      toast.success("Permission updated");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
