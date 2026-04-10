import { api } from "../axios";

// ─── Types ────────────────────────────────────────────────────────────────────

export type BookingStatus = "blocked" | "confirmed" | "cancelled" | "expired" | "failed";

export interface BookingRecord {
  id: number;
  tin: string | null;
  pnr: string | null;
  bookingDate: string;
  journeyDate: string | null;
  passengerName: string;
  passengerMobile: string;
  seats: string;
  operatorName: string;
  source: string | null;
  destination: string | null;
  route: string;
  fare: number;
  status: BookingStatus;
}

export type BookingDateType = "booking" | "journey";

export interface BookingListParams {
  tin?: string;
  mobile?: string;
  status?: BookingStatus | "";
  dateType?: BookingDateType;
  fromDate?: string; // YYYY-MM-DD
  toDate?: string;   // YYYY-MM-DD
  page?: number;
  limit?: number;
}

export interface BookingListResponse {
  success: boolean;
  message: string;
  data: BookingRecord[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// ─── API ──────────────────────────────────────────────────────────────────────

export const bookingsApi = {
  /**
   * GET /bookings/my — fetch the current vendor's booking history.
   */
  getMyBookings: (params?: BookingListParams) =>
    api
      .get<BookingListResponse>("/bookings/my", { params })
      .then((r) => r.data),
};
