import fetchApi from './api';
import { Team, TeamStats, HeadToHead, Match, Odds, ExtendedOdds, Fixture } from '@/types';

export async function getTodaysFixtures(): Promise<Fixture[]> {
  try {
    const today = new Date().toISOString().split('T')[0];
    const data = await fetchApi(`/fixtures?date=${today}`);
    
    if (data && data.response) {
      const fixtures: Fixture[] = data.response.map((fixture: any) => ({
        id: fixture.fixture.id,
        date: today,
        time: fixture.fixture.date,
        homeTeam: {
          id: fixture.teams.home.id,
          name: fixture.teams.home.name,
          logo: fixture.teams.home.logo,
        },
        awayTeam: {
          id: fixture.teams.away.id,
          name: fixture.teams.away.name,
          logo: fixture.teams.away.logo,
        },
        odds: { homeWin: 0, draw: 0, awayWin: 0 },
        league: fixture.league.name,
        leagueLogo: fixture.league.logo,
      }));
      
      return fixtures;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching today\'s fixtures:', error);
    return [];
  }
}

export async function getFixtureOdds(fixtureId: number): Promise<ExtendedOdds | null> {
  try {
    const data = await fetchApi(`/odds?fixture=${fixtureId}`);
    
    if (data && data.response && data.response.length > 0) {
      const firstBookmaker = data.response[0]?.bookmakers?.[0];
      const bets = firstBookmaker?.bets || [];
      
      const matchWinnerBet = bets.find((bet: any) => bet.id === 1)?.values;
      const matchWinner = matchWinnerBet ? {
        homeWin: parseFloat(matchWinnerBet.find((o: any) => o.value === 'Home')?.odd) || 0,
        draw: parseFloat(matchWinnerBet.find((o: any) => o.value === 'Draw')?.odd) || 0,
        awayWin: parseFloat(matchWinnerBet.find((o: any) => o.value === 'Away')?.odd) || 0,
      } : { homeWin: 0, draw: 0, awayWin: 0 };
      
      const overUnderBet = bets.find((bet: any) => bet.id === 5)?.values;
      const overUnder25 = overUnderBet ? {
        over: parseFloat(overUnderBet.find((o: any) => o.value === 'Over 2.5')?.odd) || 0,
        under: parseFloat(overUnderBet.find((o: any) => o.value === 'Under 2.5')?.odd) || 0,
      } : null;
      
      const bttsBet = bets.find((bet: any) => bet.id === 8)?.values;
      const btts = bttsBet ? {
        yes: parseFloat(bttsBet.find((o: any) => o.value === 'Yes')?.odd) || 0,
        no: parseFloat(bttsBet.find((o: any) => o.value === 'No')?.odd) || 0,
      } : null;
      
      return {
        matchWinner,
        overUnder25,
        btts,
        doubleChance: { homeOrDraw: 0, homeOrAway: 0, drawOrAway: 0 },
        exactScore: [],
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching fixture odds:', error);
    return null;
  }
}

export async function searchTeams(query: string): Promise<Team[]> {
  try {
    const data = await fetchApi(`/teams?search=${encodeURIComponent(query)}`);
    
    if (data && data.response) {
      return data.response.map((item: any) => ({
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
      const matches: Match[] = data.response.map((fixture: any) => {
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
