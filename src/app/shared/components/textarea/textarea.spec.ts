import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import {
  provideSharedTestTranslate,
  seedSharedTestTranslate,
} from '../../testing/provide-shared-translate';
import { Textarea } from './textarea';

describe('Textarea', () => {
  let fixture: ComponentFixture<Textarea>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Textarea],
      providers: [provideSharedTestTranslate()],
    }).compileComponents();

    seedSharedTestTranslate(TestBed.inject(TranslateService));
    fixture = TestBed.createComponent(Textarea);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render label, placeholder, and helper text', () => {
    fixture.componentRef.setInput('label', 'Notes');
    fixture.componentRef.setInput('placeholder', 'Placeholder');
    fixture.componentRef.setInput('helperText', 'Helper text');
    fixture.componentRef.setInput('required', true);
    fixture.detectChanges();

    const label = fixture.nativeElement.querySelector('label') as HTMLLabelElement;
    const textarea = fixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement;
    const hint = fixture.nativeElement.querySelector('.hint') as HTMLElement;

    expect(label.textContent).toContain('Notes');
    expect(label.textContent).toContain('*');
    expect(textarea.placeholder).toBe('Placeholder');
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
    const textarea = fixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement;
    textarea.value = 'hello';
    textarea.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(fixture.componentInstance.value()).toBe('hello');
  });
});
