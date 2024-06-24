import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store, createAction, createReducer, on, props } from "@ngrx/store";
import { HttpClient } from "@angular/common/http";

import { AppState } from "../store/app.store";
import { environment } from "../../environments/environment";
import { Team } from "../models";
import * as SportsStore from "../sports/sport.store";
import { map, of, switchMap, withLatestFrom } from "rxjs";

const URL = environment.firebaseUrl;

export interface State {
  teams: Team[],
}

const INITIAL_STATE : State = {
  teams: [
  {id: '1', name: 'Brigam Young University', abbr: 'BYU', offensiveRating: 10, defensiveRating: 20},
  ],
};

export const setTeams = createAction('[Teams] Set Teams', 
  props<{teams: Team[]}>()
);

export const teamReducer = createReducer(
  INITIAL_STATE,
  on(setTeams, (state, action) => {
    const newState = {...state, teams: action.teams};
    console.log("Set Teams", newState);
    return newState;
  }),
);

@Injectable()
export class TeamEffects {
  constructor(
    private actions$: Actions, 
    private store: Store<AppState>, 
    private http: HttpClient,
  ) {}

  loadTeams= createEffect(
    () => this.actions$.pipe(
      ofType(SportsStore.setCurrentSport),
      withLatestFrom(this.store.select('sports')),
      switchMap(([action, sportStore]) => {
        console.log("Load Team Effect", sportStore);
        if (sportStore.currentSport) {
          return this.http.get<{[key: string]: Team}>(URL + `/teams/${sportStore.currentSport?.id}.json`).pipe(
            map(teamObj=> {
              return Object.keys(teamObj).map(key => {
                return {...teamObj[key], id: key} as Team;
              })
            })
          )
        }
        return of([]);
      }),
      map((teams) => {
        return setTeams({teams: teams});
      }),
    )
  );
}