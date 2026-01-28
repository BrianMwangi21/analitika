const API_KEY = '6de216a2927049849b999aa97ee4b1c7';
const BASE_URL = 'https://v3.football.api-sports.io';
const headers = { 'x-apisports-key': API_KEY };

async function testBetTypes() {
  // Test with a known fixture that has odds
  const fixtureId = 1208880; // A fixture from the list
  
  try {
    const response = await fetch(`${BASE_URL}/odds?fixture=${fixtureId}`, { headers });
    const data = await response.json();
    
    if (data.response && data.response.length > 0) {
      const bookmaker = data.response[0]?.bookmakers?.[0];
      console.log(`\nBookmaker: ${bookmaker?.name}`);
      console.log('\nAvailable bet types:');
      
      bookmaker?.bets?.forEach(bet => {
        console.log(`  ID ${bet.id}: ${bet.name}`);
        // Show first few values
        if (bet.values && bet.values.length > 0) {
          console.log(`    Example values: ${bet.values.slice(0, 3).map(v => `${v.value}=${v.odd}`).join(', ')}`);
        }
      });
    } else {
      console.log('No odds data available for this fixture');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testBetTypes();
