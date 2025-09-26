import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideAnimations } from '@angular/platform-browser/animations';
import { providePrimeNG } from 'primeng/config'
import Aura from '@primeng/themes/aura'
import CustomStyle from '../../custom-styles';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideAnimations(),
    providePrimeNG({
      theme: {
        preset: CustomStyle,
        options: {
          darkModeSelector: false || 'none'
        }
      }
    })
  ]
};
