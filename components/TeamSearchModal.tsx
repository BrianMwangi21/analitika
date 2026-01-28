'use client';

import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Team } from '@/types';
import { searchTeams } from '@/lib/footballApi';

interface TeamSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTeams: (homeTeam: Team, awayTeam: Team) => void;
}

export default function TeamSearchModal({ isOpen, onClose, onSelectTeams }: TeamSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [homeTeam, setHomeTeam] = useState<Team | null>(null);
  const [awayTeam, setAwayTeam] = useState<Team | null>(null);
  const [searchResults, setSearchResults] = useState<Team[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (searchQuery.length > 2) {
      setIsSearching(true);
      const timeoutId = setTimeout(async () => {
        const teams = await searchTeams(searchQuery);
        setSearchResults(teams);
        setIsSearching(false);
      }, 300);
      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleSelectTeam = (team: Team) => {
    if (!homeTeam) {
      setHomeTeam(team);
      setSearchQuery('');
      setSearchResults([]);
    } else if (!awayTeam && team.id !== homeTeam.id) {
      setAwayTeam(team);
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  const handleContinue = () => {
    if (homeTeam && awayTeam) {
      onSelectTeams(homeTeam, awayTeam);
      // Reset for next time
      setHomeTeam(null);
      setAwayTeam(null);
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  const handleClose = () => {
    setHomeTeam(null);
    setAwayTeam(null);
    setSearchQuery('');
    setSearchResults([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      <div className="relative glass rounded-xl p-6 w-full max-w-md mx-4 animate-slide-up">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-[#00d4ff]/60 hover:text-[#00d4ff] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-gradient mb-6">
          {!homeTeam ? 'Select Home Team' : !awayTeam ? 'Select Away Team' : 'Confirm Selection'}
        </h2>

        {(homeTeam || awayTeam) && (
          <div className="flex items-center justify-between mb-6 p-3 glass rounded-lg">
            <div className="flex items-center gap-2">
              {homeTeam && (
                <>
                  <img src={homeTeam.logo} alt={homeTeam.name} className="w-8 h-8 object-contain" />
                  <span className="text-sm text-white">{homeTeam.name}</span>
                </>
              )}
            </div>
            <span className="text-[#00d4ff] font-bold">VS</span>
            <div className="flex items-center gap-2">
              {awayTeam && (
                <>
                  <span className="text-sm text-white">{awayTeam.name}</span>
                  <img src={awayTeam.logo} alt={awayTeam.name} className="w-8 h-8 object-contain" />
                </>
              )}
            </div>
          </div>
        )}

        {!awayTeam && (
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#00d4ff]/50" />
            <input
              type="text"
              placeholder={!homeTeam ? "Search for home team..." : "Search for away team..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 glass rounded-lg text-white placeholder-[#00d4ff]/50 
                focus:outline-none focus:border-[#00d4ff]/60 transition-colors"
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#00d4ff]/50 text-xs">
                Searching...
              </div>
            )}
          </div>
        )}

        {searchResults.length > 0 && (
          <div className="max-h-60 overflow-y-auto glass rounded-lg mb-4">
            {searchResults.map((team) => (
              <button
                key={team.id}
                onClick={() => handleSelectTeam(team)}
                className="w-full flex items-center gap-3 p-3 hover:bg-[#00d4ff]/10 
                  transition-colors border-b border-[#00d4ff]/10 last:border-0"
              >
                <img src={team.logo} alt={team.name} className="w-8 h-8 object-contain" />
                <span className="text-white text-left">{team.name}</span>
              </button>
            ))}
          </div>
        )}

        {homeTeam && awayTeam && (
          <button
            onClick={handleContinue}
            className="w-full py-3 bg-[#00d4ff]/20 border border-[#00d4ff]/50 rounded-lg 
              text-[#00d4ff] font-semibold hover:bg-[#00d4ff]/30 hover:glow transition-all"
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
}
