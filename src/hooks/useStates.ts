import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import * as statesApi from "../api/endpoints/states.api";

export const statesKey = ["states"] as const;

export function useGetStates(search?: string) {
  return useQuery({
    queryKey: [...statesKey, search],
    queryFn: () => statesApi.getStates(search),
  });
}

export function useGetState(id: number | string | null) {
  return useQuery({
    queryKey: [...statesKey, id],
    queryFn: () => statesApi.getStateById(id!),
    enabled: id != null,
  });
}

export function useCreateState() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: statesApi.createState,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: statesKey });
      toast.success("State created");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateState() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string | number; payload: Parameters<typeof statesApi.updateState>[1] }) =>
      statesApi.updateState(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: statesKey });
      qc.invalidateQueries({ queryKey: [...statesKey, id] });
      toast.success("State updated");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteState() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: statesApi.deleteState,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: statesKey });
      toast.success("State deleted");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
