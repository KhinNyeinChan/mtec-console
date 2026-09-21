import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import {
  provideSharedTestTranslate,
  seedSharedTestTranslate,
} from '../../testing/provide-shared-translate';
import { InputText } from './input-text';

describe('InputText', () => {
  let fixture: ComponentFixture<InputText>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputText],
      providers: [provideSharedTestTranslate()],
    }).compileComponents();

    seedSharedTestTranslate(TestBed.inject(TranslateService));
    fixture = TestBed.createComponent(InputText);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render label, placeholder, and helper text', () => {
    fixture.componentRef.setInput('label', 'Email');
    fixture.componentRef.setInput('placeholder', 'Placeholder');
    fixture.componentRef.setInput('helperText', 'Helper text');
    fixture.componentRef.setInput('required', true);
    fixture.detectChanges();

    const label = fixture.nativeElement.querySelector('label') as HTMLLabelElement;
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    const hint = fixture.nativeElement.querySelector('.hint') as HTMLElement;

    expect(label.textContent).toContain('Email');
    expect(label.textContent).toContain('*');
    expect(input.placeholder).toBe('Placeholder');
    expect(hint.textContent).toBe('Helper text');
    expect(fixture.nativeElement.querySelector('.field').classList.contains('field-error')).toBe(
      false,
    );
  });

  it('should show error state and hide helper text', () => {
    fixture.componentRef.setInput('helperText', 'Helper text');
    fixture.componentRef.setInput('error', 'Error text');
    fixture.detectChanges();

    const hint = fixture.nativeElement.querySelector('.hint') as HTMLElement;
    expect(hint.textContent).toBe('Error text');
    expect(hint.classList.contains('hint-error')).toBe(true);
    expect(fixture.nativeElement.querySelector('.field').classList.contains('field-error')).toBe(
      true,
    );
  });

  it('should update value from typing', () => {
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.value = 'hello';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(fixture.componentInstance.value()).toBe('hello');
  });
});
