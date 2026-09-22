import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AdvSearch } from '../../../../../shared/components/adv-search/adv-search';
import {
  AdvSearchField,
  AdvSearchRow,
} from '../../../../../shared/components/adv-search/adv-search.model';
import { SimpleSearch } from '../../../../../shared/components/simple-search/simple-search';
import { Table } from '../../../../../shared/components/table/table';
import { TableColumn } from '../../../../../shared/models/table.model';
import { DUMMY_TENANTS, TenantListItem } from '../tenant-manangement.model';

@Component({
  selector: 'app-tenant-list-page',
  standalone: true,
  imports: [TranslatePipe, SimpleSearch, AdvSearch, Table],
  templateUrl: './tenant-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TenantListPage {
  private readonly i18n = inject(TranslateService);
  private readonly router = inject(Router);

  /** Dummy rows until the tenant list API is connected. */
  private readonly source = signal<TenantListItem[]>(DUMMY_TENANTS);

  readonly keyword = signal('');
  readonly advancedOpen = signal(false);
  readonly appliedFilters = signal<AdvSearchRow[]>([]);
  readonly filterRows = signal<AdvSearchRow[]>([]);
  readonly page = signal(1);
  readonly pageSize = signal(10);

  readonly fields = computed<AdvSearchField[]>(() => {
    this.i18n.currentLang();
    return [
      { itemid: 'businessName', caption: this.label('admin.business_name'), datatype: 'string' },
      { itemid: 'storeSlug', caption: this.label('admin.store_slug'), datatype: 'string' },
      { itemid: 'adminName', caption: this.label('admin.admin_name'), datatype: 'string' },
      { itemid: 'email', caption: this.label('admin.tenant_email'), datatype: 'string' },
      { itemid: 'phone', caption: this.label('admin.tenant_phone'), datatype: 'string' },
      { itemid: 'status', caption: this.label('admin.status'), datatype: 'status' },
      { itemid: 'createdAt', caption: this.label('admin.created_at'), datatype: 'date' },
    ];
  });

  readonly typeLists = {
    status: [
      { value: 'active', caption: 'admin.status_active' },
      { value: 'inactive', caption: 'admin.status_inactive' },
    ],
  };

  readonly columns: TableColumn<TenantListItem>[] = [
    { key: 'businessName', header: 'admin.business_name' },
    { key: 'storeSlug', header: 'admin.store_slug' },
    { key: 'adminName', header: 'admin.admin_name' },
    { key: 'email', header: 'admin.tenant_email' },
    { key: 'phone', header: 'admin.tenant_phone' },
    {
      key: 'status',
      header: 'admin.status',
      value: (row) => this.statusLabel(row.status),
    },
    { key: 'createdAt', header: 'admin.created_at' },
  ];

  readonly filtered = computed(() => {
    const keyword = this.keyword().trim().toLowerCase();
    const filters = this.appliedFilters();
    return this.source().filter((row) => {
      const matchesKeyword =
        !keyword ||
        [row.businessName, row.storeSlug, row.adminName, row.email, row.phone, row.status].some(
          (value) => value.toLowerCase().includes(keyword),
        );
      return matchesKeyword && filters.every((filter) => this.matches(row, filter));
    });
  });

  onSimpleSearch(value: string): void {
    this.keyword.set(value);
    this.page.set(1);
  }

  toggleAdvanced(): void {
    this.advancedOpen.update((open) => !open);
  }

  goNew(): void {
    void this.router.navigateByUrl('/admin/tenants/new');
  }

  onAdvancedSearch(rows: AdvSearchRow[]): void {
    this.appliedFilters.set(rows);
    this.page.set(1);
  }

  private matches(row: TenantListItem, filter: AdvSearchRow): boolean {
    const raw = row[filter.itemid] ?? '';
    const first = filter.t1.trim();
    const second = filter.t2.trim();
    if (!first && !second) {
      return true;
    }

    if (filter.datatype === 'date') {
      return this.matchesDate(raw, filter.condition, first, second);
    }

    if (filter.datatype === 'status') {
      return raw === first;
    }

    const value = raw.toLowerCase();
    const query = first.toLowerCase();
    switch (filter.condition) {
      case 'eq':
        return value === query;
      case 'startswith':
        return value.startsWith(query);
      case 'endswith':
        return value.endsWith(query);
      default:
        return value.includes(query);
    }
  }

  private matchesDate(value: string, condition: string, from: string, to: string): boolean {
    switch (condition) {
      case 'gt':
        return value > from;
      case 'lt':
        return value < from;
      case 'gte':
        return value >= from;
      case 'lte':
        return value <= from;
      case 'between':
      case 'btw':
        return (!from || value >= from) && (!to || value <= to);
      default:
        return value === from;
    }
  }

  private statusLabel(status: string): string {
    this.i18n.currentLang();
    return status === 'active' ? this.label('admin.status_active') : this.label('admin.status_inactive');
  }

  private label(key: string): string {
    const translated = this.i18n.instant(key);
    return typeof translated === 'string' ? translated : key;
  }
}
