import fetchApi from './api';
import { Team, TeamStats, HeadToHead, Match } from '@/types';

export async function searchTeams(query: string): Promise<Team[]> {
  try {
    const data = await fetchApi(`/teams/search/${encodeURIComponent(query)}`);
    
    if (data && data.response) {
      return data.response.slice(0, 10).map((team: unknown) => ({
        id: (team as { team: { id: number } }).team.id,
        name: (team as { team: { name: string } }).team.name,
        logo: (team as { team: { logo: string } }).team.logo,
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error searching teams:', error);
    return [];
  }
}

export async function getTeamStats(teamId: number, leagueId: number = 39): Promise<TeamStats | null> {
  try {
    const season = new Date().getFullYear();
    const data = await fetchApi(`/teams/statistics?team=${teamId}&season=${season}&league=${leagueId}`);
    
    if (data && data.response) {
      const stats = data.response;
      const all = stats.fixtures || {};
      
      return {
        form: stats.form?.split('') || [],
        leaguePosition: stats.league?.standings?.[0]?.find(
          (s: { team: { id: number } }) => s.team.id === teamId
        )?.rank || 0,
        wins: all.wins?.total || 0,
        draws: all.draws?.total || 0,
        losses: all.loses?.total || 0,
        goalsFor: stats.goals?.for?.total?.total || 0,
        goalsAgainst: stats.goals?.against?.total?.total || 0,
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching team stats:', error);
    return null;
  }
}

export async function getHeadToHead(homeTeamId: number, awayTeamId: number): Promise<HeadToHead | null> {
  try {
    const data = await fetchApi(`/fixtures/headtohead?h2h=${homeTeamId}-${awayTeamId}&last=5`);
    
    if (data && data.response) {
      const matches: Match[] = data.response.map((fixture: unknown) => {
        const homeGoals = (fixture as { goals: { home: number | null } }).goals.home ?? 0;
        const awayGoals = (fixture as { goals: { away: number | null } }).goals.away ?? 0;
        const homeId = (fixture as { teams: { home: { id: number } } }).teams.home.id;
        
        let result: 'W' | 'D' | 'L';
        if (homeGoals > awayGoals) {
          result = homeId === homeTeamId ? 'W' : 'L';
        } else if (homeGoals < awayGoals) {
          result = homeId === homeTeamId ? 'L' : 'W';
        } else {
          result = 'D';
        }
        
        return {
          id: (fixture as { fixture: { id: number } }).fixture.id,
          date: (fixture as { fixture: { date: string } }).fixture.date,
          homeTeam: (fixture as { teams: { home: { name: string } } }).teams.home.name,
          awayTeam: (fixture as { teams: { away: { name: string } } }).teams.away.name,
          homeScore: homeGoals,
          awayScore: awayGoals,
          result,
        };
      });
      
      let homeWins = 0;
      let awayWins = 0;
      let draws = 0;
      
      matches.forEach(match => {
        if (match.result === 'W') homeWins++;
        else if (match.result === 'L') awayWins++;
        else draws++;
      });
      
      return {
        matches,
        homeWins,
        awayWins,
        draws,
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching head-to-head:', error);
    return null;
  }
}
