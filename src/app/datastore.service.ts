import { Injectable } from '@angular/core';
import { environment } from "../environments/environment";
import { HttpClient } from '@angular/common/http';
import { Schedule, Score, Season, Sport, Team } from './models';
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

  updateSport(sport: Sport) : Subscription {
    return this.http.put(URL + `/sports/${sport.id}.json`, sport).subscribe(res => {
      console.log("Team Updated", sport.id);
    });
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
    return this.http.put(URL + `/teams/${sport.id}/${team.id}.json`, team).subscribe(res => {
      console.log("Team Updated", team.id);
    });
  }

  getSeasons(sport: Sport) : Observable<Season[]> {
    return this.http.get<{[key: string]: boolean}>(URL + `/sports/${sport.id}/seasons.json`).pipe(
      map(seasonObj => {
        if (!seasonObj) {
          return [];
        }
        return Object.keys(seasonObj).map(key => {
          return {year: +key} as Season;
        })
      })
    );
  }

  addSeason(sport: Sport, season: Season) : Subscription {
    return this.http.put(URL + `/sports/${sport.id}/seasons/${season.year}.json`, true).subscribe(res => {
      console.log("Season Added", season);
    });
  }

  private getDateQuery(date: Date, dayAdjust: number): string {
    const newDate = new Date(date.getTime() + (dayAdjust*24*60*60*1000));
    return '"' + newDate.toISOString().split('T')[0] + '"';
  }

  getSchedules(sport: Sport, season: Season, beginDate: Date | null = null, endDate: Date | null = null) : Observable<Schedule[]> {
    const params: {[key:string]: string} = {};
    if (beginDate) {
      params['startAt'] = this.getDateQuery(beginDate, 0);
      params['orderBy'] = '"date"';
    }
    if (endDate) {
      params['endAt'] = this.getDateQuery(endDate, 1);
      params['orderBy'] = '"date"';
    }
    const query = URL + `/schedules/${sport.id}/${season.year}.json`
    return this.http.get<{[key: string]: Schedule}>(query, {params: params}).pipe(
      map(schedObj => {
        if (!schedObj) {
          return [];
        }
        return Object.keys(schedObj).map(key => {
          const obj = schedObj[key];
          return {...obj, date: new Date(obj.date)};
        })
        .sort((s1, s2) => s1.date.getDate() - s2.date.getDate());
      })
    );
  }

  addSchedule(sport: Sport, season: Season, sched: Schedule) : Observable<any> {
    return this.http.put(URL + `/schedules/${sport.id}/${season.year}/${sched.id}.json`, sched).pipe(
      tap(res => {
        console.log("Schedule Added", sched);
      })
    )
  }

  deleteSchedule(sport: Sport, season: Season, sched: Schedule) : Observable<any> {
    console.log("Delete Schedule", URL + `/schedules/${sport.id}/${season.year}/${sched.id}.json`);
    return this.http.delete(URL + `/schedules/${sport.id}/${season.year}/${sched.id}.json`).pipe(
      tap(res => {
        console.log("Schedule Deleted", sched);
      })
    )
  }

  saveScore(sport: Sport, season: Season, sched: Schedule, score: Score) : Observable<any> {
    return this.http.put(URL + `/schedules/${sport.id}/${season.year}/${sched.id}/score.json`, score).pipe(
      tap(res => {
        console.log("Score Saved", sched);
      })
    )
  }
}
