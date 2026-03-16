import { api } from "../axios";

export type VendorStatus = "pending" | "approved" | "rejected";

export interface VendorListItem {
  id: number;
  userId: number;
  fullName: string;
  mobileNo: string;
  companyName: string;
  city: string;
  aadharNo: string;
  panNo: string;
  isMsme: boolean;
  isCorporate: boolean;
  termsAccepted: boolean;
  allowWhatsapp: boolean;
  status: VendorStatus;
  email?: string;
  hasActiveApiKey?: boolean;
  aadharDocumentPath?: string | null;
  panDocumentPath?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export const vendorsApi = {
  list: (params?: {
    page?: number;
    limit?: number;
    status?: VendorStatus;
    search?: string;
  }) =>
    api
      .get<PaginatedResponse<VendorListItem>>("/vendors", { params })
      .then((r) => r.data),

  getById: (id: number) =>
    api
      .get<{ success: boolean; data: VendorListItem }>(`/vendors/${id}`)
      .then((r) => r.data.data),

  create: (body: {
    email: string;
    password: string;
    fullName: string;
    mobileNo: string;
    companyName: string;
    city: string;
    aadharNo: string;
    panNo: string;
    isMsme: boolean;
    isCorporate: boolean;
    termsAccepted: boolean;
    allowWhatsapp?: boolean;
    aadharDocumentPath?: string;
    panDocumentPath?: string;
  }) =>
    api
      .post<{ success: boolean; data: VendorListItem }>("/vendors", body)
      .then((r) => r.data.data),

  update: (
    id: number,
    body: Partial<{
      fullName: string;
      mobileNo: string;
      companyName: string;
      city: string;
      aadharNo: string;
      panNo: string;
      isMsme: boolean;
      isCorporate: boolean;
      allowWhatsapp: boolean;
      aadharDocumentPath: string;
      panDocumentPath: string;
    }>
  ) =>
    api
      .put<{ success: boolean; data: VendorListItem }>(`/vendors/${id}`, body)
      .then((r) => r.data.data),

  delete: (id: number) => api.delete(`/vendors/${id}`).then((r) => r.data),

  approve: (id: number) =>
    api
      .patch<{ success: boolean; data: VendorListItem }>(`/vendors/${id}/approve`)
      .then((r) => r.data.data),

  reject: (id: number) =>
    api
      .patch<{ success: boolean; data: VendorListItem }>(`/vendors/${id}/reject`)
      .then((r) => r.data.data),

  getMyApiKeys: () =>
    api
      .get<{ success: boolean; data: { id: number; name: string | null; maskedKey: string; status: string; createdAt?: string; lastUsedAt?: string | null; rateLimitTier?: string | null }[] }>("/vendors/me/api-keys")
      .then((r) => r.data.data),

  createMyApiKey: () =>
    api
      .post<{ success: boolean; message: string; data: { id: number; apiKey: string; name: string | null; createdAt?: string } }>("/vendors/me/api-keys")
      .then((r) => r.data.data),
};
