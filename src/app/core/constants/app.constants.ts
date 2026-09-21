export const APP_CONSTANTS = {
  DEFAULT_PAGE_SIZE: 10,
  DEFAULT_CURRENCY: 'USD',

  TOKEN: {
    ACCESS: 'access_token',
    REFRESH: 'refresh_token',
  },

  TENANT: {
    CURRENT: 'current_tenant',
  },

  I18N: {
    LANGUAGE: 'app_language',
  },

  HTTP: {
    TENANT_HEADER: 'X-Tenant-Id',
  },
} as const;
