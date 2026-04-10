import { api } from "../axios";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AdminTransaction {
  id: number;
  vendorId: number;
  vendorName: string;
  companyName?: string;
  amount: string;
  balance: string;
  type: "CREDIT" | "DEBIT";
  transactionType: string;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  status: "pending" | "captured" | "failed";
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface TransactionListParams {
  page?: number;
  limit?: number;
  fromDate?: string; // YYYY-MM-DD
  toDate?: string;   // YYYY-MM-DD
  vendorId?: number;
}

export interface TransactionListResponse {
  success: boolean;
  message: string;
  data: AdminTransaction[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface VendorOption {
  id: number;
  fullName: string;
  companyName: string;
}

export interface VendorListSimpleResponse {
  success: boolean;
  data: VendorOption[];
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

export const transactionsApi = {
  /**
   * Fetch all vendor transactions (admin only).
   * Backend: GET /wallets/admin/transactions
   */
  listAll: (params?: TransactionListParams) =>
    api
      .get<TransactionListResponse>("/wallets/admin/transactions", { params })
      .then((r) => r.data),

  /**
   * Lightweight vendor list for the filter dropdown.
   * Reuses the existing /vendors endpoint with a large limit.
   */
  getVendorOptions: () =>
    api
      .get<VendorListSimpleResponse>("/vendors", {
        params: { limit: 500, status: "approved" },
      })
      .then((r) => r.data.data as VendorOption[]),
};
