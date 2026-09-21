import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import {
  provideSharedTestTranslate,
  seedSharedTestTranslate,
} from '../../testing/provide-shared-translate';
import { Loading } from './loading';

describe('Loading', () => {
  let fixture: ComponentFixture<Loading>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Loading],
      providers: [provideSharedTestTranslate()],
    }).compileComponents();

    seedSharedTestTranslate(TestBed.inject(TranslateService));
    fixture = TestBed.createComponent(Loading);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render six animated bars and default label', () => {
    const bars = fixture.nativeElement.querySelectorAll('.bar');
    const label = fixture.nativeElement.querySelector('.label') as HTMLElement;

    expect(bars.length).toBe(6);
    expect(label.textContent).toBe('Loading');
  });

  it('should render a custom label', () => {
    fixture.componentRef.setInput('label', 'Please wait');
    fixture.detectChanges();

    const label = fixture.nativeElement.querySelector('.label') as HTMLElement;
    expect(label.textContent).toBe('Please wait');
  });
});
