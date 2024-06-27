import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { Team, teamNameMatches } from '../../models';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.store';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, RouterLink],
  templateUrl: './teams.component.html',
  styleUrl: './teams.component.css'
})
export class TeamsComponent implements OnDestroy, OnInit {
  form!: FormGroup;
  subs: Subscription[] = [];

  teams: Team[] = [];
  filteredTeams: Team[] = [];

  // teams?: Observable<Team[]>;
  //   {id: '1', name: 'Brigam Young University', abbr: 'BYU', offensiveRating: 10, defensiveRating: 20},
  //   {id: '1', name: 'University of Utah', abbr: 'UOU', offensiveRating: 11, defensiveRating: 21},
  //   {id: '1', name: 'Utah State University', abbr: 'USU', offensiveRating: 12, defensiveRating: 22},
  //   {id: '1', name: 'Boise State University', abbr: 'BSU', offensiveRating: 13, defensiveRating: 23},
  //   {id: '1', name: 'Baylor University', abbr: 'BU', offensiveRating: 14, defensiveRating: 24},
  // ];

  constructor(private http: HttpClient, private store: Store<AppState>) {
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      'teamFilter': new FormControl('')
    })

    this.subs.push(this.store.select('teams').subscribe((state => {
      this.teams = state.teams;
      this.filterTeams(this.form.value.teamFilter);
    })));

    this.subs.push(this.form.controls['teamFilter'].valueChanges.pipe(debounceTime(300),distinctUntilChanged())
    .subscribe(value => {
      this.filterTeams(value);
    }));
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  filterTeams(filter: string) {
    this.filteredTeams = this.teams.filter(team => teamNameMatches(team, filter));
  }

  clearForm() {
    this.form.setValue({'teamFilter': ''});
  }
}
