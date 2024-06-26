import { Component } from '@angular/core';
import { SeasonSelectorComponent } from '../season/season-selector/season-selector.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-score-entry',
  standalone: true,
  imports: [SeasonSelectorComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './score-entry.component.html',
  styleUrl: './score-entry.component.css'
})
export class ScoreEntryComponent {

}
