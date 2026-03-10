import { API_BASE_URL } from '../constants/api';
import { authStorage } from '../utils/auth';

interface ApiClientOptions extends Omit<RequestInit, 'body'> {
  skipAuthHeader?: boolean;
}

const buildHeaders = (options: ApiClientOptions = {}, body?: unknown) => {
  const headers = new Headers(options.headers ?? {});

  if (!body || !(body instanceof FormData)) {
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
  }

  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json');
  }

  return headers;
};

const withBaseUrl = (endpoint: string) => {
  if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
    return endpoint;
  }

  return `${API_BASE_URL}${endpoint}`;
};

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export async function apiClient<TResponse = unknown, TBody = unknown>(
  endpoint: string,
  { body, skipAuthHeader, ...options }: ApiClientOptions & { body?: TBody } = {}
): Promise<TResponse> {
  const headers = buildHeaders(options, body);

  const token = authStorage.getToken();
  if (token && !skipAuthHeader) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const requestInit: RequestInit = {
    ...options,
    headers,
    body:
      body instanceof FormData
        ? body
        : body !== undefined
          ? JSON.stringify(body)
          : undefined,
  };

  const response = await fetch(withBaseUrl(endpoint), requestInit);

  const contentType = response.headers.get('Content-Type') ?? '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message =
      typeof payload === 'object' && payload && 'message' in payload
        ? String((payload as { message: unknown }).message)
        : response.statusText || 'Request failed';

    throw new ApiError(message, response.status, payload);
  }

  return payload as TResponse;
}

