const API_KEY = '6de216a2927049849b999aa97ee4b1c7';
const BASE_URL = 'https://v3.football.api-sports.io';
const headers = { 'x-apisports-key': API_KEY };

async function getFixturesWithOdds() {
  const today = new Date().toISOString().split('T')[0];
  
  try {
    // Get today's fixtures
    const fixturesRes = await fetch(`${BASE_URL}/fixtures?date=${today}`, { headers });
    const fixturesData = await fixturesRes.json();
    
    if (fixturesData.response && fixturesData.response.length > 0) {
      // Get odds for first fixture
      const fixtureId = fixturesData.response[0].fixture.id;
      console.log(`Testing fixture ID: ${fixtureId}`);
      
      const oddsRes = await fetch(`${BASE_URL}/odds?fixture=${fixtureId}`, { headers });
      const oddsData = await oddsRes.json();
      
      if (oddsData.response && oddsData.response.length > 0) {
        const bookmaker = oddsData.response[0]?.bookmakers?.[0];
        console.log(`\nBookmaker: ${bookmaker?.name}`);
        console.log('\nAvailable bet types:');
        
        bookmaker?.bets?.forEach(bet => {
          console.log(`\n  ID ${bet.id}: ${bet.name}`);
          if (bet.values && bet.values.length > 0) {
            console.log(`    Values: ${bet.values.map(v => `${v.value}=${v.odd}`).join(', ')}`);
          }
        });
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

getFixturesWithOdds();
