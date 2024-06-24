import { Store, createAction, createReducer, on, props } from "@ngrx/store";
import { Sport, SportType } from "../models";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { AppState } from "../store/app.store";
import { Router } from "@angular/router";
import { Observable, map, of, switchMap, tap, withLatestFrom } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";

const URL = environment.firebaseUrl;

export interface State {
  sports: Sport[],
  currentSport: Sport | null,
}

const INITIAL_STATE : State = {
  sports: [],
  currentSport: null,
};

export const initialLoadSports = createAction('[Sports] Initial Load');
export const setSports = createAction('[Sports] Set Sports', 
  props<{sports: Sport[], loadedFromLocal: boolean}>()
);

export const setCurrentSport = createAction('[Sports] Set Current', 
  props<{sport: Sport | null}>()
);

export const sportReducer = createReducer(
  INITIAL_STATE,
  on(setSports, (state, action) => {
    return {...state, sports: action.sports};
  }),
  on(setCurrentSport, (state, action) => {
    console.log("Current Sport", action.sport);
    return {...state, currentSport: (action.sport? action.sport : null)};
  }),
);

@Injectable(
)
export class SportsEffects {
  constructor(
    private actions$: Actions, 
    private store: Store<AppState>, 
    private router: Router, 
    private http: HttpClient,
  ) {}

  initialLoadSports = createEffect(
    () => this.actions$.pipe(
      ofType(initialLoadSports),
      switchMap(() => {
        const sportsJsonStr = localStorage.getItem('sports');
        if (sportsJsonStr) {
          console.log("Load Sports Effect: Local");
          const sports: Sport[] = JSON.parse(sportsJsonStr);
          return of({sports: sports, loadedFromLocal: true});
        }
        console.log("Load Sports Effect: Firebase");
        return this.http.get<{[key: string]: Sport}>(URL + '/sports.json').pipe(
          map(sportObj => {
            const sports: Sport[] = Object.keys(sportObj).map(key => {
              return {...sportObj[key], id: key} as Sport;
            });
            return {sports: sports, loadedFromLocal: false}
          })
        )
      }),
      map((sports) => {
        return setSports(sports);
      }),
    )
  );

  initialLoadCurrentSport = createEffect(
    () => this.actions$.pipe(
      ofType(initialLoadSports),
      switchMap(() => {
        const currentSportJson = localStorage.getItem('currentSport');
        var sport = null;
        if (currentSportJson) {
          sport = JSON.parse(currentSportJson);
          console.log("Load Current Sport Effect: Local", sport);
        }
        return of(sport);
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
          console.log("store Sports Effect", action.sports);
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
        console.log("store Current Sports Effect", action.sport);
        localStorage.setItem('currentSport', JSON.stringify(action.sport));
      })
    ),
    {dispatch: false}
  )
}