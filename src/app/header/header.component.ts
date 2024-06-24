import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Sport, getImageForSport } from '../models';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.store';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentSport?: Sport;
  sub!: Subscription;
  getImageForSport = getImageForSport;

  constructor(private store: Store<AppState>){}

  ngOnInit(): void {
    this.sub = this.store.select('sports').subscribe(state => {
      if (state.currentSport) {
        this.currentSport = state.currentSport;
      }
    })
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
