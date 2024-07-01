import { Routes } from '@angular/router';
import { TeamsComponent } from './teams/teams-list/teams.component';
import { ScoreEntryComponent } from './scores/score-entry/score-entry.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { SportsSelectComponent } from './sports/sports-select/sports-select.component';
import { SportGuard } from './sports/sports.guard';
import { TeamAddComponent } from './teams/team-edit/team-edit.component';
import { SportEditComponent } from './sports/sport-edit/sport-edit.component';
import { AddSeasonComponent } from './season/add-season/add-season.component';
import { LoginComponent } from './auth/login/login.component';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  {path: '', redirectTo: '/teams', pathMatch: 'full'},
  {path: 'teams', canActivate: [authGuard, SportGuard], children: [
    {path: '', component: TeamsComponent},
    {path: ':id/edit', component: TeamAddComponent},
    {path: 'new', component: TeamAddComponent},
  ]},
  {path: 'scores', component: ScoreEntryComponent, canActivate: [authGuard, SportGuard]},
  {path: 'schedule', component: ScheduleComponent, canActivate: [authGuard, SportGuard]},
  {path: 'sports', canActivate: [authGuard], children: [
    {path: '', component: SportsSelectComponent},
    {path: 'new', component: SportEditComponent},
  ]},
  {path: 'season/new', component: AddSeasonComponent, canActivate: [authGuard, SportGuard]},
  {path: 'login', component: LoginComponent},
];
