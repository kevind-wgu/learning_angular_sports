import { ActionReducerMap } from "@ngrx/store";
import { Schedule, Sport, Team } from "../models";
import * as SportStore from "./sports.store";
import * as TeamStore from "./teams.store";
import * as SeasonStore from "./season.store";

export interface AppState {
  sports: SportStore.State,
  teams: TeamStore.State,
  seasons: SeasonStore.State,
  // schedules: Schedule[],
}

export const appReducer: ActionReducerMap<AppState> = {
  sports: SportStore.sportReducer,
  teams: TeamStore.teamReducer,
  seasons: SeasonStore.seasonReducer,
  // schedules: RecipesStore.recipesReducer,
};