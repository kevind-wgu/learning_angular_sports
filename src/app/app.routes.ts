import { Routes } from '@angular/router';
import { TeamsComponent } from './teams/teams-list/teams.component';
import { ScoreEntryComponent } from './score-entry/score-entry.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { SportsSelectComponent } from './sports/sports-select/sports-select.component';
import { SportGuard } from './sports/sports.guard';
import { TeamAddComponent } from './teams/team-edit/team-edit.component';

export const routes: Routes = [
  {path: '', redirectTo: '/teams', pathMatch: 'full'},
  {path: 'teams', canActivate: [SportGuard], children: [
    {path: '', component: TeamsComponent},
    {path: ':id/edit', component: TeamAddComponent},
    {path: 'new', component: TeamAddComponent},
  ]},
  {path: 'scores', component: ScoreEntryComponent, canActivate: [SportGuard]},
  {path: 'schedule', component: ScheduleComponent, canActivate: [SportGuard]},
  {path: 'sports', component: SportsSelectComponent},
];
