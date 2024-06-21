import { Component, OnInit } from '@angular/core';
import { Sport } from '../models';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SportType, getImageForSport } from '../models';
import { AppState } from '../store/app.store';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import * as SportStore from './sport.store';

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
      return state.sports;
    }));
  }

  chooseSport(sport: Sport) {
    this.store.dispatch(SportStore.setCurrentSport({sport: sport}));
    this.router.navigate(['/teams']);
  }
}
