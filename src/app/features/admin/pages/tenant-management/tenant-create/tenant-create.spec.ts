import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import {
  provideSharedTestTranslate,
  seedSharedTestTranslate,
} from '../../../../../shared/testing/provide-shared-translate';
import { TenantCreatePage } from './tenant-create';

describe('TenantCreatePage', () => {
  let fixture: ComponentFixture<TenantCreatePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TenantCreatePage],
      providers: [provideSharedTestTranslate()],
    }).compileComponents();

    seedSharedTestTranslate(TestBed.inject(TranslateService));
    fixture = TestBed.createComponent(TenantCreatePage);
    fixture.detectChanges();
  });

  it('should show the title, actions, and form', () => {
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('New Tenant');
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
    page.form.controls.businessName.setValue('Khin Fashion');
    page.form.controls.adminName.setValue('Khin Nyein');
    page.form.controls.adminId.setValue('khin');
    page.form.controls.email.setValue('khin@khin-fashion.mtec.com');
    page.form.controls.phone.setValue('0911111111');
    page.form.controls.password.setValue('secret1');
    page.form.controls.confirmPassword.setValue('secret1');

    page.onSave();
    fixture.detectChanges();
    expect(page.saved()).toBe(true);
    expect(fixture.nativeElement.querySelector('.form-saved').textContent).toContain('Tenant saved');

    page.onNew();
    fixture.detectChanges();
    expect(page.form.controls.businessName.value).toBe('');
    expect(page.saved()).toBe(false);
  });
});
