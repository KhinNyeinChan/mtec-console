import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  provideSharedTestTranslate,
  seedSharedTestTranslate,
} from '../../../shared/testing/provide-shared-translate';
import { AdminMenuConfig, AdminSidebar } from './admin-sidebar';

const ADMIN_I18N = {
  admin: {
    brand: 'MTEC',
    collapse_menu: 'Collapse menu',
    expand_menu: 'Expand menu',
    home: 'Home',
    dashboard: 'Dashboard',
    products: 'Products',
    messages: 'Messages',
    orders: 'Order',
    calendar: 'Calendar',
    activity: 'Activity',
    statistics: 'Static',
    documents: 'Documents',
    chat: 'Chat',
    settings: 'Settings',
  },
  auth: { logout: 'Logout' },
};

const ICON = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/></svg>';

const MENU_FIXTURE: AdminMenuConfig = {
  primary: [
    { id: 'home', labelKey: 'admin.home', icon: ICON, route: '/admin', exact: true, show: true },
    {
      id: 'dashboard',
      labelKey: 'admin.dashboard',
      icon: ICON,
      route: '/admin/dashboard',
      show: true,
    },
    {
      id: 'products',
      labelKey: 'admin.products',
      icon: ICON,
      route: '/admin/products',
      show: true,
      children: [
        {
          id: 'products-list',
          labelKey: 'admin.products-list',
          icon: ICON,
          route: '/admin/products/list',
          show: true,
        },
      ],
    },
    {
      id: 'messages',
      labelKey: 'admin.messages',
      icon: ICON,
      route: '/admin/messages',
      show: false,
    },
    { id: 'orders', labelKey: 'admin.orders', icon: ICON, route: '/admin/orders', show: true },
  ],
  footer: [
    { id: 'chat', labelKey: 'admin.chat', icon: ICON, route: '/admin/chat', show: false },
    {
      id: 'settings',
      labelKey: 'admin.settings',
      icon: ICON,
      route: '/admin/settings',
      show: false,
    },
    { id: 'logout', labelKey: 'auth.logout', icon: ICON, action: 'logout', show: true },
  ],
};

describe('AdminSidebar', () => {
  let fixture: ComponentFixture<AdminSidebar>;
  let http: HttpTestingController;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [AdminSidebar],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideSharedTestTranslate(),
      ],
    }).compileComponents();

    const translate = TestBed.inject(TranslateService);
    seedSharedTestTranslate(translate);
    translate.setTranslation('eng', ADMIN_I18N, true);

    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(AdminSidebar);
    fixture.detectChanges();

    http.expectOne('/assets/json/admin-menu.json').flush(MENU_FIXTURE);
    fixture.detectChanges();
  });

  afterEach(() => {
    http.verify();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render brand and visible primary links when expanded', () => {
    expect(fixture.nativeElement.querySelector('.brand-name')?.textContent).toContain('MTEC');
    expect(fixture.nativeElement.querySelectorAll('.nav-primary > .nav-item, .nav-primary > .nav-group').length).toBe(4);
    expect(fixture.nativeElement.querySelector('.sidebar').classList.contains('collapsed')).toBe(
      false,
    );
  });

  it('should expand submenu children', () => {
    const parent = fixture.nativeElement.querySelector(
      '.nav-item--parent',
    ) as HTMLButtonElement;
    expect(fixture.nativeElement.querySelector('.nav-children')).toBeNull();

    parent.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('.nav-children .nav-item--child').length).toBe(1);
  });

  it('should collapse and expand', () => {
    const toggle = fixture.nativeElement.querySelector('.toggle-btn') as HTMLButtonElement;
    toggle.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.collapsed()).toBe(true);
    expect(fixture.nativeElement.querySelector('.sidebar').classList.contains('collapsed')).toBe(
      true,
    );
    expect(fixture.nativeElement.querySelector('.brand-name')).toBeNull();

    toggle.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.collapsed()).toBe(false);
  });

  it('should emit logout', () => {
    const logout = vi.fn();
    fixture.componentInstance.logout.subscribe(logout);

    const button = Array.from(
      fixture.nativeElement.querySelectorAll('.nav-footer .nav-item') as NodeListOf<HTMLElement>,
    ).find((item) => item.textContent?.includes('Logout')) as HTMLButtonElement;

    button.click();
    expect(logout).toHaveBeenCalled();
  });
});
