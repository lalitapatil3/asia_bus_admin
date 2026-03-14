import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
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
      toast.success("Vendor registered");
    },
    onError: (err: Error) => toast.error(err.message),
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
      toast.success("Vendor updated");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteVendor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: vendorsApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: vendorsKey });
      toast.success("Vendor deactivated");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useApproveVendor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => vendorsApi.approve(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: vendorsKey });
      qc.invalidateQueries({ queryKey: [...vendorsKey, id] });
      toast.success("Vendor approved");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useRejectVendor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => vendorsApi.reject(id),
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: vendorsKey });
      qc.invalidateQueries({ queryKey: [...vendorsKey, id] });
      toast.success("Vendor rejected");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
