import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TranslateLoader, TranslationObject } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { SKIP_LOADING_HEADER } from '../http/loading.interceptor';

@Injectable()
export class AppTranslateLoader implements TranslateLoader {
  private readonly http = inject(HttpClient);

  getTranslation(lang: string): Observable<TranslationObject> {
    return this.http.get<TranslationObject>(`/assets/i18n/${lang}.json`, {
      headers: new HttpHeaders({ [SKIP_LOADING_HEADER]: '1' }),
    });
  }
}
