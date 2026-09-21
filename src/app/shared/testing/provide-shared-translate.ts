import { Provider } from '@angular/core';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';

export const SHARED_TEST_I18N = {
  common: {
    loading: 'Loading',
    cancel: 'Cancel',
    confirm: 'Confirm',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View',
    search: 'Search',
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
