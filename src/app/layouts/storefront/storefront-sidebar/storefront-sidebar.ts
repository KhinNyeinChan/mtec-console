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
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { filter } from 'rxjs';
import { APP_CONSTANTS } from '../../../core/constants/app.constants';
import { SKIP_LOADING_HEADER } from '../../../core/http/loading.interceptor';
import { StorageService } from '../../../core/services/storage.service';
import { TenantService } from '../../../core/tenant/tenant.service';

export interface StorefrontSidebarItem {
  id: string;
  labelKey: string;
  /** Raw SVG markup rendered as the menu icon. */
  icon: string;
  route?: string;
  exact?: boolean;
  action?: 'logout';
  show?: boolean;
  children?: StorefrontSidebarItem[];
}

export interface StorefrontMenuConfig {
  primary: StorefrontSidebarItem[];
  footer: StorefrontSidebarItem[];
}

const STOREFRONT_MENU_URL = '/assets/json/storefront-menu.json';

@Component({
  selector: 'app-storefront-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, TranslatePipe],
  templateUrl: './storefront-sidebar.html',
  styleUrl: './storefront-sidebar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StorefrontSidebar implements OnInit {
  private readonly storage = inject(StorageService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly tenantService = inject(TenantService);
  private readonly destroyRef = inject(DestroyRef);

  readonly brand = input<string>('storefront.brand');
  readonly collapsed = model(false);

  readonly logout = output<void>();

  readonly primaryItems = signal<StorefrontSidebarItem[]>([]);
  readonly footerItems = signal<StorefrontSidebarItem[]>([]);
  readonly expandedIds = signal<ReadonlySet<string>>(new Set());

  readonly tenantSlug = computed(
    () =>
      this.tenantService.tenant()?.slug ??
      this.route.snapshot.paramMap.get('tenantSlug') ??
      this.findTenantSlug(this.route) ??
      '',
  );

  readonly brandLabel = computed(() => this.tenantService.tenant()?.name || '');


  readonly toggleLabelKey = computed(() =>
    this.collapsed() ? 'storefront.expand_menu' : 'storefront.collapse_menu',
  );

  constructor() {
    const saved = this.storage.get<boolean>(APP_CONSTANTS.STOREFRONT.SIDEBAR_COLLAPSED);
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
      .get<StorefrontMenuConfig>(STOREFRONT_MENU_URL, {
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
    this.storage.set(APP_CONSTANTS.STOREFRONT.SIDEBAR_COLLAPSED, next);
  }

  hasChildren(item: StorefrontSidebarItem): boolean {
    return (item.children?.length ?? 0) > 0;
  }

  isExpanded(id: string): boolean {
    return this.expandedIds().has(id);
  }

  toggleGroup(item: StorefrontSidebarItem, event?: Event): void {
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

  resolveRoute(route?: string): string | undefined {
    if (!route) {
      return undefined;
    }
    const slug = this.tenantSlug();
    return route.replaceAll(':tenantSlug', slug);
  }

  isGroupActive(item: StorefrontSidebarItem): boolean {
    const resolved = this.resolveRoute(item.route);
    if (resolved && this.isRouteActive(resolved, item.exact)) {
      return true;
    }
    return (item.children ?? []).some(
      (child) =>
        (!!child.route && this.isRouteActive(this.resolveRoute(child.route)!, child.exact)) ||
        this.isGroupActive(child),
    );
  }

  onItemClick(item: StorefrontSidebarItem, event: Event): void {
    if (item.action === 'logout') {
      event.preventDefault();
      this.logout.emit();
    }
  }

  iconSvg(icon: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(icon ?? '');
  }

  private visibleItems(items: StorefrontSidebarItem[] | undefined): StorefrontSidebarItem[] {
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

  private findTenantSlug(route: ActivatedRoute): string | null {
    let current: ActivatedRoute | null = route;
    while (current) {
      const slug = current.snapshot.paramMap.get('tenantSlug');
      if (slug) {
        return slug;
      }
      current = current.parent;
    }
    return null;
  }
}
