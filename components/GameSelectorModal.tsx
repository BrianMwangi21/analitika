'use client';

import { useState, useEffect } from 'react';
import { X, Calendar } from 'lucide-react';
import { Fixture } from '@/types';
import { getTodaysFixtures } from '@/lib/footballApi';

interface GameSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectGame: (fixture: Fixture) => void;
}

export default function GameSelectorModal({ isOpen, onClose, onSelectGame }: GameSelectorModalProps) {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (isOpen) {
      fetchFixtures();
    }
  }, [isOpen, selectedDate]);

  const fetchFixtures = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const games = await getTodaysFixtures();
      setFixtures(games);
    } catch (err) {
      setError('Failed to load games');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative glass rounded-xl p-6 w-full max-w-2xl mx-4 animate-slide-up max-h-[80vh] overflow-hidden flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#00d4ff]/60 hover:text-[#00d4ff] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-gradient mb-4">
          Select Today's Game
        </h2>

        {/* Date selector */}
        <div className="mb-4">
          <div className="flex items-center gap-2 glass rounded-lg p-2">
            <Calendar className="w-5 h-5 text-[#00d4ff]" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-white focus:outline-none"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-pulse text-[#00d4ff]">Loading games...</div>
          </div>
        ) : error ? (
          <div className="text-red-400 text-center py-8">{error}</div>
        ) : fixtures.length === 0 ? (
          <div className="text-[#00d4ff]/50 text-center py-8">
            No games scheduled for this date
          </div>
        ) : (
          <div className="overflow-y-auto flex-1 space-y-3 pr-2">
            {fixtures.map((fixture) => (
              <button
                key={fixture.id}
                onClick={() => {
                  onSelectGame(fixture);
                  onClose();
                }}
                className="w-full glass rounded-lg p-4 hover:bg-[#00d4ff]/10 transition-all text-left group"
              >
                 <div className="flex items-center gap-4">
                  {/* Home Team */}
                  <div className="flex items-center gap-2 flex-1">
                    <img 
                      src={fixture.homeTeam.logo} 
                      alt={fixture.homeTeam.name}
                      className="w-8 h-8 object-contain"
                    />
                    <span className="text-sm text-white hidden sm:block">{fixture.homeTeam.name}</span>
                  </div>
                  
                  <span className="text-[#00d4ff] font-bold">VS</span>
                  
                  {/* Away Team */}
                  <div className="flex items-center gap-2 flex-1">
                    <img 
                      src={fixture.awayTeam.logo} 
                      alt={fixture.awayTeam.name}
                      className="w-8 h-8 object-contain"
                    />
                    <span className="text-sm text-white hidden sm:block">{fixture.awayTeam.name}</span>
                  </div>
                </div>
                
                {/* League info */}
                <div className="mt-2 flex items-center gap-2 text-xs text-[#00d4ff]/50">
                  <img src={fixture.leagueLogo} alt={fixture.league} className="w-4 h-4 object-contain" />
                  <span>{fixture.league}</span>
                  <span>•</span>
                  <span>{fixture.time ? new Date(fixture.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'TBA'}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
