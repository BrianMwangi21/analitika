'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Card, Team, TeamStats, HeadToHead, Odds } from '@/types';
import { getTeamStats, getHeadToHead } from '@/lib/footballApi';
import LoadingCard from './LoadingCard';
import ErrorCard from './ErrorCard';

interface AnalyticsCardProps {
  card: Card;
  onDelete: (id: string) => void;
}

export default function AnalyticsCard({ card, onDelete }: AnalyticsCardProps) {
  const [homeStats, setHomeStats] = useState<TeamStats | null>(null);
  const [awayStats, setAwayStats] = useState<TeamStats | null>(null);
  const [h2h, setH2h] = useState<HeadToHead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (card.homeTeam && card.awayTeam) {
      fetchAnalytics();
    }
  }, [card.homeTeam, card.awayTeam]);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [homeStatsData, awayStatsData, h2hData] = await Promise.all([
        getTeamStats(card.homeTeam!.id),
        getTeamStats(card.awayTeam!.id),
        getHeadToHead(card.homeTeam!.id, card.awayTeam!.id),
      ]);

      setHomeStats(homeStatsData);
      setAwayStats(awayStatsData);
      setH2h(h2hData);
    } catch (err) {
      setError('Failed to load analytics data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const homeWins = h2h?.homeWins || 0;
  const awayWins = h2h?.awayWins || 0;
  const draws = h2h?.draws || 0;
  const totalMatches = homeWins + awayWins + draws;

  return (
    <div className="glass rounded-xl p-6 relative group card-hover animate-slide-up">
      {/* Delete button */}
      <button
        onClick={() => onDelete(card.id)}
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity 
          p-1 rounded-full hover:bg-red-500/20 text-red-400"
      >
        <X className="w-5 h-5" />
      </button>

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
            <div className="flex items-center justify-center gap-2 mb-4 text-xs text-[#00d4ff]/70 border-b border-[#00d4ff]/10 pb-3">
              {card.leagueLogo && (
                <img src={card.leagueLogo} alt={card.league} className="w-4 h-4 object-contain" />
              )}
              <span>{card.league}</span>
              {card.league && card.time && <span>•</span>}
              {card.time && (
                <span>
                  {new Date(card.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', timeZoneName: 'short'})}
                </span>
              )}
            </div>
          )}

          {/* Team Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex flex-col items-center">
              <img
                src={card.homeTeam?.logo}
                alt={card.homeTeam?.name}
                className="w-16 h-16 object-contain mb-2"
              />
              <span className="text-sm text-center text-white">{card.homeTeam?.name}</span>
            </div>
            <div className="text-[#00d4ff] text-2xl font-bold">VS</div>
            <div className="flex flex-col items-center">
              <img
                src={card.awayTeam?.logo}
                alt={card.awayTeam?.name}
                className="w-16 h-16 object-contain mb-2"
              />
              <span className="text-sm text-center text-white">{card.awayTeam?.name}</span>
            </div>
          </div>

          {/* Recent Form - Head to Head Results */}
          <div className="mb-4">
            <h3 className="text-[#00d4ff] text-sm font-semibold mb-2">Head-to-Head Form</h3>
            <div className="flex justify-between gap-4">
              <div className="flex gap-1">
                {h2h?.matches.slice(0, 5).reverse().map((match, i) => (
                  <span
                    key={i}
                    className={`w-6 h-6 flex items-center justify-center text-xs rounded ${
                      match.result === 'W' ? 'bg-green-500/30 text-green-400' :
                      match.result === 'D' ? 'bg-yellow-500/30 text-yellow-400' :
                      'bg-red-500/30 text-red-400'
                    }`}
                  >
                    {match.result === 'W' ? 'W' : match.result === 'D' ? 'D' : 'L'}
                  </span>
                ))}
              </div>
              <div className="flex gap-1">
                {h2h?.matches.slice(0, 5).reverse().map((match, i) => (
                  <span
                    key={i}
                    className={`w-6 h-6 flex items-center justify-center text-xs rounded ${
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

          {/* Odds Section */}
          {card.odds && (
            <div className="mb-4 p-3 glass rounded-lg border border-[#00d4ff]/20">
              <h3 className="text-[#00d4ff] text-sm font-semibold mb-2">Today's Odds</h3>
              <div className="flex justify-between text-center">
                <div className="flex-1">
                  <div className="text-xs text-[#00d4ff]/50 mb-1">1</div>
                  <div className="text-white font-bold text-lg">{card.odds.homeWin.toFixed(2)}</div>
                </div>
                <div className="flex-1">
                  <div className="text-xs text-[#00d4ff]/50 mb-1">X</div>
                  <div className="text-white font-bold text-lg">{card.odds.draw.toFixed(2)}</div>
                </div>
                <div className="flex-1">
                  <div className="text-xs text-[#00d4ff]/50 mb-1">2</div>
                  <div className="text-white font-bold text-lg">{card.odds.awayWin.toFixed(2)}</div>
                </div>
              </div>
            </div>
          )}

          {/* Head to Head */}
          <div className="mb-4">
            <h3 className="text-[#00d4ff] text-sm font-semibold mb-2">Head to Head</h3>
            <div className="flex justify-between text-sm text-white">
              <span>Home Wins: {homeWins}</span>
              <span>Draws: {draws}</span>
              <span>Away Wins: {awayWins}</span>
            </div>
          </div>

          {/* Last Matches */}
          {h2h?.matches.slice(0, 3).map((match) => (
            <div
              key={match.id}
              className="flex justify-between items-center py-2 text-xs text-white/70 border-b border-[#00d4ff]/10 last:border-0"
            >
              <span className="truncate w-1/3">{match.homeTeam}</span>
              <span className="text-[#00d4ff] font-semibold">
                {match.homeScore} - {match.awayScore}
              </span>
              <span className="truncate w-1/3 text-right">{match.awayTeam}</span>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
