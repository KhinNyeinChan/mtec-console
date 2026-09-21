import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import {
  provideSharedTestTranslate,
  seedSharedTestTranslate,
} from '../../testing/provide-shared-translate';
import { Pagination } from './pagination';

describe('Pagination', () => {
  let fixture: ComponentFixture<Pagination>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pagination],
      providers: [provideSharedTestTranslate()],
    }).compileComponents();

    seedSharedTestTranslate(TestBed.inject(TranslateService));
    fixture = TestBed.createComponent(Pagination);
    fixture.componentRef.setInput('totalItems', 300);
    fixture.componentRef.setInput('pageSize', 10);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the start window, ellipsis, and last page', () => {
    const pages = Array.from(
      fixture.nativeElement.querySelectorAll('.page-btn') as NodeListOf<HTMLButtonElement>,
    ).map((button) => button.textContent?.trim());

    expect(pages).toEqual(['1', '2', '3', '4', '5', '30']);
    expect(fixture.nativeElement.querySelector('.ellipsis')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.page-btn.active')?.textContent?.trim()).toBe('1');
  });

  it('should go to the next page', () => {
    const next = fixture.nativeElement.querySelector(
      '[aria-label="Next page"]',
    ) as HTMLButtonElement;
    next.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.page()).toBe(2);
    expect(fixture.nativeElement.querySelector('.page-btn.active')?.textContent?.trim()).toBe('2');
  });

  it('should reset to the first page when page size changes', () => {
    fixture.componentInstance.page.set(4);
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector('.page-size-trigger') as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();

    const option = Array.from(
      fixture.nativeElement.querySelectorAll('.page-size-option') as NodeListOf<HTMLElement>,
    ).find((item) => item.textContent?.includes('20'));
    option?.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.pageSize()).toBe(20);
    expect(fixture.componentInstance.page()).toBe(1);
  });
});
