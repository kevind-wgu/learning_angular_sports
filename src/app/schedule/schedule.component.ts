import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Schedule, Season, Sport, Team } from '../models';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.store';
import { Subscription, of } from 'rxjs';
import { DatastoreService } from '../datastore.service';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbDatepickerModule, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { SeasonSelectorComponent } from '../season/season-selector/season-selector.component';

function createTeamExistsValidator(teamSupplier: TeamSupplier) : ValidatorFn {
  return (control => {
    const teamAbbr = control.value;
    if (!teamSupplier.getTeams().find(t => t.abbr === teamAbbr)) {
      return {teamNotFound: true};
    }
    return null;
  });
}

function createTeamUniqueValidator(otherTeam: AbstractControl) : ValidatorFn {
  return (control => {
    if (control.value === otherTeam.value) {
      return {teamNotUnique: true};
    }
    return null;
  });
}

interface TeamSupplier {
  getTeams(): Team[];
}

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbDatepickerModule, SeasonSelectorComponent],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.css'
})
export class ScheduleComponent implements OnInit, OnDestroy, TeamSupplier {
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
    const teamAControl = new FormControl('', [Validators.required, createTeamExistsValidator(this)]);
    this.form = new FormGroup({
      'teamA': teamAControl,
      'teamB': new FormControl('', [Validators.required, createTeamExistsValidator(this), createTeamUniqueValidator(teamAControl)]
      ),
      'date': new FormControl('', [Validators.required]),
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

  getTeams(): Team[] {
    return this.teams;
  }

  private loadSchedules() {
    console.log("Load Schedules");
    if (this.season && this.sport) {
      this.datastore.getSchedules(this.sport, this.season).subscribe(schedules => {
        console.log("Set Schedules");
        this.schedules = schedules;
      });
    }
  }

  getTeam(teamId: string) : Team | undefined {
    return this.teams.find(t => t.id === teamId);
  }

  skipSubmit() {
    // Here to prevent submit from doing anything (other wise enter key causes submit)
  }

  private getTeamId(abbr: string) : string | undefined {
    return this.teams.find(t => t.abbr === abbr)?.id;
  }

  deleteSchedule(sched: Schedule) {
    if (this.sport && this.season) {
      this.datastore.deleteSchedule(this.sport, this.season, sched).subscribe(res => {
        const index = this.schedules.findIndex(s => s.id === sched.id);
        if (index >= 0) {
          this.schedules.splice(index, 1);
        }
      });
    }
  }

  addSchedule() {
    if (this.form.valid && this.sport && this.season) {
      const fDate = this.form.value.date as NgbDate;

      const sched = {
        id: crypto.randomUUID(),
        teamAId: this.getTeamId(this.form.value.teamA),
        teamBId: this.getTeamId(this.form.value.teamB),
        date: new Date(fDate.year, fDate.month-1, fDate.day),
      } as Schedule;

      this.datastore.addSchedule(this.sport, this.season, sched).subscribe(res => {
        this.form.reset({'teamA':'', 'teamB':'', 'date': this.form.value.date})
        this.schedules.unshift(sched);
        this.teamAFocus.nativeElement.focus();
      });
    }
  }

}
