import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

const ABSOLUTE_URL = /^https?:\/\//i;
const ASSET_URL = /^\/?assets\//i;

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  if (ABSOLUTE_URL.test(req.url) || ASSET_URL.test(req.url)) {
    return next(req);
  }

  const baseUrl = environment.apiUrl.replace(/\/$/, '');
  const path = req.url.replace(/^\//, '');

  return next(
    req.clone({
      url: `${baseUrl}/${path}`,
    }),
  );
};
