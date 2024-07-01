import { ActionReducerMap } from "@ngrx/store";
import * as SportStore from "./sports.store";
import * as TeamStore from "./teams.store";
import * as SeasonStore from "./season.store";
import * as AuthStore from "./auth.store";

export interface AppState {
  sports: SportStore.State,
  teams: TeamStore.State,
  seasons: SeasonStore.State,
  auth: AuthStore.State,
}

export const appReducer: ActionReducerMap<AppState> = {
  sports: SportStore.sportReducer,
  teams: TeamStore.teamReducer,
  seasons: SeasonStore.seasonReducer,
  auth: AuthStore.authReducer,
};