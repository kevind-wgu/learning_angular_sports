import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.store';
import { Observable, map, of, switchMap, take } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuardClass {
  constructor(private store: Store<AppState>, private router: Router, private authService: AuthService){}

  canActivate(): Observable<boolean | UrlTree> {
    return this.store.select('auth').pipe(
        take(1),
        switchMap(authStore => {
          // console.log("AuthGuard A", authStore.auth?.isValid(), authStore)
          if (authStore.auth?.isValid()) {
            // console.log("AuthGuard B", authStore)
            return of(true);
          }
          if (authStore.auth?.getRefreshToken()) {
            // console.log("AuthGuard C", authStore)
            return this.authService.refresh(authStore.auth);
          }
          // console.log("AuthGuard D", authStore)
          return of(false);
        }),
        map(sucess => {
          if (!sucess) {
            return this.router.createUrlTree(['/login']);
          }
          return true;
        })
      );
  }
};

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean | UrlTree> => {
  return inject(AuthGuardClass).canActivate();
};