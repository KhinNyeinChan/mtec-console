import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import {
  provideSharedTestTranslate,
  seedSharedTestTranslate,
} from '../../testing/provide-shared-translate';
import { EmptyState } from './empty-state';

describe('EmptyState', () => {
  let fixture: ComponentFixture<EmptyState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyState],
      providers: [provideSharedTestTranslate()],
    }).compileComponents();

    seedSharedTestTranslate(TestBed.inject(TranslateService));
    fixture = TestBed.createComponent(EmptyState);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render default title and illustration', () => {
    const title = fixture.nativeElement.querySelector('.title') as HTMLElement;
    const svg = fixture.nativeElement.querySelector('svg');

    expect(title.textContent).toBe('No records found');
    expect(svg).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.description')).toBeNull();
  });

  it('should render custom title and description', () => {
    fixture.componentRef.setInput('title', 'No orders yet');
    fixture.componentRef.setInput('description', 'Orders will appear here.');
    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector('.title') as HTMLElement;
    const description = fixture.nativeElement.querySelector('.description') as HTMLElement;

    expect(title.textContent).toBe('No orders yet');
    expect(description.textContent).toBe('Orders will appear here.');
  });
});
