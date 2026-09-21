import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { AuthService } from '../../../core/auth/auth.service';
import { User } from '../../../core/auth/auth.model';
import { TranslationService } from '../../../core/services/translation.service';
import {
  provideSharedTestTranslate,
  seedSharedTestTranslate,
} from '../../../shared/testing/provide-shared-translate';
import { AdminHeader } from './admin-header';

describe('AdminHeader', () => {
  let fixture: ComponentFixture<AdminHeader>;
  const user = signal<User | null>({
    id: '1',
    username: 'admin',
    displayName: 'Admin User',
    roles: [],
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminHeader],
      providers: [
        provideSharedTestTranslate(),
        {
          provide: AuthService,
          useValue: { user: user.asReadonly() },
        },
        {
          provide: TranslationService,
          useValue: {
            languages: ['eng', 'myan'] as const,
            currentLang: signal('eng'),
            use: vi.fn(() => of({})),
          },
        },
      ],
    }).compileComponents();

    const translate = TestBed.inject(TranslateService);
    seedSharedTestTranslate(translate);
    translate.setTranslation(
      'eng',
      {
        admin: { notifications: 'Notifications' },
        language: { eng: 'English', myan: 'Myanmar', toggle: 'Language' },
      },
      true,
    );

    fixture = TestBed.createComponent(AdminHeader);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show app name and user name', () => {
    expect(fixture.nativeElement.querySelector('.app-name')?.textContent).toContain(
      'Multi-Tenant E-Commerce',
    );
    expect(fixture.nativeElement.querySelector('.user-name')?.textContent).toContain('Admin User');
  });

  it('should emit notification click', () => {
    const emit = vi.fn();
    fixture.componentInstance.notificationClick.subscribe(emit);
    (fixture.nativeElement.querySelector('.icon-btn') as HTMLButtonElement).click();
    expect(emit).toHaveBeenCalled();
  });
});
