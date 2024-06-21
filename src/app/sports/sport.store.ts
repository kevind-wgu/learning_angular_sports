import { Store, createAction, createReducer, on, props } from "@ngrx/store";
import { Sport, SportType } from "../models";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { AppState } from "../store/app.store";
import { Router } from "@angular/router";
import { Observable, map, switchMap, tap, withLatestFrom } from "rxjs";
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
  props<{sports: Sport[]}>()
);

export const setCurrentSport = createAction('[Sports] Set Current', 
  props<{sport: Sport}>()
);

export const sportReducer = createReducer(
  INITIAL_STATE,
  on(setSports, (state, action) => {
    return {...state, sports: action.sports};
  }),
  on(setCurrentSport, (state, action) => {
    console.log("Current Sport", action.sport);
    return {...state, currentSport: action.sport};
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

  loadSports = createEffect(
    () => this.actions$.pipe(
      ofType(initialLoadSports),
      switchMap(() => {
        console.log("Load Sports Effect");
        return this.http.get<{[key: string]: Sport}>(URL + '/sports.json').pipe(
          map(sportObj => {
            return Object.keys(sportObj).map(key => {
              return {...sportObj[key], id: key} as Sport;
            })
          })
        )
      }),
      map((sports) => {
        return setSports({sports: sports});
      }),
    )
  );
}