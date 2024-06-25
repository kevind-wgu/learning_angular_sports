import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { StoreModule } from '@ngrx/store';
import { appReducer } from './store/app.store';
import { EffectsModule } from '@ngrx/effects';
import { SportsEffects } from './store/sports.store';
import { provideHttpClient } from '@angular/common/http';
import { SportGuardClass } from './sports/sports.guard';
import { TeamEffects } from './store/teams.store';
import { SeasonEffects } from './store/season.store';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    SportGuardClass,
    importProvidersFrom(
      StoreModule.forRoot(appReducer, {}),
      EffectsModule.forRoot(SportsEffects, TeamEffects, SeasonEffects),
    ),
  ]
};
