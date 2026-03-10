const normalizeBaseUrl = (url: string) => {
  if (!url) return '';
  return url.endsWith('/') ? url.slice(0, -1) : url;
};

export const API_BASE_URL = normalizeBaseUrl(
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api'
);

export const API_ENDPOINTS = {
  auth: {
    login: '/admin/login',
    register: '/admin/register',
  },
  users: {
    base: '/users',
  },
} as const;

export type ApiEndpointGroup = typeof API_ENDPOINTS;

