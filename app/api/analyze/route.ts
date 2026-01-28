import { NextRequest, NextResponse } from 'next/server';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { generateText } from 'ai';

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY || '',
});

const MODEL_NAME = 'tngtech/tng-r1t-chimera:free';

interface SelectedOdd {
  market: string;
  selection: string;
  value: number;
  cardId: string;
  homeTeam?: { id: number; name: string; logo: string };
  awayTeam?: { id: number; name: string; logo: string };
  fixtureId?: number;
}

interface TeamStats {
  form: string[];
  leaguePosition: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { selectedOdds, teamStats } = body as {
      selectedOdds: SelectedOdd[];
      teamStats: { home?: TeamStats; away?: TeamStats } | null;
    };

    if (!selectedOdds || selectedOdds.length < 2) {
      return NextResponse.json(
        { error: 'At least 2 odds must be selected for analysis' },
        { status: 400 }
      );
    }

    const prompt = buildAnalysisPrompt(selectedOdds, teamStats);

    const result = await generateText({
      model: openrouter(MODEL_NAME),
      prompt,
      temperature: 0.7,
    });

    const analysisResult = parseAnalysisResponse(result.text);

    return NextResponse.json(analysisResult);
  } catch (error) {
    console.error('Error in analyze API:', error);
    
    if (error instanceof Error && error.message.includes('rate limit')) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again in a few moments.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to analyze odds. Please try again later.' },
      { status: 500 }
    );
  }
}

function buildAnalysisPrompt(
  selectedOdds: SelectedOdd[],
  teamStats: { home?: TeamStats; away?: TeamStats } | null
): string {
  const oddsDescription = selectedOdds
    .map((odd, index) => {
      const match = `${odd.homeTeam?.name || 'Home Team'} vs ${odd.awayTeam?.name || 'Away Team'}`;
      return `${index + 1}. ${match}: ${odd.market} - ${odd.selection} @ ${odd.value.toFixed(2)}`;
    })
    .join('\n');

  let statsDescription = '';
  if (teamStats) {
    if (teamStats.home) {
      statsDescription += `\n\nHome Team Stats:\n`;
      statsDescription += `- Form: ${teamStats.home.form?.join('') || 'N/A'}\n`;
      statsDescription += `- League Position: ${teamStats.home.leaguePosition}\n`;
      statsDescription += `- Record: ${teamStats.home.wins}W-${teamStats.home.draws}D-${teamStats.home.losses}L\n`;
      statsDescription += `- Goals: ${teamStats.home.goalsFor} scored, ${teamStats.home.goalsAgainst} conceded\n`;
    }
    if (teamStats.away) {
      statsDescription += `\nAway Team Stats:\n`;
      statsDescription += `- Form: ${teamStats.away.form?.join('') || 'N/A'}\n`;
      statsDescription += `- League Position: ${teamStats.away.leaguePosition}\n`;
      statsDescription += `- Record: ${teamStats.away.wins}W-${teamStats.away.draws}D-${teamStats.away.losses}L\n`;
      statsDescription += `- Goals: ${teamStats.away.goalsFor} scored, ${teamStats.away.goalsAgainst} conceded\n`;
    }
  }

  return `You are a Kenyan football betting analyst from the streets of Nairobi. You're analytical and knowledgeable about the game. Mix professional analysis with a friendly conversational tone - about 50% analytical/business, 50% street slang and humor. Think of it like discussing matches with a smart friend who uses both proper analysis and slang.

Style guidelines (keep it balanced):
- Use analytical language mixed with Kenyan slang naturally
- Throw in occasional phrases like "mazematic," "form yao," "bure," "kubwa" but don't overdo it
- Be smart and informed first, witty second
- Keep it real and conversational like talking to a friend at the base
- Call out red flags when you see them - "hii ni red flag kubwa"
- Balance: half analytical insight, half street wisdom
- Mix proper betting terms with casual slang
- Don't be afraid to be skeptical - "hii inanuka funny"
- Encourage smart betting - "usirushie pesa zako zote"

Analyze the following selected betting odds and provide insights:

SELECTED ODDS:
${oddsDescription}
${statsDescription}

Please provide your analysis in the following format:

ANALYSIS: [Mix of solid stats/analytical insights and Kenyan street wisdom. About 50/50 analytical vs casual slang]

CONFIDENCE: [high/medium/low]

RECOMMENDATION: [Professional betting advice with casual friendly tone, some slang allowed]

RISK LEVEL: [low/medium/high]

Remember: Be knowledgeable and analytical, but keep it conversational. Smart advice mixed with street vibes - not too much slang.`;
}

function parseAnalysisResponse(text: string) {
  const analysisMatch = text.match(/ANALYSIS:\s*([\s\S]*?)(?=CONFIDENCE:|$)/i);
  const confidenceMatch = text.match(/CONFIDENCE:\s*(high|medium|low)/i);
  const recommendationMatch = text.match(/RECOMMENDATION:\s*([\s\S]*?)(?=RISK LEVEL:|$)/i);
  const riskLevelMatch = text.match(/RISK LEVEL:\s*(low|medium|high)/i);

  return {
    analysis: analysisMatch?.[1]?.trim() || 'No analysis provided.',
    confidence: (confidenceMatch?.[1]?.toLowerCase() as 'high' | 'medium' | 'low') || 'medium',
    recommendation: recommendationMatch?.[1]?.trim() || 'No recommendation provided.',
    riskLevel: (riskLevelMatch?.[1]?.toLowerCase() as 'low' | 'medium' | 'high') || 'medium',
  };
}
