import { AfterViewInit, Component, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Team } from '../models';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { environment } from "../../environments/environment";
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './teams.component.html',
  styleUrl: './teams.component.css'
})
export class TeamsComponent implements AfterViewInit, OnDestroy {
  @ViewChild("f") form!: NgForm;
  sub ?: Subscription;

  teams: Team[] = [
    {id: '1', name: 'Brigam Young University', abbr: 'BYU', offensiveRating: 10, defensiveRating: 20},
    {id: '1', name: 'University of Utah', abbr: 'UOU', offensiveRating: 11, defensiveRating: 21},
    {id: '1', name: 'Utah State University', abbr: 'USU', offensiveRating: 12, defensiveRating: 22},
    {id: '1', name: 'Boise State University', abbr: 'BSU', offensiveRating: 13, defensiveRating: 23},
    {id: '1', name: 'Baylor University', abbr: 'BU', offensiveRating: 14, defensiveRating: 24},
  ];
  filteredTeams: Team[] = this.teams;

  constructor(private http: HttpClient) {
  }

  ngAfterViewInit(): void {
    this.sub = this.form.valueChanges?.subscribe(change => {
      const fStr = this.form.value['filter'].toUpperCase();
      this.filteredTeams = this.teams.filter(team => team.name.toUpperCase().startsWith(fStr) || team.abbr.toUpperCase().startsWith(fStr));
    });

    this.http.get(environment.firebaseUrl + '/teams.json').subscribe(res => {
      console.log("RESPONSE", res);
    })

  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  clearForm() {
    this.form.setValue({'filter': ''});
  }
}
