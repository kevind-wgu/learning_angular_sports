import { createAction, createReducer, on, props } from "@ngrx/store";
import { AuthData, authFromStorageString } from "../models";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { DatastoreService } from "../datastore.service";
import { of, switchMap, tap } from "rxjs";
import { AuthService } from "../auth/auth.service";

export interface State {
  auth: AuthData | null,
}

const INITIAL_STATE : State = {
  auth: null,
};

export const login = createAction('[Auth] Login', props<{auth: AuthData, fromLocal: boolean}>());
export const autoLogin = createAction('[Auth] AutoLogin');


export const authReducer = createReducer(
  INITIAL_STATE,
  on(login, (state, action) => {
    return {...state, auth: action.auth};
  }),
);


@Injectable(
)
export class AuthEffects {
  constructor(
    private actions$: Actions, 
    private authService: AuthService,
  ) {}

  autoLogin = createEffect(
    () => this.actions$.pipe(
      ofType(autoLogin),
      switchMap(() => {
        const localAuthStr = localStorage.getItem('auth');
        if (localAuthStr) {
          const auth = authFromStorageString(localAuthStr);

          if (auth && auth.isValid()) {
            return of(login({auth: auth, fromLocal: true}));
          }
          else if (auth && auth.getRefreshToken()) {
            this.authService.refresh(auth);
            return of();
          }
        }
        return of();
      }),
    ),
  );

  storeSports = createEffect(
    () => this.actions$.pipe(
      ofType(login),
      tap((action) => {
        if (!action.fromLocal && action.auth?.isValid()) {
          console.log("store Local Auth", action.auth);
          localStorage.setItem('auth', action.auth.toStorageString());
        }
      })
    ),
    {dispatch: false}
  );
}
