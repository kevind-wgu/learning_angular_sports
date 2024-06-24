import { ActionReducerMap } from "@ngrx/store";
import { Schedule, Sport, Team } from "../models";
import * as SportStore from "../sports/sport.store";
import * as TeamStore from "../teams/teams.store";

export interface AppState {
  sports: SportStore.State,
  teams: TeamStore.State,
  // schedules: Schedule[],
}

export const appReducer: ActionReducerMap<AppState> = {
  sports: SportStore.sportReducer,
  teams: TeamStore.teamReducer,
  // schedules: RecipesStore.recipesReducer,
};