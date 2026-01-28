import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { generateText } from 'ai';

// Initialize OpenRouter client
const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY || '',
});

// Use the specified free model
const MODEL_NAME = 'tngtech/tng-r1t-chimera:free';

interface SelectedOdd {
  market: string;
  selection: string;
  value: number;
  cardId: string;
  homeTeam?: {
    id: number;
    name: string;
    logo: string;
  };
  awayTeam?: {
    id: number;
    name: string;
    logo: string;
  };
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

interface AnalysisResult {
  analysis: string;
  confidence: 'high' | 'medium' | 'low';
  recommendation: string;
  riskLevel: 'low' | 'medium' | 'high';
}

/**
 * Analyze selected odds using LLM
 * @param selectedOdds - Array of selected odds from different matches
 * @returns Analysis result with insights and recommendations
 */
export async function analyzeOdds(selectedOdds: SelectedOdd[]): Promise<AnalysisResult> {
  try {
    if (!selectedOdds || selectedOdds.length < 2) {
      throw new Error('At least 2 odds must be selected for analysis');
    }

    // Get team stats from localStorage
    let teamStats: { home?: TeamStats; away?: TeamStats } | null = null;
    try {
      const statsData = localStorage.getItem('analitika-stats');
      if (statsData) {
        teamStats = JSON.parse(statsData);
      }
    } catch {
      // Stats not available, continue without them
    }

    // Build the prompt
    const prompt = buildAnalysisPrompt(selectedOdds, teamStats);

    // Call OpenRouter API
    const result = await generateText({
      model: openrouter(MODEL_NAME),
      prompt,
      temperature: 0.7,
    });

    // Parse the response
    return parseAnalysisResponse(result.text);
  } catch (error) {
    console.error('Error analyzing odds:', error);
    
    // Handle rate limiting
    if (error instanceof Error && error.message.includes('rate limit')) {
      throw new Error('Rate limit exceeded. Please try again in a few moments.');
    }
    
    // Handle API errors
    if (error instanceof Error && error.message.includes('API')) {
      throw new Error('API error occurred. Please check your API key and try again.');
    }
    
    // Return fallback response
    return {
      analysis: 'Unable to generate analysis at this time. Please try again later.',
      confidence: 'low',
      recommendation: 'No recommendation available due to analysis error.',
      riskLevel: 'high',
    };
  }
}

/**
 * Build analysis prompt from selected odds and team stats
 */
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

  return `You are a football betting analyst with expertise in statistical analysis and odds evaluation.

Analyze the following selected betting odds and provide insights:

SELECTED ODDS:
${oddsDescription}
${statsDescription}

Please provide your analysis in the following format:

ANALYSIS: [Your detailed analysis of the selected odds, considering team form, head-to-head history, and value in the odds]

CONFIDENCE: [high/medium/low]

RECOMMENDATION: [Your specific betting recommendation based on the analysis]

RISK LEVEL: [low/medium/high]

Be objective and base your analysis on the data provided. Consider factors like:
- Odds value and implied probability
- Team form and recent performance
- Head-to-head history
- Risk vs reward ratio`;
}

/**
 * Parse the LLM response into structured format
 */
function parseAnalysisResponse(text: string): AnalysisResult {
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

/**
 * Check if the API key is configured
 */
export function isLLMConfigured(): boolean {
  return !!process.env.OPENROUTER_API_KEY;
}
