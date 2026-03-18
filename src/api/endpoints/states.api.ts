import { api } from "../axios";

export interface StateData {
  id: number;
  name: string;
  seatSellerStateId: string;
  createdAt?: string;
  updatedAt?: string;
}

export const getStates = async (search?: string) => {
  const { data } = await api.get<{ success: boolean; data: StateData[] }>("/states", {
    params: { search },
  });
  return data.data;
};

export const getStateById = async (id: string | number) => {
  const { data } = await api.get<{ success: boolean; data: StateData }>(`/states/${id}`);
  return data.data;
};

export const createState = async (payload: { name: string; seatSellerStateId: string }) => {
  const { data } = await api.post<{ success: boolean; data: StateData }>("/states", payload);
  return data.data;
};

export const updateState = async (id: string | number, payload: { name: string; seatSellerStateId: string }) => {
  const { data } = await api.put<{ success: boolean; data: StateData }>(`/states/${id}`, payload);
  return data.data;
};

export const deleteState = async (id: string | number) => {
  const { data } = await api.delete<{ success: boolean }>(`/states/${id}`);
  return data.success;
};
