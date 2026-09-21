import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideTranslateLoader, provideTranslateService } from '@ngx-translate/core';
import { AppTranslateLoader } from '../i18n/app-translate.loader';
import { StorageService } from './storage.service';
import { TranslationService } from './translation.service';

describe('TranslationService', () => {
  let service: TranslationService;
  let http: HttpTestingController;
  let storage: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        ...provideTranslateService({
          fallbackLang: 'eng',
          lang: 'eng',
          loader: provideTranslateLoader(AppTranslateLoader),
        }),
        TranslationService,
      ],
    });

    service = TestBed.inject(TranslationService);
    http = TestBed.inject(HttpTestingController);
    storage = TestBed.inject(StorageService);
    storage.clear();
  });

  afterEach(() => {
    http.verify();
    storage.clear();
  });

  it('should load english translations on init', () => {
    let ready = false;
    service.init().subscribe(() => {
      ready = true;
    });

    const req = http.expectOne('/assets/i18n/eng.json');
    req.flush({
      COMMON: { SAVE: 'Save' },
    });

    expect(ready).toBe(true);
    expect(service.instant('COMMON.SAVE')).toBe('Save');
    expect(service.currentLang()).toBe('eng');
  });

  it('should switch language and persist preference', () => {
    service.use('myan').subscribe();

    const myanReq = http.expectOne('/assets/i18n/myan.json');
    myanReq.flush({
      COMMON: { SAVE: 'သိမ်းမည်' },
    });

    const fallbackReq = http.match('/assets/i18n/eng.json');
    fallbackReq.forEach((req) =>
      req.flush({
        COMMON: { SAVE: 'Save' },
      }),
    );

    expect(service.instant('COMMON.SAVE')).toBe('သိမ်းမည်');
    expect(service.currentLang()).toBe('myan');
    expect(storage.get('app_language')).toBe('myan');
  });
});
