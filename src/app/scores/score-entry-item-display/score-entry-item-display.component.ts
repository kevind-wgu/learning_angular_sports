import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { DatastoreService } from '../../datastore.service';
import { CommonModule } from '@angular/common';

import { AppState } from '../../store/app.store';
import { Schedule, Score, Season, Sport, Team, findById } from '../../models';

@Component({
  selector: 'app-score-entry-item-display',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './score-entry-item-display.component.html',
  styleUrl: './score-entry-item-display.component.css'
})
export class ScoreEntryItemDisplayComponent implements OnInit {
  @Input() teamA?: Team;
  @Input() teamB?: Team;
  @Input() schedule!: Schedule;

  constructor(private store: Store<AppState>, private datastore: DatastoreService) {
  }

  ngOnInit(): void {
  }
}
