'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Brain, AlertTriangle, Loader2, Github } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

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

interface AnalysisResult {
  analysis: string;
  confidence: 'high' | 'medium' | 'low';
  recommendation: string;
  riskLevel: 'low' | 'medium' | 'high';
}

export default function AnalysisPage() {
  const router = useRouter();
  const [selectedOdds, setSelectedOdds] = useState<SelectedOdd[]>([]);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Generate cache key from selected odds
  const getCacheKey = (odds: SelectedOdd[]) => {
    const sortedOdds = [...odds].sort((a, b) => a.cardId.localeCompare(b.cardId));
    return `analitika-analysis-cache-${JSON.stringify(sortedOdds.map(o => ({
      cardId: o.cardId,
      market: o.market,
      selection: o.selection
    })))}`;
  };

  const loadAndAnalyze = async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const savedOdds = localStorage.getItem('analitika-selected-odds');
      if (!savedOdds) {
        setError('No odds selected for analysis');
        setLoading(false);
        return;
      }

      const parsedOdds: SelectedOdd[] = JSON.parse(savedOdds);
      if (parsedOdds.length < 2) {
        setError('Please select at least 2 odds before analyzing');
        setLoading(false);
        return;
      }

      setSelectedOdds(parsedOdds);

      // Check cache first (unless force refresh)
      if (!forceRefresh) {
        const cacheKey = getCacheKey(parsedOdds);
        const cachedResult = localStorage.getItem(cacheKey);
        if (cachedResult) {
          try {
            const parsedCache = JSON.parse(cachedResult);
            // Check if cache is less than 1 hour old
            const cacheAge = Date.now() - parsedCache.timestamp;
            if (cacheAge < 3600000) { // 1 hour
              setAnalysis(parsedCache.data);
              setLoading(false);
              return;
            }
          } catch {
            // Invalid cache, continue to fetch
          }
        }
      }
      
      // Get team stats from localStorage
      let teamStats = null;
      try {
        const statsData = localStorage.getItem('analitika-stats');
        if (statsData) {
          teamStats = JSON.parse(statsData);
        }
      } catch {
        // Stats not available
      }

      // Call API route
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectedOdds: parsedOdds,
          teamStats,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze odds');
      }

      const result = await response.json();
      
      // Cache the result
      const cacheKey = getCacheKey(parsedOdds);
      localStorage.setItem(cacheKey, JSON.stringify({
        data: result,
        timestamp: Date.now()
      }));
      
      setAnalysis(result);
      setLoading(false);
    } catch (err) {
      console.error('Error during analysis:', err);
      setError(err instanceof Error ? err.message : 'Failed to analyze odds');
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    loadAndAnalyze();
  }, []);

  const handleRefresh = () => {
    loadAndAnalyze(true);
  };

  const handleBack = () => router.push('/');

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'text-green-400 border-green-400';
      case 'medium': return 'text-yellow-400 border-yellow-400';
      case 'low': return 'text-red-400 border-red-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen text-white">
      <header className="w-full py-5 md:py-7 px-4 border-b border-white/10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button onClick={handleBack} className="flex items-center gap-2 text-white/70 hover:text-white">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </button>
          <h1 className="font-display text-xl md:text-2xl text-holo">Analysis</h1>
          <div className="w-[100px]" />
        </div>
      </header>

      <main className="px-4 py-6 md:py-8">
        <div className="max-w-4xl mx-auto">
          {loading && (
            <div className="panel rounded-xl p-8 md:p-12 text-center">
              <Loader2 className="w-8 h-8 mx-auto mb-4 text-[var(--accent)] animate-spin" />
              <h2 className="font-display text-[var(--accent)] text-lg font-semibold mb-2">Analyzing Your Selections</h2>
              <p className="text-white/50 text-sm">Bazu wetu is crunching the numbers and reading the vibe...</p>
            </div>
          )}

          {error && !loading && (
            <div className="panel rounded-xl p-8 md:p-12 text-center border border-red-500/30">
              <AlertTriangle className="w-8 h-8 mx-auto mb-4 text-red-400" />
              <h2 className="text-red-400 text-lg font-semibold mb-2">Analysis Failed</h2>
              <p className="text-white/70 text-sm mb-6">{error}</p>
              <button onClick={handleRefresh} className="px-6 py-2 bg-red-500/20 text-red-400 rounded-lg border border-red-500/30 hover:bg-red-500/30 transition-colors">
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && analysis && (
            <div className="space-y-6 mb-6">
              <div className="panel rounded-xl p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 text-center p-3">
                    <span className="text-xs text-white/50 block mb-1">Confidence</span>
                    <span className={`text-xl font-bold capitalize ${getConfidenceColor(analysis.confidence)}`}>
                      {analysis.confidence}
                    </span>
                  </div>
                  
                  <div className="w-px h-16 bg-white/20 mx-4" />
                  
                  <div className="flex-1 text-center p-3">
                    <span className="text-xs text-white/50 block mb-1">Risk Level</span>
                    <span className={`text-xl font-bold capitalize ${analysis.riskLevel === 'low' ? 'text-green-400' : analysis.riskLevel === 'medium' ? 'text-yellow-400' : 'text-red-400'}`}>
                      {analysis.riskLevel}
                    </span>
                  </div>
                </div>
              </div>

              <div className="panel rounded-xl p-4 md:p-6">
                <h3 className="text-[var(--accent)] text-sm font-semibold mb-3">Analysis</h3>
                <div className="text-white/90 text-sm leading-relaxed prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown>{analysis.analysis}</ReactMarkdown>
                </div>
              </div>

              <div className="panel rounded-xl p-4 md:p-6">
                <h3 className="text-[var(--accent)] text-sm font-semibold mb-3">Recommendation</h3>
                <div className="text-white/90 text-sm leading-relaxed prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown>{analysis.recommendation}</ReactMarkdown>
                </div>
              </div>

              <div className="flex justify-center pt-4">
                <button
                  onClick={handleRefresh}
                  className="px-4 py-2 text-sm btn-ghost rounded-lg transition-colors"
                >
                  Refresh Analysis
                </button>
              </div>

              <div className="panel rounded-xl p-4 md:p-6">
                <div className="flex items-start gap-3">
                  <div className="w-1 h-1 mt-2 rounded-full bg-[var(--accent)]/60 flex-shrink-0" />
                  <p className="text-white/50 text-xs leading-relaxed">
                    AI can make mistakes. This analysis is generated by an AI model and should be used as guidance, not financial advice. Always do your own research and bet responsibly.
                  </p>
                </div>
              </div>

              {selectedOdds.length > 0 && (
                <div className="panel rounded-xl p-4 md:p-6 mt-6">
                  <h2 className="text-[var(--accent)] text-sm font-semibold mb-4 flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    Selected Odds ({selectedOdds.length})
                  </h2>
                  
                  <div className="space-y-2">
                    {selectedOdds.map((odd, index) => (
                      <div key={`${odd.cardId}-${odd.market}-${odd.selection}`} className="flex items-center justify-between py-2 px-3 rounded bg-white/5 border border-white/10">
                        <div className="flex items-center gap-2 text-xs md:text-sm">
                          <span className="text-white/40">{index + 1}.</span>
                          <span className="text-white">{odd.homeTeam?.name || 'Home'} vs {odd.awayTeam?.name || 'Away'}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs">
                          <span className="text-white/60">{odd.market}</span>
                          <span className="text-white font-bold">{odd.selection}</span>
                          <span className="text-[var(--accent)] font-mono">@{odd.value.toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <footer className="w-full py-6 px-4 border-t border-white/10 mt-8">
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center gap-3">
          <span className="text-white/60 text-sm">
            Made with <span className="text-red-300">love</span> by Kabiru
          </span>
          <a
            href="https://github.com/BrianMwangi21/analitika"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
          >
            <Github className="w-4 h-4" />
            <span>GitHub</span>
          </a>
        </div>
      </footer>
    </div>
  );
}
