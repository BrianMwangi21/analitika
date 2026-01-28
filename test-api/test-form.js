const API_KEY = '6de216a2927049849b999aa97ee4b1c7';
const BASE_URL = 'https://v3.football.api-sports.io';
const headers = { 'x-apisports-key': API_KEY };

async function testTeamForm(teamId, teamName) {
  console.log(`\nTesting ${teamName} (ID: ${teamId}) form...\n`);
  
  const url = `${BASE_URL}/teams/statistics?team=${teamId}&season=2024&league=39`;
  
  try {
    const response = await fetch(url, { headers });
    const data = await response.json();
    
    if (data.response) {
      const form = data.response.form;
      console.log(`${teamName} form string: "${form}"`);
      console.log(`Form length: ${form?.length || 0}`);
      
      if (form) {
        console.log('\nCharacter positions:');
        const chars = form.split('');
        chars.forEach((char, i) => {
          const position = i + 1;
          console.log(`  Position ${position} (index ${i}): ${char}`);
        });
        
        console.log('\nInterpretation:');
        console.log(`  Leftmost (position 1): ${chars[0]} - Oldest game`);
        console.log(`  Rightmost (position ${chars.length}): ${chars[chars.length - 1]} - Latest game`);
      }
    } else {
      console.log('No data found');
      console.log('Errors:', data.errors);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function runTests() {
  await testTeamForm(33, 'Manchester United');
  await testTeamForm(42, 'Arsenal');
}

runTests();
