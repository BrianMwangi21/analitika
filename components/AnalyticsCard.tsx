'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { X } from 'lucide-react';
import { Card, HeadToHead, Odds, ExtendedOdds } from '@/types';
import { getTeamStats, getHeadToHead } from '@/lib/footballApi';
import LoadingCard from './LoadingCard';
import ErrorCard from './ErrorCard';

interface AnalyticsCardProps {
  card: Card;
  onDelete: (id: string) => void;
  onSelectedOddsChange?: (odds: SelectedOdd[]) => void;
}

interface SelectedOdd {
  market: string;
  selection: string;
  value: number;
}

function isExtendedOdds(odds: Odds | ExtendedOdds): odds is ExtendedOdds {
  return 'matchWinner' in odds;
}

export default function AnalyticsCard({ card, onDelete, onSelectedOddsChange }: AnalyticsCardProps) {
  const [h2h, setH2h] = useState<HeadToHead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Track selected odds
  const [selectedOdds, setSelectedOdds] = useState<SelectedOdd[]>([]);
  
  // Track if this is the first render
  const isFirstRender = useRef(true);

  const toggleOdd = (market: string, selection: string, value: number) => {
    setSelectedOdds(prev => {
      const exists = prev.some(
        odd => odd.market === market && odd.selection === selection
      );
      
      if (exists) {
        // Deselect if already selected
        return prev.filter(
          odd => !(odd.market === market && odd.selection === selection)
        );
      } else {
        // Remove any other selection from the same market, then add the new one
        const filtered = prev.filter(odd => odd.market !== market);
        return [...filtered, { market, selection, value }];
      }
    });
  };

  const isSelected = (market: string, selection: string) => {
    return selectedOdds.some(
      odd => odd.market === market && odd.selection === selection
    );
  };

  // Notify parent when selected odds change (skip on first render)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    onSelectedOddsChange?.(selectedOdds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOdds]);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [homeStatsData, awayStatsData, h2hData] = await Promise.all([
        getTeamStats(card.homeTeam!.id),
        getTeamStats(card.awayTeam!.id),
        getHeadToHead(card.homeTeam!.id, card.awayTeam!.id),
      ]);

      // Store stats in localStorage for later analysis if needed
      localStorage.setItem('analitika-stats', JSON.stringify({
        home: homeStatsData,
        away: awayStatsData
      }));
      
      setH2h(h2hData);
    } catch (_err) {
      setError('Failed to load analytics data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [card.homeTeam, card.awayTeam]);

  useEffect(() => {
    if (card.homeTeam && card.awayTeam) {
      fetchAnalytics();
    }
  }, [card.homeTeam, card.awayTeam, fetchAnalytics]);

  const homeWins = h2h?.homeWins || 0;
  const awayWins = h2h?.awayWins || 0;
  const draws = h2h?.draws || 0;
  const totalMatches = homeWins + awayWins + draws;

  // Get odds for display
  const get1X2Odds = (): Odds | null => {
    if (!card.odds) return null;
    if (isExtendedOdds(card.odds)) {
      return card.odds.matchWinner;
    }
    return card.odds;
  };

  const getExtendedOdds = (): ExtendedOdds | null => {
    if (!card.odds) return null;
    return isExtendedOdds(card.odds) ? card.odds : null;
  };

  const odds1X2 = get1X2Odds();
  const extendedOdds = getExtendedOdds();

  return (
    <div className="panel rounded-xl p-4 md:p-6 relative group card-hover animate-slide-up">
      {/* Delete button - larger touch target on mobile */}
      <button
        onClick={() => onDelete(card.id)}
        className="absolute top-2 right-2 md:top-3 md:right-3 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity 
          p-2 rounded-full hover:bg-red-500/20 text-red-300 touch-manipulation"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Selected odds count badge */}
      {selectedOdds.length > 0 && (
        <div className="absolute top-2 left-2 md:top-3 md:left-3 w-6 h-6 flex items-center justify-center bg-[var(--accent)] rounded-full text-xs font-bold text-[#021014]">
          {selectedOdds.length}
        </div>
      )}

      {loading ? (
        <LoadingCard />
      ) : error ? (
        <ErrorCard 
          message={error} 
          onRetry={fetchAnalytics} 
        />
      ) : (
        <>
          {/* League and Time Info */}
          {(card.league || card.time) && (
            <div className="flex items-center justify-center gap-1 md:gap-2 mb-3 md:mb-4 text-[10px] md:text-xs text-white/60 border-b border-white/10 pb-2 md:pb-3">
              {card.leagueLogo && (
                <img src={card.leagueLogo} alt={card.league} className="w-3 h-3 md:w-4 md:h-4 object-contain flex-shrink-0" />
              )}
              <span className="truncate max-w-[60px] md:max-w-none">{card.league}</span>
              {card.league && card.time && <span>•</span>}
              {card.time && (
                <span>
                  {new Date(card.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', timeZoneName: 'short'})}
                </span>
              )}
            </div>
          )}

          {/* Team Header */}
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div className="flex flex-col items-center flex-1 min-w-0">
              <img
                src={card.homeTeam?.logo}
                alt={card.homeTeam?.name}
                className="w-10 h-10 md:w-16 md:h-16 object-contain mb-1 md:mb-2"
              />
              <span className="text-xs md:text-sm text-center text-white truncate w-full px-1">{card.homeTeam?.name}</span>
            </div>
            <div className="text-[var(--accent)] text-xl md:text-2xl font-bold px-2 md:px-4">VS</div>
            <div className="flex flex-col items-center flex-1 min-w-0">
              <img
                src={card.awayTeam?.logo}
                alt={card.awayTeam?.name}
                className="w-10 h-10 md:w-16 md:h-16 object-contain mb-1 md:mb-2"
              />
              <span className="text-xs md:text-sm text-center text-white truncate w-full px-1">{card.awayTeam?.name}</span>
            </div>
          </div>

          {/* Recent Form - Head to Head Results */}
          <div className="mb-3 md:mb-4">
            <h3 className="text-[var(--accent)] text-xs md:text-sm font-semibold mb-1 md:mb-2">Head-to-Head Form</h3>
            <div className="flex justify-between gap-2 md:gap-4">
              <div className="flex gap-[2px] md:gap-1">
                {h2h?.matches.slice(0, 5).reverse().map((match, i) => (
                  <span
                    key={i}
                    className={`w-5 h-5 md:w-6 md:h-6 flex items-center justify-center text-[10px] md:text-xs rounded ${
                      match.result === 'W' ? 'bg-green-500/30 text-green-400' :
                      match.result === 'D' ? 'bg-yellow-500/30 text-yellow-400' :
                      'bg-red-500/30 text-red-400'
                    }`}
                  >
                    {match.result === 'W' ? 'W' : match.result === 'D' ? 'D' : 'L'}
                  </span>
                ))}
              </div>
              <div className="flex gap-[2px] md:gap-1">
                {h2h?.matches.slice(0, 5).reverse().map((match, i) => (
                  <span
                    key={i}
                    className={`w-5 h-5 md:w-6 md:h-6 flex items-center justify-center text-[10px] md:text-xs rounded ${
                      match.result === 'W' ? 'bg-red-500/30 text-red-400' :
                      match.result === 'D' ? 'bg-yellow-500/30 text-yellow-400' :
                      'bg-green-500/30 text-green-400'
                    }`}
                  >
                    {match.result === 'W' ? 'L' : match.result === 'D' ? 'D' : 'W'}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 1X2 Odds */}
          {odds1X2 && (
            <div className="mb-3 md:mb-4 p-2 md:p-3 glass rounded-lg border border-white/10">
              <h3 className="text-[var(--accent)] text-xs md:text-sm font-semibold mb-1 md:mb-2">1X2 Odds</h3>
              <div className="flex justify-between text-center">
                <button
                  onClick={() => toggleOdd('1X2', '1', odds1X2.homeWin)}
                  className={`flex-1 p-1 md:p-2 rounded transition-all odds-tile ${
                    isSelected('1X2', '1') ? 'odds-selected' : ''
                  }`}
                >
                  <div className="text-[10px] md:text-xs text-white/50 mb-1">1</div>
                  <div className="text-white font-bold text-base md:text-lg">{odds1X2.homeWin.toFixed(2)}</div>
                </button>
                <button
                  onClick={() => toggleOdd('1X2', 'X', odds1X2.draw)}
                  className={`flex-1 p-1 md:p-2 rounded transition-all odds-tile ${
                    isSelected('1X2', 'X') ? 'odds-selected' : ''
                  }`}
                >
                  <div className="text-[10px] md:text-xs text-white/50 mb-1">X</div>
                  <div className="text-white font-bold text-base md:text-lg">{odds1X2.draw.toFixed(2)}</div>
                </button>
                <button
                  onClick={() => toggleOdd('1X2', '2', odds1X2.awayWin)}
                  className={`flex-1 p-1 md:p-2 rounded transition-all odds-tile ${
                    isSelected('1X2', '2') ? 'odds-selected' : ''
                  }`}
                >
                  <div className="text-[10px] md:text-xs text-white/50 mb-1">2</div>
                  <div className="text-white font-bold text-base md:text-lg">{odds1X2.awayWin.toFixed(2)}</div>
                </button>
              </div>
            </div>
          )}

          {/* Over/Under 2.5 */}
          {extendedOdds?.overUnder25 && (
            <div className="mb-3 md:mb-4 p-2 md:p-3 glass rounded-lg border border-white/10">
              <h3 className="text-[var(--accent)] text-xs md:text-sm font-semibold mb-1 md:mb-2">Over/Under 2.5</h3>
              <div className="flex justify-between text-center">
                <button
                  onClick={() => toggleOdd('Over/Under 2.5', 'Over', extendedOdds!.overUnder25!.over)}
                  className={`flex-1 p-1 md:p-2 rounded transition-all odds-tile ${
                    isSelected('Over/Under 2.5', 'Over') ? 'odds-selected' : ''
                  }`}
                >
                  <div className="text-[10px] md:text-xs text-white/50 mb-1">Over</div>
                  <div className="text-white font-bold text-base md:text-lg">{extendedOdds.overUnder25.over.toFixed(2)}</div>
                </button>
                <button
                  onClick={() => toggleOdd('Over/Under 2.5', 'Under', extendedOdds!.overUnder25!.under)}
                  className={`flex-1 p-1 md:p-2 rounded transition-all odds-tile ${
                    isSelected('Over/Under 2.5', 'Under') ? 'odds-selected' : ''
                  }`}
                >
                  <div className="text-[10px] md:text-xs text-white/50 mb-1">Under</div>
                  <div className="text-white font-bold text-base md:text-lg">{extendedOdds.overUnder25.under.toFixed(2)}</div>
                </button>
              </div>
            </div>
          )}

          {/* BTTS */}
          {extendedOdds?.btts && (
            <div className="mb-3 md:mb-4 p-2 md:p-3 glass rounded-lg border border-white/10">
              <h3 className="text-[var(--accent)] text-xs md:text-sm font-semibold mb-1 md:mb-2">Both Teams To Score</h3>
              <div className="flex justify-between text-center">
                <button
                  onClick={() => toggleOdd('BTTS', 'Yes', extendedOdds!.btts!.yes)}
                  className={`flex-1 p-1 md:p-2 rounded transition-all odds-tile ${
                    isSelected('BTTS', 'Yes') ? 'odds-selected' : ''
                  }`}
                >
                  <div className="text-[10px] md:text-xs text-white/50 mb-1">Yes</div>
                  <div className="text-white font-bold text-base md:text-lg">{extendedOdds.btts.yes.toFixed(2)}</div>
                </button>
                <button
                  onClick={() => toggleOdd('BTTS', 'No', extendedOdds!.btts!.no)}
                  className={`flex-1 p-1 md:p-2 rounded transition-all odds-tile ${
                    isSelected('BTTS', 'No') ? 'odds-selected' : ''
                  }`}
                >
                  <div className="text-[10px] md:text-xs text-white/50 mb-1">No</div>
                  <div className="text-white font-bold text-base md:text-lg">{extendedOdds.btts.no.toFixed(2)}</div>
                </button>
              </div>
            </div>
          )}

          {/* Head to Head */}
          <div className="mb-3 md:mb-4">
            <h3 className="text-[var(--accent)] text-xs md:text-sm font-semibold mb-1 md:mb-2">Head to Head</h3>
            <div className="flex justify-between text-xs md:text-sm text-white/80">
              <span>Home: {homeWins}</span>
              <span>Draws: {draws}</span>
              <span>Away: {awayWins}</span>
            </div>
          </div>

          {/* Last Matches */}
          {h2h?.matches.slice(0, 3).map((match) => (
            <div
              key={match.id}
              className="flex justify-between items-center py-1 md:py-2 text-[10px] md:text-xs text-white/70 border-b border-white/10 last:border-0"
            >
              <span className="truncate w-[40%]">{match.homeTeam}</span>
              <span className="text-[var(--accent)] font-semibold flex-shrink-0 px-1">
                {match.homeScore} - {match.awayScore}
              </span>
              <span className="truncate w-[40%] text-right">{match.awayTeam}</span>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
