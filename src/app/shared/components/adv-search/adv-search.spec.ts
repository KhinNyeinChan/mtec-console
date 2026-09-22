import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import {
  provideSharedTestTranslate,
  seedSharedTestTranslate,
} from '../../testing/provide-shared-translate';
import { AdvSearch } from './adv-search';
import { AdvSearchField, AdvSearchRow } from './adv-search.model';

const fields: AdvSearchField[] = [
  { itemid: 'name', caption: 'Name', datatype: 'string' },
  { itemid: 'price', caption: 'Price', datatype: 'numeric' },
  { itemid: 'created', caption: 'Created', datatype: 'date' },
  { itemid: 'keyword', caption: 'Keyword', datatype: 'simplesearch' },
  { itemid: 'status', caption: 'Status', datatype: 'status' },
];

describe('AdvSearch', () => {
  let fixture: ComponentFixture<AdvSearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvSearch],
      providers: [provideSharedTestTranslate()],
    }).compileComponents();

    seedSharedTestTranslate(TestBed.inject(TranslateService));
    fixture = TestBed.createComponent(AdvSearch);
    fixture.componentRef.setInput('fields', fields);
    fixture.componentRef.setInput('typeLists', {
      status: [
        { value: 'open', caption: 'Open' },
        { value: 'closed', caption: 'Closed' },
      ],
    });
    fixture.detectChanges();
  });

  it('should create one string filter row', () => {
    const row = fixture.nativeElement.querySelector('.filter-row') as HTMLElement;
    expect(row).toBeTruthy();
    expect(row.querySelector('.condition-select')).toBeTruthy();
    expect(row.querySelector('input[type="text"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelectorAll('.add-btn').length).toBe(1);
  });

  it('should show two numeric inputs when the condition is between', () => {
    selectField('Price');
    choose('.condition-select', 'Between');

    expect(fixture.nativeElement.querySelectorAll('input[type="number"]').length).toBe(2);
    expect(fixture.componentInstance.rows()[0].t3).toBe('true');
  });

  it('should show a text box for simple search and a list for lov types', () => {
    selectField('Keyword');
    expect(fixture.nativeElement.querySelector('.condition-select')).toBeNull();
    expect(fixture.nativeElement.querySelector('input[type="text"]')).toBeTruthy();

    selectField('Status');
    const lov = fixture.nativeElement.querySelector('.lov-select') as HTMLElement;
    expect(lov).toBeTruthy();
    openMenu(lov);
    expect(lov.querySelectorAll('.option').length).toBe(2);
    expect(fixture.nativeElement.querySelector('.condition-select')).toBeNull();
  });

  it('should add a row and keep the add button on the last row', () => {
    click('.add-btn');
    expect(fixture.nativeElement.querySelectorAll('.filter-row').length).toBe(2);
    expect(fixture.nativeElement.querySelectorAll('.add-btn').length).toBe(1);
  });

  it('should emit the current rows when filter is clicked', () => {
    const emitted: AdvSearchRow[][] = [];
    fixture.componentInstance.search.subscribe((rows) => emitted.push(rows));

    const input = fixture.nativeElement.querySelector('input[type="text"]') as HTMLInputElement;
    input.value = 'shirt';
    input.dispatchEvent(new Event('input'));
    click('.filter-btn');

    expect(emitted.length).toBe(1);
    expect(emitted[0][0].t1).toBe('shirt');
    expect(emitted[0][0].itemid).toBe('name');
  });

  function selectField(caption: string): void {
    choose('.field-select', caption);
  }

  function choose(selector: string, label: string): void {
    const dropdown = fixture.nativeElement.querySelector(selector) as HTMLElement;
    openMenu(dropdown);
    const options = [...dropdown.querySelectorAll('.option')] as HTMLElement[];
    const match = options.find((option) => option.textContent?.trim() === label);
    match?.click();
    fixture.detectChanges();
  }

  function openMenu(dropdown: HTMLElement): void {
    const trigger = dropdown.querySelector('.control') as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();
  }

  function click(selector: string): void {
    const button = fixture.nativeElement.querySelector(selector) as HTMLButtonElement;
    button.click();
    fixture.detectChanges();
  }
});
