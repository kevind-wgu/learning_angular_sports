import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription, map, switchMap } from 'rxjs';
import { Team } from '../../models';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.store';
import * as TeamState from '../../store/teams.store';

@Component({
  selector: 'app-team-edit',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './team-edit.component.html',
  styleUrl: './team-edit.component.css'
})
export class TeamAddComponent implements OnInit, OnDestroy {
  subs: Subscription[] = [];
  form!: FormGroup;
  teamId?: string;
  edit = false;
  editInitted = false;
  teams: Team[] = [];

  constructor(private route: ActivatedRoute, private router: Router, private store: Store<AppState>) {}

  ngOnInit(): void {
    this.initForm(null);

    this.subs.push(this.route.params.subscribe(params => {
      this.initForm(params['id']);
    }));

    this.subs.push(this.store.select('teams').subscribe(teamStore => {
      this.teams = teamStore.teams;
      this.initForm(this.teamId);
    }));
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  private initForm(teamId: string | null | undefined) {
    if (teamId && this.editInitted) {
      return;
    }

    var team = this.teams.find(t => t.id === teamId);

    const name = team?.name;
    const abbr = team?.abbr;
    const offensiveRating = team?.offensiveRating;
    const defensiveRating = team?.defensiveRating;
    if (teamId) {
      this.teamId = teamId;
      this.edit = true;
      this.editInitted = !!team;
    }
    else {
      this.edit = false;
    }
    
    console.log("Team edit initForm", this.edit, this.teamId, team, this.teams);
    this.form = new FormGroup({
      'abbr': new FormControl(abbr, [Validators.required, Validators.minLength(2), Validators.maxLength(4)]),
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
        console.log("Edit Team", team)
        this.store.dispatch(TeamState.editTeam({team: team}))
      }
      else {
        console.log("Add Team", team)
        this.store.dispatch(TeamState.addTeam({team: team}))
      }
      this.router.navigate(['teams']);
    }
  }

}
