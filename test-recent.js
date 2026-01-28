const API_KEY = '6de216a2927049849b999aa97ee4b1c7';
const BASE_URL = 'https://v3.football.api-sports.io';
const headers = { 'x-apisports-key': API_KEY };

async function testRecentMatches() {
  console.log('Testing Man Utd (33) vs Arsenal (42) recent matches...\n');
  
  const url = `${BASE_URL}/fixtures/headtohead?h2h=33-42`;
  
  try {
    const response = await fetch(url, { headers });
    const data = await response.json();
    
    console.log('Total matches found:', data.results);
    console.log('\nLast 5 matches (most recent first):');
    
    if (data.response?.length > 0) {
      // Sort by date descending (most recent first)
      const sortedMatches = data.response.sort((a, b) => {
        return new Date(b.fixture.date) - new Date(a.fixture.date);
      });
      
      sortedMatches.slice(0, 5).forEach((match, i) => {
        const date = new Date(match.fixture.date).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        });
        console.log(`${i + 1}. ${date}: ${match.teams.home.name} ${match.goals.home}-${match.goals.away} ${match.teams.away.name}`);
      });
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testRecentMatches();
