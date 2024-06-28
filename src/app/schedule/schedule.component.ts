import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription, debounceTime, of } from 'rxjs';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbDatepickerModule, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { Schedule, Season, Sport, Team } from '../models';
import { AppState } from '../store/app.store';
import { DatastoreService } from '../datastore.service';
import { SeasonSelectorComponent } from '../season/season-selector/season-selector.component';
import { CacheDataService } from '../store/cache-data-service';

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
  styleUrl: './schedule.component.css',
  animations: [
    trigger('myTrigger', [
      state(
        'fadeInFlash',
        style({ backgroundColor: 'white', })
      ),
      transition('void => *', [
        style({ backgroundColor: '#e5fbe5', transform: 'translateX(-100px)', }),
        animate(
          '500ms',
          style({ backgroundColor: '#e5fbe5', transform: 'translateX(0px)', })
        ),
      ]),
      transition('* => void', [
        style({ backgroundColor: 'white'}),
        animate(
          '500ms',
          style({ backgroundColor: '#ffcccb', opacity: 0.2, transform: 'translateX(100px)', })
        ),
      ]),
    ]),
  ],
})
export class ScheduleComponent implements OnInit, OnDestroy, TeamSupplier {
  season: Season | null = null;
  sport: Sport | null = null;
  teams: Team[]= [];
  teamsHash: {[key:string]: Team} = {};
  schedules: Schedule[] = [];
  subs: Subscription[] = [];
  form!: FormGroup;
  state: string = 'fadeInFlash';
  animationDisabled = true;

  @ViewChild("teamAFocus") teamAFocus!: ElementRef;

  constructor(private store: Store<AppState>, private datastore: DatastoreService, private cacheData: CacheDataService) {
  }

  ngOnInit(): void {
    const teamAControl = new FormControl('', [Validators.required, createTeamExistsValidator(this)]);
    this.form = new FormGroup({
      'teamA': teamAControl,
      'teamB': new FormControl('', [Validators.required, createTeamExistsValidator(this), createTeamUniqueValidator(teamAControl)]
      ),
      'date': new FormControl('', [Validators.required]),
    });

    this.refreshCacheData();
    this.cacheData.refreshEvent.pipe(debounceTime(100)).subscribe(e => {
      this.refreshCacheData();
    });

    this.disableAnimations();
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  private refreshCacheData() {
    console.log("Schedule: Refresh Cache Data");
    this.sport = this.cacheData.getCurrentSport();
    this.season = this.cacheData.getCurrentSeason();
    this.teams = this.cacheData.getTeams();
    this.teamsHash = this.cacheData.getTeamsHash();
    console.log("Schedule: Refresh Cache Data2",this.season, this.sport, this.teams, this.teamsHash);

    this.loadSchedules();
  }

  getTeams(): Team[] {
    return this.teams;
  }

  private disableAnimations() {
    this.animationDisabled = true;
    setTimeout(() => this.animationDisabled = false, 1000);
  }

  private loadSchedules() {
    this.disableAnimations();
    if (this.season && this.sport) {
      this.datastore.getSchedules(this.sport, this.season).subscribe(schedules => {
        this.disableAnimations();
        this.schedules = schedules;
      });
    }
  }

  getTeam(teamId: string) : Team | null {
    return this.teamsHash[teamId];
  }

  skipSubmit() {
    // Here to prevent submit from doing anything (other wise enter key causes submit)
  }

  private getTeamId(abbr: string) : string | undefined {
    return this.teams.find(t => t.abbr === abbr)?.id;
  }

  deleteSchedule(sched: Schedule) {
    if (this.sport && this.season && !sched.score) {
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
