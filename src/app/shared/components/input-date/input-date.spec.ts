import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import {
  provideSharedTestTranslate,
  seedSharedTestTranslate,
} from '../../testing/provide-shared-translate';
import { InputDate } from './input-date';

describe('InputDate', () => {
  let fixture: ComponentFixture<InputDate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputDate],
      providers: [provideSharedTestTranslate()],
    }).compileComponents();

    seedSharedTestTranslate(TestBed.inject(TranslateService));
    fixture = TestBed.createComponent(InputDate);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render label and helper text', () => {
    fixture.componentRef.setInput('label', 'Date');
    fixture.componentRef.setInput('helperText', 'Helper text');
    fixture.componentRef.setInput('required', true);
    fixture.detectChanges();

    const label = fixture.nativeElement.querySelector('label') as HTMLLabelElement;
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    const hint = fixture.nativeElement.querySelector('.hint') as HTMLElement;

    expect(label.textContent).toContain('Date');
    expect(label.textContent).toContain('*');
    expect(input.type).toBe('date');
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
    input.value = '2026-09-21';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(fixture.componentInstance.value()).toBe('2026-09-21');
  });
});
