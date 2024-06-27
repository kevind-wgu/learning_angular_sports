export enum SportType {
  basketball = "basketball",
  football = "football",
  soccer = "soccer",
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

export interface Season {
  year: number;
}

export interface Schedule {
  id: string
  teamAId: string;
  teamBId: string;
  date: Date;
  entryDate: Date;
  score?: Score;
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
  console.log("Type Not Found", type, SportType.soccer);
  return '';
}

export function findById<T extends {id: string}>(objs : T[], id: string) : T | null {
  var found;
  if (objs) {
    found = objs.find(o => o.id === id);
  }
  return found ? found : null;
}

export function keyById<T extends {id: string}>(objs : T[]) : {[key: string]: T} {
  if (!objs) {
    return {};
  }
  return objs.reduce((obj, value) => {
    return {...obj, [value.id]: value};
  }, {});
}

export function teamNameMatches(team: Team, checkMatchString: string) : boolean {
  const checkMatchStringUpper = checkMatchString ? checkMatchString.toUpperCase() : '';
  return !checkMatchString || 
    team.abbr.toUpperCase().startsWith(checkMatchStringUpper) ||
    team.name.toUpperCase().startsWith(checkMatchStringUpper);
}
