import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  model,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { filter } from 'rxjs';
import { APP_CONSTANTS } from '../../../core/constants/app.constants';
import { SKIP_LOADING_HEADER } from '../../../core/http/loading.interceptor';
import { StorageService } from '../../../core/services/storage.service';

export interface AdminSidebarItem {
  id: string;
  labelKey: string;
  /** Raw SVG markup rendered as the menu icon. */
  icon: string;
  route?: string;
  exact?: boolean;
  action?: 'logout';
  show?: boolean;
  children?: AdminSidebarItem[];
}

export interface AdminMenuConfig {
  primary: AdminSidebarItem[];
  footer: AdminSidebarItem[];
}

const ADMIN_MENU_URL = '/assets/json/admin-menu.json';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, TranslatePipe],
  templateUrl: './admin-sidebar.html',
  styleUrl: './admin-sidebar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminSidebar implements OnInit {
  private readonly storage = inject(StorageService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly brand = input<string>('admin.brand');
  readonly collapsed = model(false);

  readonly logout = output<void>();

  readonly primaryItems = signal<AdminSidebarItem[]>([]);
  readonly footerItems = signal<AdminSidebarItem[]>([]);
  readonly expandedIds = signal<ReadonlySet<string>>(new Set());

  readonly toggleLabelKey = computed(() =>
    this.collapsed() ? 'admin.expand_menu' : 'admin.collapse_menu',
  );

  constructor() {
    const saved = this.storage.get<boolean>(APP_CONSTANTS.ADMIN.SIDEBAR_COLLAPSED);
    if (saved != null) {
      this.collapsed.set(saved);
    }

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.openActiveGroups());
  }

  ngOnInit(): void {
    this.http
      .get<AdminMenuConfig>(ADMIN_MENU_URL, {
        headers: new HttpHeaders({ [SKIP_LOADING_HEADER]: 'true' }),
      })
      .subscribe({
        next: (menu) => {
          this.primaryItems.set(this.visibleItems(menu.primary));
          this.footerItems.set(this.visibleItems(menu.footer));
          this.openActiveGroups();
        },
        error: () => {
          this.primaryItems.set([]);
          this.footerItems.set([]);
        },
      });
  }

  toggle(): void {
    const next = !this.collapsed();
    this.collapsed.set(next);
    this.storage.set(APP_CONSTANTS.ADMIN.SIDEBAR_COLLAPSED, next);
  }

  hasChildren(item: AdminSidebarItem): boolean {
    return (item.children?.length ?? 0) > 0;
  }

  isExpanded(id: string): boolean {
    return this.expandedIds().has(id);
  }

  toggleGroup(item: AdminSidebarItem, event?: Event): void {
    event?.preventDefault();
    event?.stopPropagation();

    if (this.collapsed()) {
      return;
    }

    const next = new Set(this.expandedIds());
    if (next.has(item.id)) {
      next.delete(item.id);
    } else {
      next.add(item.id);
    }
    this.expandedIds.set(next);
  }

  isGroupActive(item: AdminSidebarItem): boolean {
    if (item.route && this.isRouteActive(item.route, item.exact)) {
      return true;
    }
    return (item.children ?? []).some(
      (child) =>
        (!!child.route && this.isRouteActive(child.route, child.exact)) || this.isGroupActive(child),
    );
  }

  onItemClick(item: AdminSidebarItem, event: Event): void {
    if (item.action === 'logout') {
      event.preventDefault();
      this.logout.emit();
    }
  }

  iconSvg(icon: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(icon ?? '');
  }

  private visibleItems(items: AdminSidebarItem[] | undefined): AdminSidebarItem[] {
    return (items ?? [])
      .filter((item) => item.show !== false)
      .map((item) => ({
        ...item,
        children: this.visibleItems(item.children),
      }));
  }

  private openActiveGroups(): void {
    const next = new Set(this.expandedIds());
    for (const item of this.primaryItems()) {
      if (this.hasChildren(item) && this.isGroupActive(item)) {
        next.add(item.id);
      }
    }
    this.expandedIds.set(next);
  }

  private isRouteActive(route: string, exact?: boolean): boolean {
    return this.router.isActive(route, {
      paths: exact ? 'exact' : 'subset',
      queryParams: 'ignored',
      fragment: 'ignored',
      matrixParams: 'ignored',
    });
  }
}
