export enum SportType {
  basketball,
  football,
  soccer,
}

export function getImageForSport(type: SportType) : string {
  if (type == SportType.basketball) {
    return '/assets/images/basketball.jpeg';
  }
  if (type == SportType.football) {
    return '/assets/images/football.png';
  }
  if (type == SportType.soccer) {
    return '/assets/images/soccer.png';
  }
  return '';
}

export interface Sport {
  id: string;
  name: string;
  type: SportType;
}

export interface Team {
  id: string;
  name: string;
  abbr: string;
  offensiveRating: number;
  defensiveRating: number;
}

export interface Score {
  teamAScore: string;
  teamBScore: string;
  entryDate: Date;
}

export interface Schedule {
  id: string
  teamAId: string;
  teamBId: string;
  date: Date;
  entryDate: Date;
  score?: Score;
}