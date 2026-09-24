import { Provider } from '@angular/core';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';

export const SHARED_TEST_I18N = {
  common: {
    loading: 'Loading',
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View',
    search: 'Search',
    new: 'New',
    select: 'Select',
    close: 'Close',
    no_records: 'No records found',
    no_results: 'No results',
    actions: 'Actions',
    are_you_sure: 'Are you sure?',
    confirm_description:
      "This action can't be undone. Please confirm if you want to proceed.",
    total_records: 'Total: {{count}} records',
    pagination: 'Pagination',
    previous_page: 'Previous page',
    next_page: 'Next page',
    page: 'Page {{page}}',
    items_per_page: 'Items per page',
    per_page: '{{size}} / page',
  },
  admin: {
    tenants: 'Tenants',
    tenant_list: 'Tenant List',
    tenant_create: 'New Tenant',
    tenant_saved: 'Tenant saved',
    tenant_search: 'Search tenants',
    business_name: 'Business Name',
    store_slug: 'Store Slug',
    admin_name: 'Admin Name',
    tenant_email: 'Email',
    tenant_phone: 'Phone',
    status: 'Status',
    status_active: 'Active',
    status_inactive: 'Inactive',
    role_id: 'Role ID',
    role_name: 'Role Name',
    role_name_required: 'Role name is required',
    user_role_list: 'User Role List',
    user_role_create: 'New User Role',
    user_role_saved: 'User role saved',
    user_role_search: 'Search user roles',
    tenant_role_list: 'Tenant Role List',
    tenant_role_create: 'New Tenant Role',
    tenant_role_saved: 'Tenant role saved',
    tenant_role_search: 'Search tenant roles',
    created_at: 'Created',
    created_date: 'Created Date',
    created_by: 'Created By',
  },
  adv_search: {
    filter: 'Filter',
    advanced: 'Advanced Search',
    remove_filter: 'Remove filter',
    add_filter: 'Add filter',
    contains: 'Contains',
    equals: 'Equals',
    starts_with: 'Starts with',
    ends_with: 'Ends with',
    greater_than: 'Greater than',
    less_than: 'Less than',
    greater_or_equal: 'Greater or equal',
    less_or_equal: 'Less or equal',
    between: 'Between',
  },
};

export function provideSharedTestTranslate(): Provider[] {
  return provideTranslateService({
    fallbackLang: 'eng',
    lang: 'eng',
  });
}

export function seedSharedTestTranslate(translate: TranslateService): void {
  translate.setTranslation('eng', SHARED_TEST_I18N);
  translate.use('eng');
}
