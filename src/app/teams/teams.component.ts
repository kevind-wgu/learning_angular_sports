import { AfterViewInit, Component, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Team } from '../models';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Observable, Subscription, map } from 'rxjs';
import { environment } from "../../environments/environment";
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.store';

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './teams.component.html',
  styleUrl: './teams.component.css'
})
export class TeamsComponent implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild("f") form!: NgForm;
  subs : Subscription[] = [];

  teams?: Team[] = [];
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
    const sub = this.store.select('teams').subscribe((state => {
      this.teams = state.teams;
    }));
    if (sub) this.subs.push(sub);
  }

  ngAfterViewInit(): void {
    const sub = this.form.valueChanges?.subscribe(change => {
      const fStr = this.form.value['filter'].toUpperCase();
    });
    if (sub) this.subs.push(sub);
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  filterTeams(teams: Team[]): Team[] {
    // TODO: Get the filter working again.


    return teams;
    // return teams.filter(team => team.name.toUpperCase().startsWith(fStr) || team.abbr.toUpperCase().startsWith(fStr));
  }

  clearForm() {
    this.form.setValue({'filter': ''});
  }
}
