import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree, CanActivateFn } from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { Store } from '@ngrx/store';

import { AppState } from '../store/app.store';

@Injectable()
export class SportGuardClass {
  constructor(private store: Store<AppState>, private router: Router){}

  canActivate(): Observable<boolean | UrlTree> {
    return this.store.select('sports').pipe(
        take(1),
        map(sports => {
          // console.log("SportGuard A", sports)
          if (!sports.currentSport) {
            // console.log("SportGuard B.1", sports)
            return this.router.createUrlTree(['/sports']);
          }
          // console.log("SportGuard C", sports)
          return true;
        }),
      );
  }
};

export const SportGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean | UrlTree> => {
  return inject(SportGuardClass).canActivate();
};
  