import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './http.interceptor';

export const appConfig: ApplicationConfig = {
  /* *********************************NOTE*********************************/
  /* Because we are bulding this moduleless, we need to add our providers */
  /* to the appConfig object.                                             */
  /* *********************************NOTE*********************************/
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideHttpClient(
    withInterceptors([authInterceptor]),
  )],
};
