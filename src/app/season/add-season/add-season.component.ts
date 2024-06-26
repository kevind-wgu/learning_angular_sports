import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { Season } from '../../models';
import { AppState } from '../../store/app.store';
import * as SeasonStore from '../../store/season.store';

@Component({
  selector: 'app-add-season',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './add-season.component.html',
  styleUrl: './add-season.component.css'
})
export class AddSeasonComponent implements OnInit, OnDestroy {
  subs: Subscription[] = [];
  form!: FormGroup;
  seasons: Season[] = [];

  constructor(private store: Store<AppState>, private router: Router) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      'year': new FormControl('', [Validators.required])
    })
    this.subs.push(this.store.select('seasons').subscribe(seasonState => {
      this.seasons = seasonState.seasons;
    }));
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  onSubmit() {
    if (this.form.valid) {
      const season: Season =  {"year": this.form.value.year};
      this.store.dispatch(SeasonStore.addSeason({season: season}));
      this.router.navigate(['schedule']);
    }
  }
}
