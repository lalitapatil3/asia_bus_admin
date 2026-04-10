import { api } from "../axios";
import { StateData } from "./states.api";

export interface CityData {
  id: number;
  name: string;
  stateId: number;
  seatSellerCityId: string;
  latitude?: string | null;
  longitude?: string | null;
  State?: StateData;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedCities {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  cities: CityData[];
}

export const getCities = async (params?: { search?: string; stateId?: number | string; page?: number; limit?: number }) => {
  const { data } = await api.get<{ success: boolean; data: PaginatedCities }>("/cities", {
    params,
  });
  return data.data;
};

export const getCityById = async (id: string | number) => {
  const { data } = await api.get<{ success: boolean; data: CityData }>(`/cities/${id}`);
  return data.data;
};

export const createCity = async (payload: {
  name: string;
  stateId: number;
  seatSellerCityId: string;
  latitude?: string;
  longitude?: string;
}) => {
  const { data } = await api.post<{ success: boolean; data: CityData }>("/cities", payload);
  return data.data;
};

export const updateCity = async (
  id: string | number,
  payload: {
    name: string;
    stateId: number;
    seatSellerCityId: string;
    latitude?: string;
    longitude?: string;
  }
) => {
  const { data } = await api.put<{ success: boolean; data: CityData }>(`/cities/${id}`, payload);
  return data.data;
};

export const deleteCity = async (id: string | number) => {
  const { data } = await api.delete<{ success: boolean }>(`/cities/${id}`);
  return data.success;
};
