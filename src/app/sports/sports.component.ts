import { Component } from '@angular/core';
import { Sport } from '../models';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SportType, getImageForSport } from '../models';

@Component({
  selector: 'app-sports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sports.component.html',
  styleUrl: './sports.component.css'
})
export class SportsComponent {
  sports: Sport[] = [
    {id: "1", name:"College Football", type: SportType.football},
    {id: "2", name:"College Basketball", type: SportType.basketball},
  ]
  getImageForSport = getImageForSport;

  constructor(private router: Router) {}

  chooseSport(sportId: string) {
    console.log("Choose sport", sportId);
  }
}
