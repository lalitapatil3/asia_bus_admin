import { useQuery } from "@tanstack/react-query";
import {
  bookingsApi,
  type BookingListParams,
} from "../api/endpoints/bookings.api";

export const bookingsKey = ["my-bookings"] as const;

/**
 * Fetch the current vendor's booking history with filters + pagination.
 */
export function useGetMyBookings(params?: BookingListParams) {
  return useQuery({
    queryKey: [...bookingsKey, params],
    queryFn: () => bookingsApi.getMyBookings(params),
    staleTime: 30_000,
  });
}
