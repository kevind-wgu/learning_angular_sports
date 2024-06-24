import { Component, OnInit } from '@angular/core';
import { Sport } from '../models';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { getImageForSport } from '../models';
import { AppState } from '../store/app.store';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import * as SportStore from './sports.store';
import * as TeamStore from '../teams/teams.store';

@Component({
  selector: 'app-sports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sports.component.html',
  styleUrl: './sports.component.css'
})
export class SportsComponent implements OnInit {
  sports?: Observable<Sport[]>;
  getImageForSport = getImageForSport;

  constructor(private router: Router, private store: Store<AppState>) {}

  ngOnInit(): void {
    this.sports = this.store.select('sports').pipe(map(state => {
      console.log("SportsComponent select");
      return state.sports;
    }));
  }

  chooseSport(sport: Sport) {
    this.store.dispatch(SportStore.setCurrentSport({sport: sport}));
    this.store.dispatch(TeamStore.setTeams({teams: []}));
    this.router.navigate(['/teams']);
  }
}
