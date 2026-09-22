export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    TENANT_LOGIN: '/auth/tenant/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    VERIFY_RESET_OTP: '/auth/verify-reset-otp',
    RESET_PASSWORD: '/auth/reset-password',
    TENANT_FORGOT_PASSWORD: '/auth/tenant/forgot-password',
    TENANT_VERIFY_RESET_OTP: '/auth/tenant/verify-reset-otp',
    TENANT_RESET_PASSWORD: '/auth/tenant/reset-password',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },

  TENANT: {
    CURRENT: '/tenants/current',
    REGISTER: '/tenants/register',
    BY_SLUG: (slug: string) => `/tenants/slug/${slug}`,
  },

  PRODUCTS: {
    BASE: '/products',
    BY_ID: (id: string) => `/products/${id}`,
  },

  CATEGORIES: {
    BASE: '/categories',
    BY_ID: (id: string) => `/categories/${id}`,
  },

  ORDERS: {
    BASE: '/orders',
    BY_ID: (id: string) => `/orders/${id}`,
  },

  CART: {
    BASE: '/cart',
  },
} as const;
