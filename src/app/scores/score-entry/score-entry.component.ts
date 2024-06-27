import { Component } from '@angular/core';
import { SeasonSelectorComponent } from '../../season/season-selector/season-selector.component';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { Subscription, debounceTime, distinctUntilChanged, of } from 'rxjs';
import { Store } from '@ngrx/store';

import { Schedule, Season, Sport, Team, teamNameMatches, Score, keyById } from '../../models';
import { AppState } from '../../store/app.store';
import { DatastoreService } from '../../datastore.service';
import { NgbDate, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { ScoreEntryItemEditComponent } from '../score-entry-item-edit/score-entry-item-edit.component';
import { ScoreEntryItemDisplayComponent } from '../score-entry-item-display/score-entry-item-display.component';

@Component({
  selector: 'app-score-entry',
  standalone: true,
  imports: [SeasonSelectorComponent, CommonModule, ReactiveFormsModule, 
    NgbDatepickerModule, ScoreEntryItemEditComponent, ScoreEntryItemDisplayComponent],
  templateUrl: './score-entry.component.html',
  styleUrl: './score-entry.component.css'
})
export class ScoreEntryComponent {
  private sport?: Sport;
  private schedules: Schedule[] = [];
  private season?: Season;
  teams: Team[] = [];
  teamsHash: {[key:string]: Team} = {};
  subs: Subscription[] = [];
  form!: FormGroup;
  filteredSchedules: Schedule[] = [];

  constructor(private store: Store<AppState>, private datastore: DatastoreService) {
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      'beginDate': new FormControl(this.getNow(-7)),
      'endDate': new FormControl(this.getNow(+7)),
      'teamFilter': new FormControl('') });

    this.subs.push(this.form.controls['beginDate'].valueChanges.pipe(debounceTime(500),distinctUntilChanged())
    .subscribe(() => {
      this.loadSchedules();
    }));

    this.subs.push(this.form.controls['endDate'].valueChanges.pipe(debounceTime(500),distinctUntilChanged())
    .subscribe(() => {
      this.loadSchedules();
    }));

    this.subs.push(this.form.controls['teamFilter'].valueChanges.pipe(debounceTime(500),distinctUntilChanged())
    .subscribe(value => {
      this.filterSchedules(value);
    }));

    this.subs.push(this.store.select('seasons').subscribe(seasonState => {
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
      this.teamsHash = keyById(teamState.teams);
    }));
  }

  getTeam(teamId: string) : Team | null {
    return this.teamsHash[teamId];
  }

  private getNow(adjust: number) {
    const date = new Date(new Date().getTime() + (adjust*24*60*60*1000));
    return {year: date.getFullYear(), month: date.getMonth()+1, day: date.getDate()}
  }

  private toDate(fDate: NgbDate): Date | null {
    if (fDate) {
        return new Date(fDate.year, fDate.month-1, fDate.day);
    }
    return null;
  }

  private filterSchedules(filter: string) {
    // console.log("Filter By:", filter);
    this.filteredSchedules = this.schedules.filter(s => {
      const teams: (Team | null)[] = [this.getTeam(s.teamAId), this.getTeam(s.teamBId)];
      const found = teams.find(t => !t || !filter || teamNameMatches(t, filter));
      return !!found;
    });
  }

  private loadSchedules() {
    if (this.season && this.sport) {
      const beginDate = this.toDate(this.form.value.beginDate);
      const endDate = this.toDate(this.form.value.endDate);
      // console.log("Search ", beginDate, endDate)
      this.datastore.getSchedules(this.sport, this.season, beginDate, endDate).subscribe(schedules => {
        this.schedules = schedules;
        this.filterSchedules(this.form.value.teamFilter);
      });
    }
  }

  saveScore(event: {schedule: Schedule, score: Score}) {
    if (this.sport && this.season) {
      // console.log("Save Score", event);
      this.datastore.saveScore(this.sport, this.season, event.schedule, event.score ).subscribe(res => {
        event.schedule.score = event.score;
        // console.log("Save Score Complete");
      });
    }
  }
}
