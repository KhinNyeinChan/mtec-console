import { UserRole } from '../constants/roles';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface TenantLoginRequest {
  tenantId: string;
  username: string;
  email: string;
  password: string;
}

export interface RegisterRequest {
  displayName: string;
  username: string;
  email: string;
  phone: string;
  password: string;
}

export interface TenantRegisterRequest {
  businessName: string;
  storeSlug: string;
  adminName: string;
  adminId: string;
  email: string;
  phone: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyResetOtpRequest {
  email: string;
  otp: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  password: string;
}

export interface TenantResetOtpRequest {
  tenantId: string;
  email: string;
}

export interface TenantVerifyResetOtpRequest {
  tenantId: string;
  email: string;
  otp: string;
}

export interface TenantResetPasswordRequest {
  tenantId: string;
  email: string;
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
