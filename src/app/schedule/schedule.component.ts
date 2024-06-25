import { Component, OnDestroy, OnInit } from '@angular/core';
import { Schedule, Season, Sport, Team } from '../models';
import { State, Store } from '@ngrx/store';
import { AppState } from '../store/app.store';
import { Subscription, of, switchMap, tap } from 'rxjs';
import { DatastoreService } from '../datastore.service';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.css'
})
export class ScheduleComponent implements OnInit, OnDestroy {
  season?: Season;
  sport?: Sport;
  seasons: Season[] = [];
  teams: Team[] = [];
  schedules: Schedule[] = [];
  subs: Subscription[] = [];
  form!: FormGroup;

  constructor(private store: Store<AppState>, private datastore: DatastoreService) {
  }

  ngOnInit(): void {
    this.form = new FormGroup({});
    this.subs.push(this.store.select('seasons').subscribe(seasonState => {
      this.seasons = seasonState.seasons;
      if (seasonState.currentSeason) {
        this.season = seasonState.currentSeason;
        this.loadSchedules();
      }
      return of();
    }));

    this.subs.push(this.store.select('sports').subscribe(sportsState => {
      if (sportsState.currentSport) {
        this.sport = sportsState.currentSport;
        this.loadSchedules();
      }
    }));

    this.subs.push(this.store.select('teams').subscribe(teamState => {
      this.teams = teamState.teams;
    }));
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  private loadSchedules() {
    if (this.season && this.sport) {
      console.log("ScheduleComponent Loading");
      this.datastore.getSchedules(this.sport, this.season).subscribe(schedules => {
        this.schedules = schedules;
      });
    }
    else {
      console.log("ScheduleComponent Skipping Load");
    }
  }

  getTeam(teamId: string) : Team | undefined {
    return this.teams.find(t => t.id === teamId);
  }


}
