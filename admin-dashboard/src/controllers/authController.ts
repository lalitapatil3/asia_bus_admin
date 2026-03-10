import { API_ENDPOINTS } from '../constants/api';
import { apiClient } from '../services/apiClient';
import type {
  LoginRequest,
  LoginResponse,
  RegisterAdminRequest,
  RegisterAdminResponse,
} from '../types/auth';

export const authController = {
  login: (payload: LoginRequest) =>
    apiClient<LoginResponse>(API_ENDPOINTS.auth.login, {
      method: 'POST',
      body: payload,
      skipAuthHeader: true,
    }),

  register: (payload: RegisterAdminRequest) =>
    apiClient<RegisterAdminResponse>(API_ENDPOINTS.auth.register, {
      method: 'POST',
      body: payload,
      skipAuthHeader: true,
    }),
};

