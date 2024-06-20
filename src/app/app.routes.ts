import { Routes } from '@angular/router';
import { TeamsComponent } from './teams/teams.component';
import { ScoreEntryComponent } from './score-entry/score-entry.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { SportsComponent } from './sports/sports.component';

export const routes: Routes = [
  {path: '', redirectTo: '/teams', pathMatch: 'full'},
  {path: 'teams', component: TeamsComponent},
  {path: 'scores', component: ScoreEntryComponent},
  {path: 'schedule', component: ScheduleComponent},
  {path: 'sports', component: SportsComponent},
];
