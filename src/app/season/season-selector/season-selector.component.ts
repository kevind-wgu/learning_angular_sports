import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { RouterModule } from '@angular/router';

import { AppState } from '../../store/app.store';
import * as SeasonStore from '../../store/season.store';
import { Season } from '../../models';

@Component({
  selector: 'app-season-selector',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './season-selector.component.html',
  styleUrl: './season-selector.component.css'
})
export class SeasonSelectorComponent implements OnInit, OnDestroy {
  @Input() title!: string;

  subs: Subscription[] = [];
  form!: FormGroup;
  seasonControl!: FormControl;
  seasons: Season[] = [];

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.seasonControl = new FormControl('', [Validators.required]);
    this.form = new FormGroup({
      'season': this.seasonControl
    })

    this.subs.push(this.store.select('seasons').subscribe(seasonState => {
      this.seasons = seasonState.seasons;
      if (seasonState.currentSeason) {
        this.seasonControl.setValue(seasonState.currentSeason.year);
      }
      else {
        this.seasonControl.setValue('');
      }
    }));
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  changeSeason() {
    const seasonValue = this.form.value.season;
    if (seasonValue) {
      const season = this.seasons.find(s => s.year === +seasonValue);
      if (season) {
        this.store.dispatch(SeasonStore.setCurrentSeason({season: season}))
      }
      else {
        console.warn("No Season found", season, seasonValue, this.seasons)
      }
    }
  }
}
