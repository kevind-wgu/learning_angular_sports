import { ActionReducerMap } from "@ngrx/store";
import { Schedule, Sport, Team } from "../models";
import * as SportStore from "../sports/sport.store";

export interface AppState {
  sports: SportStore.State,
  // teams: Team[],
  // schedules: Schedule[],
}

export const appReducer: ActionReducerMap<AppState> = {
  sports: SportStore.sportReducer,
  // teams: AuthStore.authReducer,
  // schedules: RecipesStore.recipesReducer,
};