export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string | null;
  role: string;
  userType?: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
  deviceToken?: string | null;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: AuthUser;
}

export interface RegisterAdminRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
}

export interface RegisterAdminResponse {
  success: boolean;
  message: string;
  admin: AuthUser;
}

