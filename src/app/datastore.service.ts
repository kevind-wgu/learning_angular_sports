import { Injectable } from '@angular/core';
import { environment } from "../environments/environment";
import { HttpClient } from '@angular/common/http';
import { Schedule, Season, Sport, Team } from './models';
import { Observable, Subscription, map, tap } from 'rxjs';

const URL = environment.firebaseUrl;

@Injectable({
  providedIn: 'root'
})
export class DatastoreService {
  constructor(private http: HttpClient) { }

  getSports() :Observable<Sport[]> {
    return this.http.get<{[key: string]: Sport}>(URL + '/sports.json').pipe(
      map(sportObj => {
        if (!sportObj) {
          return [];
        }
        return Object.keys(sportObj).map(key => {
          return {...sportObj[key]};
        });
      })
    );
  }

  loadTeams(sport: Sport) : Observable<Team[]> {
    return this.http.get<{[key: string]: Team}>(URL + `/teams/${sport.id}.json`).pipe(
      map(teamObj=> {
        if (!teamObj) {
          return [];
        }
        return Object.keys(teamObj).map(key => {
          return {...teamObj[key]} as Team;
        })
      })
    )
  }

  updateTeam(sport: Sport, team: Team) : Subscription {
    const teamId = team.id;
    return this.http.put(URL + `/teams/${sport.id}/${teamId}.json`, team).subscribe(res => {
      console.log("Team Updated", teamId);
    });
  }

  getSeasons(sport: Sport) : Observable<Season[]> {
    return this.http.get<{[key: string]: boolean}>(URL + `/sports/${sport.id}/seasons.json`).pipe(
      map(seasonObj => {
        return Object.keys(seasonObj).map(key => {
          return {year: +key} as Season;
        })
      })
    );
  }

  getSchedules(sport: Sport, season: Season) : Observable<Schedule[]> {
    return this.http.get<{[key: string]: Schedule}>(URL + `/schedules/${sport.id}/${season.year}.json`).pipe(
      map(schedObj => {
        if (!schedObj) {
          return [];
        }
        return Object.keys(schedObj).map(key => {
          return {...schedObj[key]};
        })
      })
    );
  }

  addSchedule(sport: Sport, season: Season, sched: Schedule) : Observable<any> {
    return this.http.put(URL + `/schedules/${sport.id}/${season.year}/${sched.id}.json`, sched).pipe(
      tap(res => {
        console.log("Schedule Added");
      })
    )
  }

  deleteSchedule(sport: Sport, season: Season, sched: Schedule) : Observable<any> {
    console.log("Delete Schedule", URL + `/schedules/${sport.id}/${season.year}/${sched.id}.json`);
    return this.http.delete(URL + `/schedules/${sport.id}/${season.year}/${sched.id}.json`).pipe(
      tap(res => {
        console.log("Schedule Deleted");
      })
    )
  }
}
