import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import {
  provideSharedTestTranslate,
  seedSharedTestTranslate,
} from '../../testing/provide-shared-translate';
import { DropdownSelect } from './dropdown-select';

describe('DropdownSelect', () => {
  let fixture: ComponentFixture<DropdownSelect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropdownSelect],
      providers: [provideSharedTestTranslate()],
    }).compileComponents();

    seedSharedTestTranslate(TestBed.inject(TranslateService));
    fixture = TestBed.createComponent(DropdownSelect);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render label and hide search for five or fewer options', () => {
    fixture.componentRef.setInput('label', 'City');
    fixture.componentRef.setInput('options', ['Yangon', 'Mandalay', 'Naypyidaw', 'Bago', 'Taunggyi']);
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('.control') as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('label')?.textContent).toContain('City');
    expect(fixture.nativeElement.querySelector('.search')).toBeNull();
    expect(fixture.nativeElement.querySelectorAll('.option').length).toBe(5);
  });

  it('should show a search box when there are more than five options', () => {
    fixture.componentRef.setInput('options', ['A', 'B', 'C', 'D', 'E', 'F']);
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('.control') as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.search input')).toBeTruthy();
  });

  it('should filter options and select a value', () => {
    fixture.componentRef.setInput('options', [
      'Yangon',
      'Mandalay',
      'Naypyidaw',
      'Bago',
      'Taunggyi',
      'Mawlamyine',
    ]);
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('.control') as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();

    const search = fixture.nativeElement.querySelector('.search input') as HTMLInputElement;
    search.value = 'man';
    search.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const options = fixture.nativeElement.querySelectorAll('.option') as NodeListOf<HTMLElement>;
    expect(options.length).toBe(1);
    expect(options[0].textContent?.trim()).toBe('Mandalay');

    options[0].click();
    fixture.detectChanges();

    expect(fixture.componentInstance.value()).toBe('Mandalay');
    expect(fixture.nativeElement.querySelector('.menu')).toBeNull();
  });
});
