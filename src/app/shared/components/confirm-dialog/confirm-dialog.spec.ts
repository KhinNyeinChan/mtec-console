import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import {
  provideSharedTestTranslate,
  seedSharedTestTranslate,
} from '../../testing/provide-shared-translate';
import { ConfirmDialog } from './confirm-dialog';

describe('ConfirmDialog', () => {
  let fixture: ComponentFixture<ConfirmDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDialog],
      providers: [provideSharedTestTranslate()],
    }).compileComponents();

    seedSharedTestTranslate(TestBed.inject(TranslateService));
    fixture = TestBed.createComponent(ConfirmDialog);
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render dynamic title, description, and button texts', () => {
    fixture.componentRef.setInput('title', 'Delete item?');
    fixture.componentRef.setInput('description', 'This cannot be undone.');
    fixture.componentRef.setInput('cancelText', 'Keep');
    fixture.componentRef.setInput('confirmText', 'Delete');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.title')?.textContent).toContain('Delete item?');
    expect(fixture.nativeElement.querySelector('.description')?.textContent).toContain(
      'This cannot be undone.',
    );

    const buttons = Array.from(
      fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>,
    ).map((button) => button.textContent?.trim());

    expect(buttons).toContain('Keep');
    expect(buttons).toContain('Delete');
  });

  it('should emit cancelled and close when Cancel is clicked', () => {
    const cancelled = vi.fn();
    fixture.componentInstance.cancelled.subscribe(cancelled);

    const cancel = Array.from(
      fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>,
    ).find((button) => button.textContent?.trim() === 'Cancel');
    cancel?.click();
    fixture.detectChanges();

    expect(cancelled).toHaveBeenCalled();
    expect(fixture.componentInstance.open()).toBe(false);
  });

  it('should emit confirmed and close when Confirm is clicked', () => {
    const confirmed = vi.fn();
    fixture.componentInstance.confirmed.subscribe(confirmed);

    const confirm = Array.from(
      fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>,
    ).find((button) => button.textContent?.trim() === 'Confirm');
    confirm?.click();
    fixture.detectChanges();

    expect(confirmed).toHaveBeenCalled();
    expect(fixture.componentInstance.open()).toBe(false);
  });
});
