import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Schedule, Season, Sport, Team } from '../models';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.store';
import { Subscription, of } from 'rxjs';
import { DatastoreService } from '../datastore.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbDatepickerModule],
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

  @ViewChild("teamAFocus") teamAFocus!: ElementRef;

  constructor(private store: Store<AppState>, private datastore: DatastoreService) {
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      'teamA': new FormControl('', [Validators.required]),
      'teamB': new FormControl('', [Validators.required]),
      'date': new FormControl(new Date().toDateString(), [Validators.required]),
    });
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

  skipSubmit() {

  }

  private getTeamId(abbr: string) : string | undefined {
    return this.teams.find(t => t.abbr === abbr)?.id;
  }

  addSchedule() {
    console.log("Add Schedule", this.form.value);
    if (this.form.valid) {
      const sched = {
        teamAId: this.getTeamId(this.form.value.teamA),
        teamBId: this.getTeamId(this.form.value.teamB),
        date: new Date(this.form.value.date),
      } as Schedule;

      this.schedules.unshift(sched);

      this.form.reset({'teamA':'', 'teamB':'', 'date': this.form.value.date})
      setTimeout(()=>{
        this.teamAFocus.nativeElement.focus();
      });
    }
  }

}
