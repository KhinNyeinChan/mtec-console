import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import {
  provideSharedTestTranslate,
  seedSharedTestTranslate,
} from '../../testing/provide-shared-translate';
import { TableColumn } from '../../models/table.model';
import { Table } from './table';

interface DemoRow {
  id: number;
  name: string;
  role: string;
  [key: string]: unknown;
}

describe('Table', () => {
  let fixture: ComponentFixture<Table<DemoRow>>;

  const columns: TableColumn<DemoRow>[] = [
    { key: 'name', header: 'Name' },
    { key: 'role', header: 'Role' },
  ];

  const rows: DemoRow[] = [
    { id: 1, name: 'Alice', role: 'Admin' },
    { id: 2, name: 'Bob', role: 'User' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Table],
      providers: [provideSharedTestTranslate()],
    }).compileComponents();

    seedSharedTestTranslate(TestBed.inject(TranslateService));
    fixture = TestBed.createComponent(Table<DemoRow>);
    fixture.componentRef.setInput('columns', columns);
    fixture.componentRef.setInput('data', rows);
    fixture.componentRef.setInput('totalItems', 25);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render headers, rows, and total', () => {
    const headers = Array.from(
      fixture.nativeElement.querySelectorAll('thead th') as NodeListOf<HTMLElement>,
    ).map((cell) => cell.textContent?.trim());

    expect(headers).toEqual(['Name', 'Role']);
    expect(fixture.nativeElement.querySelectorAll('tbody tr').length).toBe(2);
    expect(fixture.nativeElement.querySelector('.actions-col')).toBeNull();
    expect(fixture.nativeElement.querySelector('.total')?.textContent).toContain('2 records');
    expect(fixture.nativeElement.querySelector('app-pagination')).toBeTruthy();
  });

  it('should show empty state when there are no rows', () => {
    fixture.componentRef.setInput('data', []);
    fixture.componentRef.setInput('totalItems', 0);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-empty-state')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('table')).toBeNull();
  });

  it('should paginate rows when page size changes', () => {
    const manyRows: DemoRow[] = Array.from({ length: 18 }, (_, index) => ({
      id: index + 1,
      name: `User ${index + 1}`,
      role: 'User',
    }));
    fixture.componentRef.setInput('data', manyRows);
    fixture.componentRef.setInput('pageSize', 10);
    fixture.componentRef.setInput('page', 1);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('tbody tr').length).toBe(10);

    fixture.componentInstance.pageSize.set(20);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('tbody tr').length).toBe(18);
  });
});
