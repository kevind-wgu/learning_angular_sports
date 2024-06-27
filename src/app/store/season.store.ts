import { Injectable } from "@angular/core";
import { Season } from "../models";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { DatastoreService } from "../datastore.service";
import { Store, createAction, createReducer, on, props } from "@ngrx/store";
import * as SportsStore from "../store/sports.store";
import { map, of, switchMap, tap, withLatestFrom } from "rxjs";
import { AppState } from "./app.store";

export interface State {
  seasons: Season[],
  currentSeason: Season | null,
};

const INITIAL_STATE : State = {
  seasons: [],
  currentSeason: null,
};

export const setSeasons = createAction('[Seasons] Set Seasons', 
  props<{seasons: Season[]}>()
);

export const setCurrentSeason = createAction('[Seasons] Set Current Season', 
  props<{season: Season}>()
);

export const addSeason = createAction('[Seasons] Add Season', 
  props<{season: Season}>()
);

export const seasonReducer = createReducer(
  INITIAL_STATE,
  on(setSeasons, (state, action) => {
    var seasons = [...action.seasons].sort((s1,s2) => s1.year - s2.year);
    const newState = {...state, seasons: seasons};
    console.log("Set Seasons", newState);
    return newState;
  }),
  on(setCurrentSeason, (state, action) => {
    const newState = {...state, currentSeason: action.season};
    console.log("Set Current Season", newState);
    return newState;
  }),
  on(addSeason, (state, action) => {
    const seasons = [...state.seasons, action.season].sort((s1,s2) => s1.year - s2.year);
    const newState = {...state, seasons: seasons, currentSeason: action.season};
    console.log("Add Season, Change Current Season", newState);
    return newState;
  }),
);

@Injectable(
)
export class SeasonEffects {
  constructor(
    private actions$: Actions, 
    private store: Store<AppState>, 
    private datastore: DatastoreService,
  ) {}

  loadSeasons = createEffect(
    () => this.actions$.pipe(
      ofType(SportsStore.setCurrentSport),
      withLatestFrom(this.store.select('sports')),
      switchMap(([action, sportStore]) => {
        // console.log("Load Season Effect", sportStore);
        if (sportStore.currentSport) {
          return this.datastore.getSeasons(sportStore.currentSport);
        }
        return of([]);
      }),
      map((seasons) => {
        return setSeasons({seasons: seasons});
      }),
    )
  );

  defaultCurrentSeason = createEffect(
    () => this.actions$.pipe(
      ofType(setSeasons),
      switchMap((action) => {
        const seasons = action.seasons;
        if (seasons.length > 0) {
          const currentSeason = seasons[0];
          return of(setCurrentSeason({season: currentSeason}));
        }
        return of();
      }),
    )
  );

  addSeason = createEffect(
    () => this.actions$.pipe(
      ofType(addSeason),
      withLatestFrom(this.store.select('sports')),
      tap(([action, sportsStore]) => {
        if (sportsStore.currentSport) {
          this.datastore.addSeason(sportsStore.currentSport, action.season);
        }
      }),
    ),
    {dispatch: false}
  );
}