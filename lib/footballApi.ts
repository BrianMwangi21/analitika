import fetchApi from './api';
import { Team, TeamStats, HeadToHead, Match, Odds } from '@/types';

export async function searchTeams(query: string): Promise<Team[]> {
  try {
    const data = await fetchApi(`/teams?search=${encodeURIComponent(query)}`);
    
    if (data && data.response) {
      return data.response.map((item: { team: { id: number; name: string; logo: string } }) => ({
        id: item.team.id,
        name: item.team.name,
        logo: item.team.logo,
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
    const season = 2024;
    const data = await fetchApi(`/teams/statistics?team=${teamId}&season=${season}&league=${leagueId}`);
    
    if (data && data.response) {
      const stats = data.response;
      return {
        form: stats.form?.split('') || [],
        leaguePosition: 1,
        wins: stats.fixtures?.wins?.total || 0,
        draws: stats.fixtures?.draws?.total || 0,
        losses: stats.fixtures?.loses?.total || 0,
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
    const data = await fetchApi(`/fixtures/headtohead?h2h=${homeTeamId}-${awayTeamId}`);
    
    if (data && data.response) {
      const matches: Match[] = data.response.map((fixture: { 
        fixture: { id: number; date: string };
        teams: { home: { id: number; name: string }; away: { id: number; name: string } };
        goals: { home: number; away: number };
      }) => {
        const homeGoals = fixture.goals?.home ?? 0;
        const awayGoals = fixture.goals?.away ?? 0;
        const homeId = fixture.teams.home.id;
        
        let result: 'W' | 'D' | 'L';
        if (homeGoals > awayGoals) {
          result = homeId === homeTeamId ? 'W' : 'L';
        } else if (homeGoals < awayGoals) {
          result = homeId === homeTeamId ? 'L' : 'W';
        } else {
          result = 'D';
        }
        
        return {
          id: fixture.fixture.id,
          date: fixture.fixture.date,
          homeTeam: fixture.teams.home.name,
          awayTeam: fixture.teams.away.name,
          homeScore: homeGoals,
          awayScore: awayGoals,
          result,
        };
      });
      
      // Sort matches by date descending (most recent first)
      const sortedMatches = matches.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
      
      let homeWins = 0;
      let awayWins = 0;
      let draws = 0;
      
      sortedMatches.forEach(match => {
        if (match.result === 'W') homeWins++;
        else if (match.result === 'L') awayWins++;
        else draws++;
      });
      
      return {
        matches: sortedMatches,
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

export async function getOdds(fixtureId: number): Promise<Odds | null> {
  try {
    const data = await fetchApi(`/odds?fixture=${fixtureId}`);
    
    if (data && data.response && data.response.length > 0) {
      const firstBookmaker = data.response[1]?.bookmakers?.[0];
      const odds = firstBookmaker?.bets?.find((bet: { id: number }) => bet.id === 1)?.values;
      
      if (odds) {
        const homeWin = odds.find((o: { value: string }) => o.value === 'Home')?.odd;
        const draw = odds.find((o: { value: string }) => o.value === 'Draw')?.odd;
        const awayWin = odds.find((o: { value: string }) => o.value === 'Away')?.odd;
        
        if (homeWin && draw && awayWin) {
          return {
            homeWin: parseFloat(homeWin),
            draw: parseFloat(draw),
            awayWin: parseFloat(awayWin),
          };
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching odds:', error);
    return null;
  }
}
