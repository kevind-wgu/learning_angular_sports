import { Routes } from '@angular/router';
import { TeamsComponent } from './teams/teams.component';
import { ScoreEntryComponent } from './score-entry/score-entry.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { SportsComponent } from './sports/sports.component';
import { SportGuard } from './sports/sports.guard';

export const routes: Routes = [
  {path: '', redirectTo: '/teams', pathMatch: 'full'},
  {path: 'teams', component: TeamsComponent, canActivate: [SportGuard]},
  {path: 'scores', component: ScoreEntryComponent, canActivate: [SportGuard]},
  {path: 'schedule', component: ScheduleComponent, canActivate: [SportGuard]},
  {path: 'sports', component: SportsComponent},
];
