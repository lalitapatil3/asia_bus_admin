import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import * as citiesApi from "../api/endpoints/cities.api";

export const citiesKey = ["cities"] as const;

export function useGetCities(params?: { search?: string; stateId?: number | string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: [...citiesKey, params],
    queryFn: () => citiesApi.getCities(params),
  });
}

export function useGetCity(id: number | string | null) {
  return useQuery({
    queryKey: [...citiesKey, id],
    queryFn: () => citiesApi.getCityById(id!),
    enabled: id != null,
  });
}

export function useCreateCity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: citiesApi.createCity,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: citiesKey });
      toast.success("City created");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useUpdateCity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string | number; payload: Parameters<typeof citiesApi.updateCity>[1] }) =>
      citiesApi.updateCity(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: citiesKey });
      qc.invalidateQueries({ queryKey: [...citiesKey, id] });
      toast.success("City updated");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useDeleteCity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: citiesApi.deleteCity,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: citiesKey });
      toast.success("City deleted");
    },
    onError: (err: Error) => toast.error(err.message),
  });
}
