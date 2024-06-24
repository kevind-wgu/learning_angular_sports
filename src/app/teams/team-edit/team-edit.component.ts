import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription, map, switchMap } from 'rxjs';
import { Team } from '../../models';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.store';
import * as TeamState from '../teams.store';

@Component({
  selector: 'app-team-edit',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './team-edit.component.html',
  styleUrl: './team-edit.component.css'
})
export class TeamAddComponent implements OnInit {
  sub!: Subscription;
  form!: FormGroup;
  teamId?: string;
  edit = false;

  constructor(private route: ActivatedRoute, private router: Router, private store: Store<AppState>) {}

  ngOnInit(): void {
    this.initForm(null);

    this.route.params.pipe(
      switchMap((params) => {
        this.teamId = params['id'];
        return this.store.select('teams');
      }),
      map((teamsStore) => {
        if (this.teamId) {
          return teamsStore.teams.find((t) => t.id === this.teamId);
        }
        return null;
      })
    ).subscribe((team) => {
      this.initForm(team);
    })
    

  }

  private initForm(team: Team | null | undefined ) {
    const name = team?.name;
    const abbr = team?.abbr;
    const offensiveRating = team?.offensiveRating;
    const defensiveRating = team?.defensiveRating;
    this.edit = !!team;
    
    this.form = new FormGroup({
      'abbr': new FormControl(abbr, [Validators.required, Validators.minLength(2), Validators.maxLength(3)]),
      'name': new FormControl(name, [Validators.required, Validators.minLength(2)]),
      'offensiveRating': new FormControl(offensiveRating, [Validators.required, Validators.required, Validators.min(0)]),
      'defensiveRating': new FormControl(defensiveRating, [Validators.required, Validators.required, Validators.min(0)]),
    });
  }

  onSubmit() {
    if (this.form.valid) {
      if (!this.edit) {
        this.teamId = crypto.randomUUID();
      }
      const team: Team = {...this.form.value, id: this.teamId};
      if (this.edit) {
        this.store.dispatch(TeamState.editTeam({team: team}))
      }
      else {
        this.store.dispatch(TeamState.addTeam({team: team}))
      }
      this.router.navigate(['teams']);
    }
  }

}
