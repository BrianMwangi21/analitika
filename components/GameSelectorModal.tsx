'use client';

import { useState, useEffect } from 'react';
import { X, Calendar, Search } from 'lucide-react';
import { Fixture } from '@/types';
import { getTodaysFixtures } from '@/lib/footballApi';

interface GameSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectGame: (fixture: Fixture) => void;
}

export default function GameSelectorModal({ isOpen, onClose, onSelectGame }: GameSelectorModalProps) {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [filteredFixtures, setFilteredFixtures] = useState<Fixture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      fetchFixtures();
    }
  }, [isOpen, selectedDate]);

  // Filter fixtures when search query changes
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredFixtures(fixtures);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = fixtures.filter(fixture => 
        fixture.homeTeam.name.toLowerCase().includes(query) ||
        fixture.awayTeam.name.toLowerCase().includes(query)
      );
      setFilteredFixtures(filtered);
    }
  }, [searchQuery, fixtures]);

  const fetchFixtures = async () => {
    setLoading(true);
    setError(null);
    setSearchQuery(''); // Clear search when fetching new date
    
    try {
      const games = await getTodaysFixtures();
      setFixtures(games);
      setFilteredFixtures(games);
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
      
      <div className="relative glass rounded-xl p-4 md:p-6 w-full max-w-2xl mx-4 animate-slide-up max-h-[85vh] overflow-hidden flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 md:top-4 md:right-4 p-2 text-[#00d4ff]/60 hover:text-[#00d4ff] transition-colors touch-manipulation"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg md:text-xl font-bold text-gradient mb-3 md:mb-4">
          Select Game
        </h2>

        {/* Date selector */}
        <div className="mb-2 md:mb-3">
          <div className="flex items-center gap-2 glass rounded-lg p-2">
            <Calendar className="w-4 h-4 md:w-5 md:h-5 text-[#00d4ff] flex-shrink-0" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-white focus:outline-none text-sm md:text-base w-full"
            />
          </div>
        </div>

        {/* Search filter */}
        <div className="mb-3 md:mb-4">
          <div className="flex items-center gap-2 glass rounded-lg p-2">
            <Search className="w-4 h-4 md:w-5 md:h-5 text-[#00d4ff]/50 flex-shrink-0" />
            <input
              type="text"
              placeholder="Filter by team name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-white focus:outline-none w-full placeholder-[#00d4ff]/50 text-sm md:text-base"
            />
          </div>
        </div>

        {/* Results count */}
        {!loading && !error && filteredFixtures.length > 0 && (
          <div className="text-[10px] md:text-xs text-[#00d4ff]/50 mb-2">
            Showing {filteredFixtures.length} of {fixtures.length} games
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-6 md:py-8">
            <div className="animate-pulse text-[#00d4ff] text-sm">Loading games...</div>
          </div>
        ) : error ? (
          <div className="text-red-400 text-center py-6 md:py-8 text-sm">{error}</div>
        ) : filteredFixtures.length === 0 ? (
          <div className="text-[#00d4ff]/50 text-center py-6 md:py-8 text-sm">
            {searchQuery ? 'No teams match your search' : 'No games scheduled for this date'}
          </div>
        ) : (
          <div className="overflow-y-auto flex-1 space-y-2 md:space-y-3 pr-2">
            {filteredFixtures.map((fixture) => (
              <button
                key={fixture.id}
                onClick={() => {
                  onSelectGame(fixture);
                  onClose();
                }}
                className="w-full glass rounded-lg p-3 md:p-4 hover:bg-[#00d4ff]/10 transition-all text-left group touch-manipulation"
              >
                 <div className="flex items-center gap-2 md:gap-4">
                  {/* Home Team */}
                  <div className="flex items-center gap-1 md:gap-2 flex-1 min-w-0">
                    <img 
                      src={fixture.homeTeam.logo} 
                      alt={fixture.homeTeam.name}
                      className="w-6 h-6 md:w-8 md:h-8 object-contain flex-shrink-0"
                    />
                    <span className="text-xs md:text-sm text-white truncate">{fixture.homeTeam.name}</span>
                  </div>
                  
                  <span className="text-[#00d4ff] font-bold text-sm md:text-base flex-shrink-0">VS</span>
                  
                  {/* Away Team */}
                  <div className="flex items-center gap-1 md:gap-2 flex-1 min-w-0">
                    <img 
                      src={fixture.awayTeam.logo} 
                      alt={fixture.awayTeam.name}
                      className="w-6 h-6 md:w-8 md:h-8 object-contain flex-shrink-0"
                    />
                    <span className="text-xs md:text-sm text-white truncate">{fixture.awayTeam.name}</span>
                  </div>
                </div>
                
                {/* League info with UTC time */}
                <div className="mt-1 md:mt-2 flex items-center gap-1 md:gap-2 text-[10px] md:text-xs text-[#00d4ff]/50">
                  <img src={fixture.leagueLogo} alt={fixture.league} className="w-3 h-3 md:w-4 md:h-4 object-contain flex-shrink-0" />
                  <span className="truncate max-w-[80px] md:max-w-none">{fixture.league}</span>
                  <span>•</span>
                  <span>
                    {fixture.time 
                      ? new Date(fixture.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', timeZoneName: 'short'})
                      : 'TBA'}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
