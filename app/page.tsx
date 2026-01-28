'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import EmptyCard from '@/components/EmptyCard';
import GameSelectorModal from '@/components/GameSelectorModal';
import AnalyticsCard from '@/components/AnalyticsCard';
import { Card, Team, Fixture } from '@/types';
import { searchTeams, getTodaysFixtures } from '@/lib/footballApi';

const STORAGE_KEY = 'analitika-cards';

export default function Home() {
  const [cards, setCards] = useState<Card[]>([{ 
    id: '1', 
    homeTeam: null, 
    awayTeam: null, 
    analytics: null, 
    isLoading: false, 
    error: null 
  }]);

  // Load from LocalStorage on mount
  useEffect(() => {
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
    try {
      const cardsToSave = cards.filter(c => c.homeTeam && c.awayTeam);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cardsToSave));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [cards]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);

  const handleEmptyCardClick = (cardId: string) => {
    setActiveCardId(cardId);
    setIsModalOpen(true);
  };

  const handleSelectGame = (fixture: Fixture) => {
    if (!activeCardId) return;

    // Update card with teams and odds
    setCards(prev => prev.map(card => 
      card.id === activeCardId 
        ? { 
            ...card, 
            homeTeam: fixture.homeTeam, 
            awayTeam: fixture.awayTeam, 
            fixtureId: fixture.id,
            odds: fixture.odds,
            isLoading: true 
          }
        : card
    ));

    setIsModalOpen(false);
    setActiveCardId(null);

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

  return (
    <div className="min-h-screen bg-[#0a0a0f] font-mono">
      <Header />
      
      <main className="flex-1 px-4 pb-8">
        <div className="mx-auto max-w-7xl">
          {/* Responsive Grid - 1 mobile, 2 tablet, 3 desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
    </div>
  );
}
