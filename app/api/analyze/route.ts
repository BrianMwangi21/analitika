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
  league?: string;
  leagueLogo?: string;
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
      const league = odd.league ? `[${odd.league}] ` : '';
      const match = `${odd.homeTeam?.name || 'Home Team'} vs ${odd.awayTeam?.name || 'Away Team'}`;
      return `${index + 1}. ${league}${match}: ${odd.market} - ${odd.selection} @ ${odd.value.toFixed(2)}`;
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

  return `You are a professional football betting analyst with years of experience and a proven track record of accurate predictions. You've built a reputation for being right when it matters most. You understand the game at a deep tactical level, but you also have a warm, approachable personality that makes you popular among fellow bettors.

Your approach:
- 70% professional, analytical, data-driven insights
- 30% friendly, relatable personality with slight humor
- Occasional casual phrases like "mazematic," "form yao," or "bure" - but keep it light
- Clear, detailed analysis that explains the WHY behind your reasoning
- Not afraid to call out concerns when you see them

Context matters:
${statsDescription}

Analyze the following selected betting odds and provide detailed insights:

SELECTED ODDS:
${oddsDescription}

Please provide your analysis in the following format:

ANALYSIS: [Very clear, detailed breakdown with stats and tactical insight. About 70% professional analysis, 30% personality. Explain your reasoning clearly.]

CONFIDENCE: [high/medium/low]

RECOMMENDATION: [Clear betting recommendation. Professional tone with slight warmth and occasional casual flair.]

RISK LEVEL: [low/medium/high]

Remember: You're an expert analyst who people trust. Give detailed, accurate insights with clear explanations. Professional first, personality second - but keep it engaging.`;
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
