export interface Tenant {
  id: string;
  name: string;
  slug: string;
  domain?: string;
  logoUrl: string;
  primaryColor: string;
  currency: string;
  active: boolean;
}
