import { UserRole } from '../constants/roles';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  displayName: string;
  username: string;
  email: string;
  phone: string;
  password: string;
}

export interface VerifyResetOtpRequest {
  otp: string;
}

export interface ResetPasswordRequest {
  otp: string;
  password: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: User;
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  roles: UserRole[];
  tenantId?: string;
}
