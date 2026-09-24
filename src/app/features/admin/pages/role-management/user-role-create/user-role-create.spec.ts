import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import {
  provideSharedTestTranslate,
  seedSharedTestTranslate,
} from '../../../../../shared/testing/provide-shared-translate';
import { UserRoleCreatePage } from './user-role-create';

describe('UserRoleCreatePage', () => {
  let fixture: ComponentFixture<UserRoleCreatePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserRoleCreatePage],
      providers: [provideSharedTestTranslate()],
    }).compileComponents();

    seedSharedTestTranslate(TestBed.inject(TranslateService));
    fixture = TestBed.createComponent(UserRoleCreatePage);
    fixture.detectChanges();
  });

  it('should show the title, actions, and form', () => {
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('New User Role');
    expect(text).toContain('New');
    expect(text).toContain('Save');
    expect(text).toContain('Delete');
    expect(fixture.nativeElement.querySelectorAll('input').length).toBeGreaterThan(0);
  });

  it('should keep save blocked until the form is valid', () => {
    fixture.componentInstance.onSave();
    fixture.detectChanges();
    expect(fixture.componentInstance.saved()).toBe(false);
    expect(fixture.nativeElement.querySelector('.form-saved')).toBeNull();
  });

  it('should save a completed form and clear it from New', () => {
    const page = fixture.componentInstance;
    page.form.controls.roleName.setValue('Store Admin');

    page.onSave();
    fixture.detectChanges();
    expect(page.saved()).toBe(true);
    expect(fixture.nativeElement.querySelector('.form-saved').textContent).toContain(
      'User role saved',
    );

    page.onNew();
    fixture.detectChanges();
    expect(page.form.controls.roleName.value).toBe('');
    expect(page.form.controls.status.value).toBe('active');
    expect(page.saved()).toBe(false);
  });
});
