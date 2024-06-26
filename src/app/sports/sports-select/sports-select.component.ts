import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';

import { Sport } from '../../models';
import { getImageForSport } from '../../models';
import { AppState } from '../../store/app.store';
import * as SportStore from '../../store/sports.store';
import * as TeamStore from '../../store/teams.store';

@Component({
  selector: 'app-sports',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sports-select.component.html',
  styleUrl: './sports-select.component.css'
})
export class SportsSelectComponent implements OnInit {
  sports?: Observable<Sport[]>;
  getImageForSport = getImageForSport;

  constructor(private router: Router, private store: Store<AppState>) {}

  ngOnInit(): void {
    this.sports = this.store.select('sports').pipe(map(state => {
      return state.sports;
    }));
  }

  chooseSport(sport: Sport) {
    this.store.dispatch(SportStore.setCurrentSport({sport: sport}));
    this.store.dispatch(TeamStore.setTeams({teams: []}));
    this.router.navigate(['/teams']);
  }
}
