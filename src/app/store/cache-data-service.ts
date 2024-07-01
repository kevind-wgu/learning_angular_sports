import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './app.store';
import { Season, Sport, Team, keyById } from '../models';
import { Subject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CacheDataService implements OnDestroy {
  refreshEvent = new Subject<boolean>();
  private sports: Sport[] = [];
  private sport: Sport | null = null;
  private seasons: Season[] = [];
  private season: Season | null = null;
  private teams: Team[] = [];

  private subs: Subscription[] = [];

  constructor(private store: Store<AppState>) { 
    this.subs.push(this.store.select('sports').subscribe(sportsState => {
      // console.log("CacheData: Refresh Sports");
      this.sports = sportsState.sports;
      this.sport = sportsState.currentSport;
      this.refreshEvent.next(true);
    }));

    this.subs.push(this.store.select('seasons').subscribe(seasonState => {
      // console.log("CacheData: Refresh Seasons");
      this.seasons = seasonState.seasons;
      this.season = seasonState.currentSeason;
      this.refreshEvent.next(true);
    }));

    this.subs.push(this.store.select('teams').subscribe(sportsState => {
      // console.log("CacheData: Refresh Teams");
      this.teams = sportsState.teams;
      this.refreshEvent.next(true);
    }));
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  getSports() : Sport[] {
    return this.sports;
  }
  
  getCurrentSport() : Sport | null {
    return this.sport;
  }

  getSeasons() : Season[] {
    return this.seasons;
  }
  
  getCurrentSeason() : Season | null {
    return this.season;
  }

  getTeams() : Team[] {
    return this.teams;
  }

  getTeamsHash() : {[key:string]: Team} {
    return keyById(this.teams);
  }
}
