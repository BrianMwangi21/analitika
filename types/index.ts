export interface Team {
  id: number;
  name: string;
  logo: string;
}

export interface Match {
  id: number;
  date: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  result: 'W' | 'D' | 'L';
}

export interface TeamStats {
  form: string[];
  leaguePosition: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
}

export interface HeadToHead {
  matches: Match[];
  homeWins: number;
  awayWins: number;
  draws: number;
}

export interface Odds {
  homeWin: number;
  draw: number;
  awayWin: number;
}

export interface Fixture {
  id: number;
  date: string;
  time: string;
  homeTeam: Team;
  awayTeam: Team;
  odds: Odds;
  league: string;
  leagueLogo: string;
}

export interface Analytics {
  homeTeamStats: TeamStats;
  awayTeamStats: TeamStats;
  headToHead: HeadToHead;
  odds: Odds;
}

export interface Card {
  id: string;
  homeTeam: Team | null;
  awayTeam: Team | null;
  analytics: Analytics | null;
  isLoading: boolean;
  error: string | null;
  fixtureId?: number;
  odds?: Odds;
}
