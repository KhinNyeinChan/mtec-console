import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  input,
  model,
  numberAttribute,
  signal,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

export type PaginationItem = { kind: 'page'; value: number } | { kind: 'ellipsis' };

let nextId = 0;

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './pagination.html',
  styleUrl: './pagination.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Pagination {
  readonly page = model(1);
  readonly pageSize = model(10);
  readonly totalItems = input(0, { transform: numberAttribute });
  readonly pageSizeOptions = input<number[]>([10, 20, 50, 100]);

  protected readonly selectId = `pagination-size-${++nextId}`;
  protected readonly menuOpen = signal(false);
  private readonly host = inject(ElementRef<HTMLElement>);

  protected readonly totalPages = computed(() => {
    const size = this.pageSize() || 1;
    const total = Number(this.totalItems());
    if (!Number.isFinite(total) || total <= 0) {
      return 1;
    }
    return Math.ceil(total / size);
  });

  protected readonly items = computed(() =>
    buildPageItems(this.page() || 1, this.totalPages()),
  );
  protected readonly isFirstPage = computed(() => this.page() <= 1);
  protected readonly isLastPage = computed(() => this.page() >= this.totalPages());

  protected goTo(page: number): void {
    const next = Math.min(this.totalPages(), Math.max(1, page));
    this.page.set(next);
  }

  protected previous(): void {
    this.goTo(this.page() - 1);
  }

  protected next(): void {
    this.goTo(this.page() + 1);
  }

  protected toggleMenu(event: Event): void {
    event.stopPropagation();
    this.menuOpen.update((open) => !open);
  }

  protected selectPageSize(size: number): void {
    this.pageSize.set(size);
    this.page.set(1);
    this.menuOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    if (!this.host.nativeElement.contains(event.target as Node)) {
      this.menuOpen.set(false);
    }
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    this.menuOpen.set(false);
  }
}

function buildPageItems(current: number, total: number): PaginationItem[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => ({ kind: 'page', value: index + 1 }));
  }

  const windowStart = Math.min(Math.max(current - 2, 1), Math.max(total - 4, 1));
  const windowEnd = Math.min(windowStart + 4, total);
  const items: PaginationItem[] = [];

  if (windowStart > 1) {
    items.push({ kind: 'page', value: 1 });
    if (windowStart > 2) {
      items.push({ kind: 'ellipsis' });
    }
  }

  for (let page = windowStart; page <= windowEnd; page += 1) {
    if (page === 1 && windowStart > 1) {
      continue;
    }
    if (page === total && windowEnd < total) {
      continue;
    }
    items.push({ kind: 'page', value: page });
  }

  if (windowEnd < total) {
    if (windowEnd < total - 1) {
      items.push({ kind: 'ellipsis' });
    }
    items.push({ kind: 'page', value: total });
  }

  return items;
}

//usage
// page, pageSize, and total should be signals:
// <app-pagination [(page)]="page" [(pageSize)]="pageSize" [totalItems]="total()" />
