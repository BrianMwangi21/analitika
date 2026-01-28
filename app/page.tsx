'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Github } from 'lucide-react';
import Header from '@/components/Header';
import EmptyCard from '@/components/EmptyCard';
import GameSelectorModal from '@/components/GameSelectorModal';
import AnalyticsCard from '@/components/AnalyticsCard';
import { Card, Fixture } from '@/types';
import { getFixtureOdds } from '@/lib/footballApi';

const STORAGE_KEY = 'analitika-cards';

// Default initial card that matches SSR
const getDefaultCards = (): Card[] => [{ 
  id: 'initial', 
  homeTeam: null, 
  awayTeam: null, 
  analytics: null, 
  isLoading: false, 
  error: null 
}];

export default function Home() {
  const router = useRouter();
  
  // Start with default state to match SSR
  const [cards, setCards] = useState<Card[]>(getDefaultCards);
  const [mounted, setMounted] = useState(false);

  // Track selected odds across all cards
  const [selectedOddsMap, setSelectedOddsMap] = useState<Record<string, any[]>>({});

  // Calculate total selected odds
  const totalSelectedOdds = Object.values(selectedOddsMap).reduce((total, odds) => total + odds.length, 0);

  // Load from localStorage after mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    
    try {
      const savedCards = localStorage.getItem(STORAGE_KEY);
      if (savedCards) {
        const parsed = JSON.parse(savedCards) as Card[];
        // Add empty card if no empty card exists
        if (!parsed.some(c => !c.homeTeam && !c.awayTeam)) {
          parsed.push({ 
            id: Date.now().toString(), 
            homeTeam: null, 
            awayTeam: null, 
            analytics: null, 
            isLoading: false, 
            error: null 
          });
        }
        setCards(parsed);
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  }, []);

  // Save to LocalStorage when cards change, exclude empty cards
  useEffect(() => {
    if (!mounted) return;
    
    try {
      const cardsToSave = cards.filter(c => c.homeTeam && c.awayTeam);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cardsToSave));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [cards, mounted]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  const handleEmptyCardClick = (cardId: string) => {
    setActiveCardId(cardId);
    setIsModalOpen(true);
  };

  const handleSelectGame = async (fixture: Fixture) => {
    if (!activeCardId) return;

    // First update card with teams and fixture info (fast)
    setCards(prev => prev.map(card => 
      card.id === activeCardId 
        ? { 
            ...card, 
            homeTeam: fixture.homeTeam, 
            awayTeam: fixture.awayTeam, 
            fixtureId: fixture.id,
            time: fixture.time,
            league: fixture.league,
            leagueLogo: fixture.leagueLogo,
            isLoading: true 
          }
        : card
    ));

    setIsModalOpen(false);
    setActiveCardId(null);

    // Then fetch odds separately (async)
    const odds = await getFixtureOdds(fixture.id);
    
    // Update card with odds once fetched
    setCards(prev => prev.map(card => 
      card.id === activeCardId 
        ? { ...card, odds: odds || undefined }
        : card
    ));

    // Add new empty card
    setCards(prev => [...prev, { 
      id: Date.now().toString(), 
      homeTeam: null, 
      awayTeam: null, 
      analytics: null, 
      isLoading: false, 
      error: null 
    }]);
  };

  const handleDeleteCard = (cardId: string) => {
    setCards(prev => {
      const filtered = prev.filter(card => card.id !== cardId);
      // Remove selected odds for this card
      setSelectedOddsMap(prev => {
        const newMap = { ...prev };
        delete newMap[cardId];
        return newMap;
      });
      // Keep at least one empty card
      if (filtered.length === 0 || !filtered.some(c => !c.homeTeam && !c.awayTeam)) {
        return [...filtered, { 
          id: Date.now().toString(), 
          homeTeam: null, 
          awayTeam: null, 
          analytics: null, 
          isLoading: false, 
          error: null 
        }];
      }
      return filtered;
    });
  };

  // Handle selected odds changes from cards
  const handleSelectedOddsChange = useCallback((cardId: string, odds: any[]) => {
    setSelectedOddsMap(prev => {
      // Only update if actually changed
      const prevOdds = prev[cardId];
      if (JSON.stringify(prevOdds) === JSON.stringify(odds)) {
        return prev;
      }
      return {
        ...prev,
        [cardId]: odds
      };
    });
  }, []);

  // Handle analyze button click
  const handleAnalyzeClick = () => {
    // Gather all selected odds with card details
    const allSelectedOdds = Object.entries(selectedOddsMap).flatMap(([cardId, odds]) => 
      odds.map(odd => {
        const card = cards.find(c => c.id === cardId);
        return {
          ...odd,
          cardId,
          homeTeam: card?.homeTeam,
          awayTeam: card?.awayTeam,
          fixtureId: card?.fixtureId
        };
      })
    );

    // Save to localStorage for the analysis page
    localStorage.setItem('analitika-selected-odds', JSON.stringify(allSelectedOdds));
    
    // Navigate to analysis page
    router.push('/analysis');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] font-mono">
      <Header 
        selectedOddsCount={totalSelectedOdds}
        onAnalyzeClick={handleAnalyzeClick}
      />
      
      <main className="flex-1 px-4 pb-8">
        <div className="mx-auto max-w-7xl">
          {/* Responsive Grid - 1 mobile, 2 tablet, 3 desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {cards.map((card, index) => (
              // Staggered animation based on index
              <div 
                key={card.id} 
                className={`animate-slide-up card-stagger-${Math.min(index + 1, 6)}`}
              >
                {!card.homeTeam && !card.awayTeam ? (
                  <EmptyCard 
                    onClick={() => handleEmptyCardClick(card.id)} 
                  />
                ) : (
                  <AnalyticsCard 
                    card={card} 
                    onDelete={handleDeleteCard}
                    onSelectedOddsChange={(odds) => handleSelectedOddsChange(card.id, odds)}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

      <GameSelectorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectGame={handleSelectGame}
      />

      {/* Footer */}
      <footer className="w-full py-6 px-4 border-t border-[#00d4ff]/10 mt-8">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center gap-3">
          <span className="text-[#00d4ff]/60 text-sm">
            Made with <span className="text-red-400">love</span> by Kabiru
          </span>
          <a
            href="https://github.com/BrianMwangi21/analitika"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[#00d4ff]/60 hover:text-[#00d4ff] transition-colors text-sm"
          >
            <Github className="w-4 h-4" />
            <span>GitHub</span>
          </a>
        </div>
      </footer>
    </div>
  );
}
