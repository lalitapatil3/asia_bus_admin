import { useQuery } from "@tanstack/react-query";
import {
  transactionsApi,
  type TransactionListParams,
} from "../api/endpoints/transactions.api";

export const transactionsKey = ["admin-transactions"] as const;
export const vendorOptionsKey = ["vendor-options-simple"] as const;

/**
 * Fetch paginated + filtered admin transaction list.
 */
export function useGetAllTransactions(params?: TransactionListParams) {
  return useQuery({
    queryKey: [...transactionsKey, params],
    queryFn: () => transactionsApi.listAll(params),
    staleTime: 30_000, // 30 s
  });
}

/**
 * Fetch a lightweight list of vendors for the filter dropdown.
 */
export function useGetVendorOptions() {
  return useQuery({
    queryKey: vendorOptionsKey,
    queryFn: transactionsApi.getVendorOptions,
    staleTime: 5 * 60_000, // 5 min — vendor list changes slowly
  });
}
