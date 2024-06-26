import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { Sport, SportType, getImageForSport } from '../../models';
import { AppState } from '../../store/app.store';
import * as SportState from '../../store/sports.store';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sport-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './sport-edit.component.html',
  styleUrl: './sport-edit.component.css'
})
export class SportEditComponent implements OnInit, OnDestroy {
  subs: Subscription[] = [];
  form!: FormGroup;
  sportId?: String;
  edit = false;
  editInitted = false;
  sports: Sport[] = [];
  getImageForSport = getImageForSport;
  sportTypes = Object.keys(SportType);

  constructor(private route: ActivatedRoute, private router: Router, private store: Store<AppState>) {}

  ngOnInit(): void {
    this.initForm(null);
    console.log("TYPES", this.sportTypes, SportType);
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  private initForm(sportId: string | null | undefined) {
    if (sportId && this.editInitted) {
      return;
    }

    var sport = this.sports.find(t => t.id === sportId);

    const name = sport?.name;
    const type = sport?.type;

    if (sportId) {
      this.sportId = sportId;
      this.edit = true;
      this.editInitted = !!sport;
    }
    else {
      this.edit = false;
    }
    
    this.form = new FormGroup({
      'name': new FormControl(name, [Validators.required, Validators.minLength(2)]),
      'type': new FormControl(type, [Validators.required]),
    });
  }

  onSubmit() {
    if (this.form.valid) {
      if (!this.edit) {
        this.sportId = crypto.randomUUID();
      }
      const sport: Sport = {...this.form.value, id: this.sportId};
      if (this.edit) {
        // TODO
        // console.log("Edit Sport", team)
        // this.store.dispatch(SportsState.editSport({sport: sport}))
      }
      else {
        console.log("Add Sport", sport)
        this.store.dispatch(SportState.addSport({sport: sport}))
      }
      this.router.navigate(['sports']);
    }
  }
}
