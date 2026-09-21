import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import {
  provideSharedTestTranslate,
  seedSharedTestTranslate,
} from '../../testing/provide-shared-translate';
import { Button } from './button';

describe('Button', () => {
  let fixture: ComponentFixture<Button>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Button],
      providers: [provideSharedTestTranslate()],
    }).compileComponents();

    seedSharedTestTranslate(TestBed.inject(TranslateService));
    fixture = TestBed.createComponent(Button);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render dynamic text, variant, and disabled state', () => {
    fixture.componentRef.setInput('text', 'Cancel');
    fixture.componentRef.setInput('variant', 'secondary');
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(button.textContent?.trim()).toBe('Cancel');
    expect(button.className).toContain('btn-secondary');
    expect(button.disabled).toBe(true);
  });
});
