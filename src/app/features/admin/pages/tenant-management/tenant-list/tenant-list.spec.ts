import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { AdvSearchRow } from '../../../../../shared/components/adv-search/adv-search.model';
import {
  provideSharedTestTranslate,
  seedSharedTestTranslate,
} from '../../../../../shared/testing/provide-shared-translate';
import { TenantListPage } from './tenant-list';

describe('TenantListPage', () => {
  let fixture: ComponentFixture<TenantListPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TenantListPage],
      providers: [provideSharedTestTranslate()],
    }).compileComponents();

    seedSharedTestTranslate(TestBed.inject(TranslateService));
    fixture = TestBed.createComponent(TenantListPage);
    fixture.detectChanges();
  });

  it('should show the title, search, and dummy tenant rows', () => {
    const title = fixture.nativeElement.querySelector('.list-page-title') as HTMLElement;
    expect(title.textContent).toContain('Tenant List');
    expect(fixture.nativeElement.querySelector('app-simple-search')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('app-adv-search')).toBeNull();
    expect(fixture.nativeElement.querySelectorAll('tbody tr').length).toBe(10);

    (fixture.nativeElement.querySelector('#btnToggleSearch') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('app-adv-search')).toBeTruthy();
  });

  it('should filter dummy rows from the simple search', () => {
    fixture.componentInstance.onSimpleSearch('khin');
    fixture.detectChanges();

    const rows = [...fixture.nativeElement.querySelectorAll('tbody tr')] as HTMLElement[];
    expect(rows.length).toBe(1);
    expect(rows[0].textContent).toContain('Khin Fashion');
  });

  it('should filter dummy rows from the advanced search', () => {
    const filters: AdvSearchRow[] = [
      {
        key: 'status',
        itemid: 'status',
        datatype: 'status',
        condition: '',
        t1: 'inactive',
        t2: '',
        t3: '',
      },
    ];
    fixture.componentInstance.onAdvancedSearch(filters);
    fixture.detectChanges();

    const rows = [...fixture.nativeElement.querySelectorAll('tbody tr')] as HTMLElement[];
    expect(rows.length).toBe(4);
    expect(rows.every((row) => row.textContent?.includes('Inactive'))).toBe(true);
  });
});
