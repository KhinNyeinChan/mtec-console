import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  numberAttribute,
  output,
} from '@angular/core';
import { EmptyState } from '../empty-state/empty-state';
import { Pagination } from '../pagination/pagination';
import { TranslatePipe } from '@ngx-translate/core';

export type TableAlign = 'left' | 'center' | 'right';
export type TableAction = 'view' | 'edit' | 'delete';

export interface TableColumn<T = Record<string, unknown>> {
  key: string;
  header: string;
  width?: string;
  align?: TableAlign;
  value?: (row: T) => string | number | null | undefined;
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [Pagination, EmptyState, TranslatePipe],
  templateUrl: './table.html',
  styleUrl: './table.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Table<T extends Record<string, unknown> = Record<string, unknown>> {
  readonly columns = input<TableColumn<T>[]>([]);
  readonly data = input<T[]>([]);
  readonly totalItems = input(0, { transform: numberAttribute });
  readonly page = model(1);
  readonly pageSize = model(10);
  readonly pageSizeOptions = input<number[]>([10, 20, 50, 100]);
  readonly clientPagination = input(true, { transform: booleanAttribute });
  readonly actions = input<TableAction[]>(['view', 'edit', 'delete']);
  readonly showActions = input(true, { transform: booleanAttribute });
  readonly trackByKey = input<string>('id');
  readonly emptyTitle = input<string>('common.no_records');
  readonly emptyDescription = input<string>('');

  readonly view = output<T>();
  readonly edit = output<T>();
  readonly delete = output<T>();

  readonly hasActions = computed(
    () => this.showActions() && this.actions().length > 0,
  );
  readonly hasRows = computed(() => this.data().length > 0);
  readonly recordTotal = computed(() => {
    if (this.clientPagination()) {
      return this.data().length;
    }
    const total = Number(this.totalItems());
    if (Number.isFinite(total) && total > 0) {
      return total;
    }
    return this.data().length;
  });
  readonly pagedData = computed(() => {
    const rows = this.data();
    if (!this.clientPagination()) {
      return rows;
    }
    const size = this.pageSize() || 10;
    const page = Math.max(1, this.page() || 1);
    const start = (page - 1) * size;
    return rows.slice(start, start + size);
  });

  protected cellValue(row: T, column: TableColumn<T>): string {
    if (column.value) {
      const next = column.value(row);
      return next == null ? '' : String(next);
    }
    const raw = row[column.key];
    return raw == null ? '' : String(raw);
  }

  protected trackRow(index: number, row: T): string | number {
    const key = this.trackByKey();
    const id = row[key];
    return id == null ? index : (id as string | number);
  }

  protected hasAction(action: TableAction): boolean {
    return this.actions().includes(action);
  }

  protected onView(row: T): void {
    this.view.emit(row);
  }

  protected onEdit(row: T): void {
    this.edit.emit(row);
  }

  protected onDelete(row: T): void {
    this.delete.emit(row);
  }
}

//usage
// Client-side (default): pass full list; table slices by page/pageSize.
// <app-table
//   [columns]="columns"
//   [data]="rows()"
//   [(page)]="page"
//   [(pageSize)]="pageSize"
//   [actions]="['view', 'edit', 'delete']"
//   (view)="onView($event)"
//   (edit)="onEdit($event)"
//   (delete)="onDelete($event)"
// />
//
// Server-side: pass one page of rows + totalItems, disable local slicing.
// <app-table
//   [columns]="columns"
//   [data]="rows()"
//   [totalItems]="total()"
//   [clientPagination]="false"
//   [(page)]="page"
//   [(pageSize)]="pageSize"
// />
