import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { showSuccess, showError } from "../utils/toast";
import {
  vendorsApi,
  type VendorStatus,
} from "../api/endpoints/vendors.api";

export const vendorsKey = ["vendors"] as const;

export function useGetVendors(params?: {
  page?: number;
  limit?: number;
  status?: VendorStatus;
  search?: string;
}) {
  return useQuery({
    queryKey: [...vendorsKey, params],
    queryFn: () => vendorsApi.list(params),
  });
}

export function useGetVendor(id: number | null) {
  return useQuery({
    queryKey: [...vendorsKey, id],
    queryFn: () => vendorsApi.getById(id!),
    enabled: id != null,
  });
}

export function useCreateVendor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: vendorsApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: vendorsKey });
      showSuccess("Vendor registered");
    },
    onError: (err: Error) => showError(err, "Failed to register vendor"),
  });
}

export function useUpdateVendor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: number;
      body: Parameters<typeof vendorsApi.update>[1];
    }) => vendorsApi.update(id, body),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: vendorsKey });
      qc.invalidateQueries({ queryKey: [...vendorsKey, id] });
      showSuccess("Vendor updated");
    },
    onError: (err: Error) => showError(err, "Failed to update vendor"),
  });
}

export function useDeleteVendor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: vendorsApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: vendorsKey });
      showSuccess("Vendor deactivated");
    },
    onError: (err: Error) => showError(err, "Failed to deactivate vendor"),
  });
}

export function useApproveVendor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => vendorsApi.approve(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: vendorsKey });
      qc.invalidateQueries({ queryKey: [...vendorsKey, id] });
      showSuccess("Vendor approved");
    },
    onError: (err: Error) => showError(err, "Failed to approve vendor"),
  });
}

export function useRejectVendor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => vendorsApi.reject(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: vendorsKey });
      qc.invalidateQueries({ queryKey: [...vendorsKey, id] });
      showSuccess("Vendor rejected");
    },
    onError: (err: Error) => showError(err, "Failed to reject vendor"),
  });
}

export function useMyVendorApiKeys() {
  return useQuery({
    queryKey: ["my-vendor-api-keys"],
    queryFn: vendorsApi.getMyApiKeys,
  });
}

export function useCreateMyVendorApiKey(options?: {
  onSuccess?: (data: Awaited<ReturnType<typeof vendorsApi.createMyApiKey>>) => void;
}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: vendorsApi.createMyApiKey,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["my-vendor-api-keys"] });
      showSuccess("API key generated");
      if (options?.onSuccess) {
        options.onSuccess(data);
      }
    },
    onError: (err: Error) => showError(err, "Failed to generate API key"),
  });
}
