const API_KEY = '6de216a2927049849b999aa97ee4b1c7';
const BASE_URL = 'https://v3.football.api-sports.io';
const headers = { 'x-apisports-key': API_KEY };

async function testAll() {
  console.log('Testing API endpoints...\n');
  
  // Test 1: Search Teams
  console.log('1. Testing Search Teams (Manchester United):');
  const searchRes = await fetch(`${BASE_URL}/teams?search=Manchester`, { headers });
  const searchData = await searchRes.json();
  console.log('  Status:', searchRes.status);
  console.log('  Teams found:', searchData.results);
  console.log('  First team:', searchData.response[0]?.team?.name);
  
  const manUtdId = 33;
  const manCityId = 50;
  
  // Test 2: Team Stats
  console.log('\n2. Testing Team Stats (Man Utd):');
  const statsRes = await fetch(`${BASE_URL}/teams/statistics?team=${manUtdId}&season=2024&league=39`, { headers });
  const statsData = await statsRes.json();
  console.log('  Status:', statsRes.status);
  console.log('  Has data:', !!statsData.response);
  console.log('  Team:', statsData.response?.team?.name);
  
  // Test 3: Head-to-Head
  console.log('\n3. Testing Head to Head (Man Utd vs Man City):');
  const h2hRes = await fetch(`${BASE_URL}/fixtures/headtohead?h2h=${manUtdId}-${manCityId}`, { headers });
  const h2hData = await h2hRes.json();
  console.log('  Status:', h2hRes.status);
  console.log('  Matches:', h2hData.results);
  console.log('  First match:', h2hData.response[0]?.teams?.home?.name, 'vs', h2hData.response[0]?.teams?.away?.name);
  
  // Test 4: Odds
  console.log('\n4. Testing Odds:');
  const oddsRes = await fetch(`${BASE_URL}/odds?fixture=867946`, { headers });
  const oddsData = await oddsRes.json();
  console.log('  Status:', oddsRes.status);
  console.log('  Has data:', !!oddsData.response);
  if (oddsData.response?.[0]) {
    console.log('  Bookmaker:', oddsData.response[0].bookmakers?.[0]?.name);
  }
  
  console.log('\nAll tests completed!');
}

testAll();
