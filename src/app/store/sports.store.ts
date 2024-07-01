import { Store, createAction, createReducer, on, props } from "@ngrx/store";
import { Sport } from "../models";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { map, of, switchMap, tap, withLatestFrom } from "rxjs";
import { DatastoreService } from "../datastore.service";
import * as AuthStore from "./auth.store";
import { AppState } from "./app.store";
import { Router } from "@angular/router";

export interface State {
  sports: Sport[],
  currentSport: Sport | null,
}

const INITIAL_STATE : State = {
  sports: [],
  currentSport: null,
};

export const setSports = createAction('[Sports] Set Sports', 
  props<{sports: Sport[], loadedFromLocal: boolean}>()
);

export const setCurrentSport = createAction('[Sports] Set Current', 
  props<{sport: Sport | null}>()
);

export const addSport = createAction('[Sports] Add Sport', 
  props<{sport: Sport}>()
);

export const sportReducer = createReducer(
  INITIAL_STATE,
  on(setSports, (state, action) => {
    var sports = [...action.sports].sort((s1, s2) => s1.name.localeCompare(s2.name));
    return {...state, sports: sports};
  }),
  on(setCurrentSport, (state, action) => {
    return {...state, currentSport: (action.sport? action.sport : null)};
  }),
  on(addSport, (state, action) => {
    var sports = ([...state.sports, action.sport] as Sport[]).sort((s1, s2) => s1.name.localeCompare(s2.name));
    return {...state, sports: sports};
  }),
);

@Injectable(
)
export class SportsEffects {
  constructor(
    private actions$: Actions, 
    private datastore: DatastoreService,
    private store: Store<AppState>,
    private router: Router,
  ) {}

  loadSportsOnLogin = createEffect(
    () => this.actions$.pipe(
      ofType(AuthStore.login),
      switchMap(() => {
        // console.log("Load Sports Effect: Firebase");
        return this.datastore.getSports().pipe(
          map(sports => {
            return {sports: sports, loadedFromLocal: false}
          })
        );
      }),
      map((sports) => {
        return setSports(sports);
      }),
    )
  );

  initialLoadCurrentSport = createEffect(
    () => this.actions$.pipe(
      ofType(setSports),
      withLatestFrom(this.store.select('sports')),
      switchMap(([action, state]) => {
        if (!state.currentSport) {
          const currentSportJson = localStorage.getItem('currentSport');
          var sport = null;
          if (currentSportJson) {
            sport = JSON.parse(currentSportJson);
            // console.log("Load Current Sport Effect: Local", sport);
          }
          return of(sport);
        }
        return of();
      }),
      map((sport) => {
        return setCurrentSport({sport: sport});
      }),
    )
  );

  storeSports = createEffect(
    () => this.actions$.pipe(
      ofType(setSports),
      tap((action) => {
        if (!action.loadedFromLocal) {
          // console.log("store Sports Effect", action.sports);
          localStorage.setItem('sports', JSON.stringify(action.sports));
        }
      })
    ),
    {dispatch: false}
  )

  storeCurrentSport = createEffect(
    () => this.actions$.pipe(
      ofType(setCurrentSport),
      tap((action) => {
        // console.log("store Current Sports Effect", action.sport);
        localStorage.setItem('currentSport', JSON.stringify(action.sport));
      })
    ),
    {dispatch: false}
  )
  
  redirectAfterSetCurrentSport = createEffect(
    () => this.actions$.pipe(
      ofType(setCurrentSport),
      tap((action) => {
        this.router.navigate(['/scores']);
      })
    ),
    {dispatch: false}
  )

  addSport = createEffect(
    () => this.actions$.pipe(
      ofType(addSport),
      tap((action) => {
        this.datastore.updateSport(action.sport);
      }),
    ),
    {dispatch: false}
  );
}