const API_KEY = '6de216a2927049849b999aa97ee4b1c7';
const BASE_URL = 'https://v3.football.api-sports.io';
const headers = { 'x-apisports-key': API_KEY };

async function testH2H(team1Id, team2Id) {
  console.log(`\nTesting H2H: ${team1Id} vs ${team2Id}`);
  
  // Try different formats
  const urls = [
    `${BASE_URL}/fixtures/headtohead?h2h=${team1Id}-${team2Id}`,
    `${BASE_URL}/fixtures/headtohead?h2h=${team2Id}-${team1Id}`,
    `${BASE_URL}/fixtures?team=${team1Id}-vs-${team2Id}`,
    `${BASE_URL}/fixtures?h2h=${team1Id}-${team2Id}&season=2024`,
  ];
  
  for (const url of urls) {
    console.log('\nTrying:', url);
    try {
      const response = await fetch(url, { headers });
      const data = await response.json();
      console.log('Status:', response.status, 'Results:', data.results);
      if (data.response && data.response.length > 0) {
        console.log('Found', data.response.length, 'matches');
        console.log('First:', data.response[0]?.teams?.home?.name, 'vs', data.response[0]?.teams?.away?.name);
        return data;
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  }
  
  return null;
}

async function testFixtures(teamId) {
  console.log(`\n=== Testing Fixtures for team ${teamId} ===`);
  const url = `${BASE_URL}/fixtures?team=${teamId}&last=5`;
  
  try {
    const response = await fetch(url, { headers });
    const data = await response.json();
    console.log('Status:', response.status, 'Results:', data.results);
    if (data.response && data.response.length > 0) {
      console.log('Found', data.response.length, 'matches');
      data.response.forEach((match, i) => {
        console.log(`${i + 1}. ${match.teams.home.name} ${match.goals.home}-${match.goals.away} ${match.teams.away.name}`);
      });
    }
    return data;
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function runTests() {
  // Manchester United vs Manchester City
  await testH2H(33, 50);
  
  // Liverpool vs Man City
  await testH2H(40, 50);
  
  // Try getting recent fixtures for Man Utd
  await testFixtures(33);
}

runTests();
