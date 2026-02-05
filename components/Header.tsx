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
    <header className="w-full pt-8 md:pt-10 pb-6 px-4">
      <div className="mx-auto max-w-7xl flex flex-col items-center text-center gap-4">
        <div className="hud-pill">
          <span className="hud-dot" />
          live signal
        </div>
        <div>
          <h1 className="font-display text-4xl md:text-6xl text-holo mb-2">
            analitika
          </h1>
          <p className="text-[10px] md:text-xs tracking-[0.35em] uppercase text-white/60">
            leo mhindi hashindi
          </p>
        </div>

        <div className="flex flex-col items-center gap-2">
          <button
            onClick={onAnalyzeClick}
            disabled={!hasEnoughOdds || isAnalyzing}
            className={`relative inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${
              hasEnoughOdds && !isAnalyzing
                ? 'btn-primary'
                : 'btn-ghost cursor-not-allowed opacity-60'
            }`}
          >
            <Brain className="w-4 h-4" />
            <span>
              {isAnalyzing ? 'Analyzing...' : `Analyze Odds ${selectedOddsCount > 0 ? `(${selectedOddsCount})` : ''}`}
            </span>
          </button>
          {!hasEnoughOdds && (
            <p className="text-[10px] md:text-xs text-white/40">
              Select 2 or more odds to analyze
            </p>
          )}
        </div>
      </div>
    </header>
  );
}
