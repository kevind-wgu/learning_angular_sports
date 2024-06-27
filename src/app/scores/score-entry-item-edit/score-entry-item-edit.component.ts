import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { DatastoreService } from '../../datastore.service';
import { CommonModule } from '@angular/common';

import { AppState } from '../../store/app.store';
import { Schedule, Score, Season, Sport, Team, findById } from '../../models';

@Component({
  selector: 'app-score-entry-item-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './score-entry-item-edit.component.html',
  styleUrl: './score-entry-item-edit.component.css'
})
export class ScoreEntryItemEditComponent implements OnInit {
  @Input() teamA?: Team;
  @Input() teamB?: Team;
  @Input() schedule!: Schedule;
  @Output() saveScore: EventEmitter<{schedule: Schedule, score: Score}> = new EventEmitter();
  form!: FormGroup;

  constructor(private store: Store<AppState>, private datastore: DatastoreService) {
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      'teamAScore': new FormControl('', [Validators.required]),
      'teamBScore': new FormControl('', [Validators.required]),
    });
  }

  submitScore() {
    if (this.form.valid) {
      this.saveScore.emit({
        schedule: this.schedule,
        score: {
          teamAScore: this.form.value.teamAScore,
          teamBScore: this.form.value.teamBScore,
          entryDate: new Date(),
        }
      });
    }
  }

}
