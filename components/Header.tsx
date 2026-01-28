'use client';

import { Brain } from 'lucide-react';

interface HeaderProps {
  selectedOddsCount: number;
  onAnalyzeClick: () => void;
  isAnalyzing?: boolean;
}

export default function Header({ selectedOddsCount, onAnalyzeClick, isAnalyzing = false }: HeaderProps) {
  const hasEnoughOdds = selectedOddsCount >= 2;

  return (
    <header className="w-full py-6 md:py-8 px-4 text-center">
      <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-2">
        analitika
      </h1>
      <p className="text-xs md:text-sm text-[#00d4ff]/70 tracking-wider mb-4">
        click odds to analyze
      </p>

      {/* Analyze Odds Button */}
      <button
        onClick={onAnalyzeClick}
        disabled={!hasEnoughOdds || isAnalyzing}
        className={`
          relative inline-flex items-center gap-2 px-6 py-3 rounded-lg
          font-semibold text-sm transition-all duration-300
          ${hasEnoughOdds && !isAnalyzing
            ? 'bg-gradient-to-r from-[#00d4ff] to-[#0066cc] text-black shadow-[0_0_20px_rgba(0,212,255,0.4)] hover:shadow-[0_0_30px_rgba(0,212,255,0.6)] hover:scale-105'
            : 'glass text-[#00d4ff]/50 cursor-not-allowed'
          }
        `}
      >
        <Brain className="w-4 h-4" />
        <span>
          {isAnalyzing ? 'Analyzing...' : `Analyze Odds ${selectedOddsCount > 0 ? `(${selectedOddsCount})` : ''}`}
        </span>

        {/* Tooltip for disabled state */}
        {!hasEnoughOdds && selectedOddsCount > 0 && (
          <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] text-[#00d4ff]/60 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Select at least 2 odds
          </span>
        )}
      </button>

      {/* Helper text */}
      {!hasEnoughOdds && (
        <p className="mt-3 text-[10px] md:text-xs text-[#00d4ff]/40">
          Select 2 or more odds to analyze
        </p>
      )}
    </header>
  );
}
