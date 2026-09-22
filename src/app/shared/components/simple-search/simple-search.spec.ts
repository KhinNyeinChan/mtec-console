import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import {
  provideSharedTestTranslate,
  seedSharedTestTranslate,
} from '../../testing/provide-shared-translate';
import { SimpleSearch } from './simple-search';

describe('SimpleSearch', () => {
  let fixture: ComponentFixture<SimpleSearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimpleSearch],
      providers: [provideSharedTestTranslate()],
    }).compileComponents();

    seedSharedTestTranslate(TestBed.inject(TranslateService));
    fixture = TestBed.createComponent(SimpleSearch);
    fixture.detectChanges();
  });

  it('should search when the icon is clicked or enter is pressed', () => {
    const emitted: string[] = [];
    fixture.componentInstance.search.subscribe((value) => emitted.push(value));

    const input = fixture.nativeElement.querySelector('#isInputSearch') as HTMLInputElement;
    input.value = 'khin';
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));
    fixture.detectChanges();

    (fixture.nativeElement.querySelector('#btnSearch') as HTMLButtonElement).click();

    expect(emitted).toEqual(['khin', 'khin']);
  });

  it('should show the advanced and new actions when enabled', () => {
    expect(fixture.nativeElement.querySelector('#btnToggleSearch')).toBeNull();
    expect(fixture.nativeElement.querySelector('app-button')).toBeNull();

    fixture.componentRef.setInput('showAdvanced', true);
    fixture.componentRef.setInput('showNew', true);
    fixture.detectChanges();

    const advanced: boolean[] = [];
    const created: number[] = [];
    fixture.componentInstance.advancedToggle.subscribe(() => advanced.push(true));
    fixture.componentInstance.create.subscribe(() => created.push(1));

    (fixture.nativeElement.querySelector('#btnToggleSearch') as HTMLButtonElement).click();
    (fixture.nativeElement.querySelector('app-button') as HTMLElement).click();

    expect(advanced.length).toBe(1);
    expect(created.length).toBe(1);
    expect(fixture.nativeElement.querySelector('app-button').textContent).toContain('New');
  });
});
