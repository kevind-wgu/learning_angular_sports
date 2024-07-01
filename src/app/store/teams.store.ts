import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store, createAction, createReducer, on, props } from "@ngrx/store";
import { HttpClient } from "@angular/common/http";

import { AppState } from "../store/app.store";
import { environment } from "../../environments/environment";
import { Team } from "../models";
import * as SportsStore from "../store/sports.store";
import { map, of, switchMap, tap, withLatestFrom } from "rxjs";
import { DatastoreService } from "../datastore.service";

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

export const editTeam = createAction('[Teams] Edit Team', 
  props<{team: Team}>()
);

export const addTeam = createAction('[Teams] Add Team', 
  props<{team: Team}>()
);

export const teamReducer = createReducer(
  INITIAL_STATE,
  on(setTeams, (state, action) => {
    var teams = [...action.teams].sort((t1, t2) => t1.abbr.localeCompare(t2.abbr));
    const newState = {...state, teams: teams};
    // console.log("Set Teams", newState);
    return newState;
  }),
  on(addTeam, (state, action) => {
    const teams = [...state.teams];
    const newTeam = {...action.team};
    teams.push(newTeam);
    return {...state, teams: teams};
  }),
  on(editTeam, (state, action) => {
    const teams = state.teams.filter(t => t.id !== action.team.id);
    teams.push(action.team);
    return {...state, teams: teams};
  }),
);

@Injectable()
export class TeamEffects {
  constructor(
    private actions$: Actions, 
    private store: Store<AppState>, 
    private datastore: DatastoreService,
  ) {}

  loadTeams= createEffect(
    () => this.actions$.pipe(
      ofType(SportsStore.setCurrentSport),
      withLatestFrom(this.store.select('sports')),
      switchMap(([action, sportStore]) => {
        // console.log("Load Team Effect", sportStore);
        if (sportStore.currentSport) {
          return this.datastore.loadTeams(sportStore.currentSport);
        }
        return of([]);
      }),
      map((teams) => {
        return setTeams({teams: teams});
      }),
    )
  );

  editTeam = createEffect(
    () => this.actions$.pipe(
      ofType(editTeam, addTeam),
      withLatestFrom(this.store.select('sports')),
      tap(([action, sportsStore]) => {
        if (sportsStore.currentSport) {
          this.datastore.updateTeam(sportsStore.currentSport, action.team);
        }
      }),
    ),
    {dispatch: false}
  );
}